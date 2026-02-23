#!/bin/bash
set -euo pipefail

echo "🕉️  Pooja Platform - Kubernetes Deployment"
echo "============================================"

# Check prerequisites
command -v kubectl >/dev/null 2>&1 || { echo "❌ kubectl not found. Install it first."; exit 1; }
command -v docker >/dev/null 2>&1 || { echo "❌ docker not found. Install it first."; exit 1; }

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

echo ""
echo "📦 Step 1: Building Docker images..."
cd "$PROJECT_DIR"

SERVICES="api-gateway user-auth-service product-service pandit-service order-service rag-ai-service payment-service notification-service"

for svc in $SERVICES; do
    echo "  🔨 Building $svc..."
    docker build -t "pooja-platform/$svc:latest" -f "$svc/Dockerfile" . 2>&1 | tail -1
done

echo "  🔨 Building frontend..."
docker build -t "pooja-platform/frontend:latest" \
  --build-arg NEXT_PUBLIC_API_URL=http://api-gateway:8080 \
  -f frontend/Dockerfile frontend/ 2>&1 | tail -1

echo ""
echo "🚀 Step 2: Applying Kubernetes manifests..."

# Apply in order
kubectl apply -f k8s/base/00-namespace.yaml
echo "  ✅ Namespace created"

kubectl apply -f k8s/base/01-postgres.yaml
kubectl apply -f k8s/base/02-redis.yaml
kubectl apply -f k8s/base/03-kafka.yaml
echo "  ✅ Infrastructure deployed"

echo "  ⏳ Waiting for infrastructure to be ready..."
kubectl wait --for=condition=ready pod -l app=postgres -n pooja-platform --timeout=120s 2>/dev/null || echo "  ⚠️  Postgres still starting..."
kubectl wait --for=condition=ready pod -l app=redis -n pooja-platform --timeout=60s 2>/dev/null || echo "  ⚠️  Redis still starting..."
sleep 10  # Give Kafka extra time

echo ""
echo "🎯 Step 3: Deploying microservices..."
for manifest in k8s/base/1*.yaml; do
    kubectl apply -f "$manifest"
done
echo "  ✅ All services deployed"

kubectl apply -f k8s/base/20-hpa.yaml 2>/dev/null || echo "  ⚠️  HPA requires metrics-server (optional)"

echo ""
echo "📊 Step 4: Checking deployment status..."
sleep 5
kubectl get pods -n pooja-platform

echo ""
echo "============================================"
echo "🎉 Deployment complete!"
echo ""
echo "Frontend:    kubectl port-forward svc/frontend 3000:3000 -n pooja-platform"
echo "API Gateway: kubectl port-forward svc/api-gateway 8080:8080 -n pooja-platform"
echo "Prometheus:  kubectl port-forward svc/prometheus 9090:9090 -n pooja-platform"
echo ""
echo "Open: http://localhost:3000"
echo "API:  http://localhost:8080/actuator/health"
echo "============================================"
