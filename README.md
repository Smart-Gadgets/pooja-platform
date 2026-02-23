# 🙏 Pooja Platform — Complete Setup & Run Guide

> **Your Sacred Marketplace** — A production-ready microservices e-commerce platform for Hindu pooja items and pandit marketplace, with AI-powered spiritual guidance.

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Project Structure](#2-project-structure)
3. [Quick Start (Docker Compose)](#3-quick-start-docker-compose)
4. [Environment Variables](#4-environment-variables)
5. [Running with Docker Compose (Step by Step)](#5-running-with-docker-compose-step-by-step)
6. [Running the Frontend Separately (Development)](#6-running-the-frontend-separately-development)
7. [Kubernetes Deployment](#7-kubernetes-deployment)
8. [Verifying Everything Works](#8-verifying-everything-works)
9. [Default Credentials & Demo Data](#9-default-credentials--demo-data)
10. [API Endpoints Reference](#10-api-endpoints-reference)
11. [Services & Ports](#11-services--ports)
12. [Stopping & Cleanup](#12-stopping--cleanup)
13. [Testing & Code Quality](#13-testing--code-quality)
14. [Troubleshooting](#14-troubleshooting)

---

## 1. Prerequisites

Install the following on your machine before proceeding:

| Tool | Version | Purpose | Install |
|------|---------|---------|---------|
| **Docker Desktop** | 4.x+ | Containers & orchestration | [docker.com/get-docker](https://docs.docker.com/get-docker/) |
| **Docker Compose** | v2+ (bundled with Docker Desktop) | Multi-container orchestration | Included with Docker Desktop |
| **JDK** | 17+ | Backend build & local dev | [adoptium.net](https://adoptium.net/) |
| **Gradle** | 8.12+ | Build system (or use IDE) | [gradle.org](https://gradle.org/install/) |
| **Node.js** | 20.x+ | Frontend (optional, only for local dev) | [nodejs.org](https://nodejs.org/) |

**For Kubernetes deployment (optional):**

| Tool | Purpose |
|------|---------|
| **kubectl** | Kubernetes CLI |
| **Minikube** or **Docker Desktop K8s** | Local Kubernetes cluster |

**System Requirements:**
- RAM: Minimum 8 GB (16 GB recommended — the full stack runs ~10 containers)
- Disk: 5 GB free space for Docker images
- OS: macOS, Linux, or Windows with WSL2

### First-Time Setup: Generate Gradle Wrapper

After extracting the project, generate the Gradle wrapper (one-time step):

```bash
cd pooja-platform
gradle wrapper --gradle-version 8.12
```

This creates `gradlew`, `gradlew.bat`, and `gradle/wrapper/gradle-wrapper.jar`. After this, use `./gradlew` instead of `gradle` for all commands.

> **Note:** If you use IntelliJ IDEA, just open the project — it handles Gradle automatically.

---

## 2. Project Structure

```
pooja-platform/
│
├── api-gateway/                 # Spring Cloud Gateway (port 8080)
├── user-auth-service/           # Auth, JWT, roles (port 8081)
├── product-service/             # Product CRUD, search (port 8082)
├── pandit-service/              # Pandit profiles & content (port 8083)
├── order-service/               # Cart, orders, bookings (port 8084)
├── rag-ai-service/              # AI chat with PGVector RAG (port 8085)
├── payment-service/             # Razorpay integration (port 8086)
├── notification-service/        # Kafka email/SMS consumer (port 8087)
│
├── frontend/                    # Next.js 14 web app (port 3000)
│   ├── src/app/                 # Pages (home, products, pandits, AI, cart, etc.)
│   ├── src/components/          # Navbar, Footer
│   ├── src/lib/                 # API client, stores, types, sample data
│   ├── Dockerfile
│   ├── package.json
│   └── .env.example
│
├── k8s/base/                    # Kubernetes manifests
│   ├── 00-namespace.yaml        # Namespace + ConfigMap + Secrets
│   ├── 01-postgres.yaml         # PostgreSQL with pgvector
│   ├── 02-redis.yaml            # Redis
│   ├── 03-kafka.yaml            # Zookeeper + Kafka
│   ├── 10-17-*.yaml             # All 8 backend services
│   ├── 18-frontend.yaml         # Frontend deployment
│   ├── 20-hpa.yaml              # Horizontal Pod Autoscalers
│   └── 25-ingress.yaml          # Optional Nginx Ingress
│
├── scripts/
│   ├── deploy-k8s.sh            # Automated K8s deployment script
│   └── prometheus.yml           # Prometheus scrape config
│
├── docker-compose.yml           # Full stack orchestration
├── build.gradle.kts             # Root Gradle build (Kotlin/Spring Boot)
├── settings.gradle.kts          # Multi-module project config
├── .env.example                 # Backend environment template
├── .gitignore
└── README.md                    # ← You are here
```

---

## 3. Quick Start

### Demo Accounts

After starting the platform, these accounts are automatically seeded:

| Role | Email | Password | Dashboard Features |
|------|-------|----------|-------------------|
| **👑 Admin** | `admin@pooja.com` | `admin123` | User management, product approval, pandit verification, order management |
| **🙏 Customer** | `customer@pooja.com` | `customer123` | Order history, bookings, cart, AI guide |
| **🏪 Seller** | `seller@pooja.com` | `seller123` | Product management, revenue tracking, order fulfillment |
| **🙏 Pandit** | `pandit@pooja.com` | `pandit123` | Booking management, profile, content, earnings |
| **🏪 Seller 2** | `seller2@pooja.com` | `seller123` | Same as Seller |
| **🙏 Pandit 2** | `pandit2@pooja.com` | `pandit123` | Same as Pandit |

> **Login:** Go to `http://localhost:3000/auth/login` — click any demo account button to auto-fill credentials.
> **Dashboard:** After login, you're redirected to `/dashboard` which shows a role-specific view. (Docker Compose)

**If you just want to get everything running fast, do this:**

```bash
# 1. Clone / extract the project
cd pooja-platform

# 2. Copy environment file
cp .env.example .env

# 3. (Optional) Edit .env to add real API keys — see Section 4
#    The platform works without them; AI chat and payments will be mocked.

# 4. Start everything
docker-compose up -d

# 5. Wait 60-90 seconds for all services to initialize, then open:
#    Frontend:    http://localhost:3000
#    API Gateway: http://localhost:8080
#    Grafana:     http://localhost:3001 (admin/admin)
```

That's it. All 10+ containers (Postgres, Redis, Kafka, 8 backend services, frontend, Prometheus, Grafana) will start automatically.

---

## 4. Environment Variables

### Backend `.env` (project root)

Copy the template and edit as needed:

```bash
cp .env.example .env
```

Open `.env` in any text editor and configure:

```env
# ========================================
# REQUIRED FOR FULL FUNCTIONALITY
# ========================================

# OpenAI API Key — needed for AI Spiritual Guide chat
# Get one at: https://platform.openai.com/api-keys
# Without this, the AI assistant page will show a fallback message.
OPENAI_API_KEY=sk-your-openai-api-key-here

# Razorpay — needed for payment processing
# Get keys at: https://dashboard.razorpay.com/app/keys
# Without this, checkout will simulate payments.
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret

# ========================================
# OPTIONAL — defaults work for local dev
# ========================================

# Database (defaults already configured in docker-compose.yml)
# DB_HOST=postgres
# DB_PORT=5432
# DB_NAME=pooja_db
# DB_USER=pooja
# DB_PASSWORD=pooja_secret

# JWT Secret (change in production — minimum 256 bits)
# JWT_SECRET=pooja-platform-super-secret-key-change-in-production-minimum-256-bits-long
```

### Frontend `.env.local` (frontend/ directory)

Only needed if running the frontend **outside** Docker for development:

```bash
cd frontend
cp .env.example .env.local
```

```env
# Points to the backend API Gateway
NEXT_PUBLIC_API_URL=http://localhost:8080
```

> **Note:** When running via `docker-compose`, the frontend's API URL is pre-configured. You don't need to touch this.

---

## 5. Running with Docker Compose (Step by Step)

### Step 1: Ensure Docker is Running

```bash
docker --version    # Should show Docker version
docker-compose --version  # or: docker compose version
```

On macOS, open Docker Desktop and make sure the whale icon in the menu bar shows "Docker Desktop is running."

### Step 2: Copy Environment File

```bash
cd pooja-platform
cp .env.example .env
```

Edit `.env` if you have OpenAI/Razorpay keys (optional for basic testing).

### Step 3: Build & Start All Services

```bash
# Build all images and start containers in the background
docker-compose up -d --build
```

First build takes **5–10 minutes** (downloads JDK, Gradle dependencies, node_modules). Subsequent starts are much faster.

### Step 4: Monitor Startup

```bash
# Watch all containers come up
docker-compose ps

# Stream logs from all services
docker-compose logs -f

# Or watch a specific service
docker-compose logs -f api-gateway
docker-compose logs -f frontend
```

### Step 5: Wait for Health Checks

The services start in this order (managed by `depends_on` + health checks):

```
PostgreSQL → Redis → Kafka → Backend Services → Frontend
```

Wait about **60–90 seconds** after `docker-compose up -d`. You can verify:

```bash
# Check all containers are healthy/running
docker-compose ps

# Test API Gateway health
curl http://localhost:8080/actuator/health

# Test frontend
curl -s http://localhost:3000 | head -5
```

### Step 6: Open the Application

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | [http://localhost:3000](http://localhost:3000) | Main website |
| **API Gateway** | [http://localhost:8080](http://localhost:8080) | Backend API entry point |
| **Grafana** | [http://localhost:3001](http://localhost:3001) | Monitoring (admin/admin) |
| **Prometheus** | [http://localhost:9090](http://localhost:9090) | Metrics |

---

## 6. Running the Frontend Separately (Development)

If you want to develop the frontend with hot-reload while the backend runs in Docker:

### Start Only Backend Services

```bash
# Start everything except frontend
docker-compose up -d postgres redis zookeeper kafka \
  api-gateway user-auth-service product-service pandit-service \
  order-service rag-ai-service payment-service notification-service
```

### Run Frontend in Dev Mode

```bash
cd frontend

# Install dependencies
npm install

# Create env file
cp .env.example .env.local
# .env.local should contain: NEXT_PUBLIC_API_URL=http://localhost:8080

# Start dev server with hot-reload
npm run dev
```

Frontend will be at [http://localhost:3000](http://localhost:3000) with instant refresh on code changes.

> **Note:** The frontend includes **sample data** that renders even when the backend is completely offline. This lets you explore the UI design without running any backend services at all.

---

## 7. Kubernetes Deployment

### Option A: Using the Automated Script

```bash
# Make the script executable
chmod +x scripts/deploy-k8s.sh

# Run the deployment
./scripts/deploy-k8s.sh
```

The script will:
1. Build all Docker images (backend + frontend)
2. Create the `pooja-platform` namespace
3. Deploy infrastructure (Postgres, Redis, Kafka)
4. Wait for infrastructure readiness
5. Deploy all microservices + frontend
6. Apply Horizontal Pod Autoscalers
7. Print status and port-forward instructions

### Option B: Manual Step-by-Step

```bash
# 1. Build Docker images
docker build -t pooja-platform/api-gateway:latest -f api-gateway/Dockerfile .
docker build -t pooja-platform/user-auth-service:latest -f user-auth-service/Dockerfile .
docker build -t pooja-platform/product-service:latest -f product-service/Dockerfile .
docker build -t pooja-platform/pandit-service:latest -f pandit-service/Dockerfile .
docker build -t pooja-platform/order-service:latest -f order-service/Dockerfile .
docker build -t pooja-platform/rag-ai-service:latest -f rag-ai-service/Dockerfile .
docker build -t pooja-platform/payment-service:latest -f payment-service/Dockerfile .
docker build -t pooja-platform/notification-service:latest -f notification-service/Dockerfile .
docker build -t pooja-platform/frontend:latest --build-arg NEXT_PUBLIC_API_URL=http://api-gateway:8080 -f frontend/Dockerfile frontend/

# 2. Apply K8s manifests in order
kubectl apply -f k8s/base/00-namespace.yaml
kubectl apply -f k8s/base/01-postgres.yaml
kubectl apply -f k8s/base/02-redis.yaml
kubectl apply -f k8s/base/03-kafka.yaml

# 3. Wait for infra
kubectl wait --for=condition=ready pod -l app=postgres -n pooja-platform --timeout=120s
kubectl wait --for=condition=ready pod -l app=redis -n pooja-platform --timeout=60s
sleep 15  # Kafka needs extra time

# 4. Deploy services
kubectl apply -f k8s/base/10-api-gateway.yaml
kubectl apply -f k8s/base/11-user-auth-service.yaml
kubectl apply -f k8s/base/12-product-service.yaml
kubectl apply -f k8s/base/13-pandit-service.yaml
kubectl apply -f k8s/base/14-order-service.yaml
kubectl apply -f k8s/base/15-rag-ai-service.yaml
kubectl apply -f k8s/base/16-payment-service.yaml
kubectl apply -f k8s/base/17-notification-service.yaml
kubectl apply -f k8s/base/18-frontend.yaml
kubectl apply -f k8s/base/20-hpa.yaml

# 5. Port-forward to access
kubectl port-forward svc/frontend 3000:3000 -n pooja-platform &
kubectl port-forward svc/api-gateway 8080:8080 -n pooja-platform &
```

### Updating K8s Secrets

Edit `k8s/base/00-namespace.yaml` to set your secrets (base64-encoded):

```bash
# Encode your values
echo -n "sk-your-openai-key" | base64
echo -n "rzp_test_your_key" | base64
```

Then replace the values in the Secret section of `00-namespace.yaml`.

---

## 8. Verifying Everything Works

### Health Check

```bash
curl http://localhost:8080/actuator/health
# Expected: {"status":"UP"}
```

### Test Login

```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@pooja.com","password":"admin123"}'
```

Expected response (JWT tokens + user info):

```json
{
  "accessToken": "eyJhbGci...",
  "refreshToken": "...",
  "user": {
    "id": "...",
    "name": "Admin",
    "email": "admin@pooja.com",
    "role": "ADMIN"
  }
}
```

### Test Product Listing

```bash
curl http://localhost:8080/api/v1/products/public
```

### Test AI Chat (requires OPENAI_API_KEY)

```bash
curl -X POST http://localhost:8080/api/v1/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"How to perform Ganesh puja at home?","language":"en"}'
```

### Frontend Smoke Test

Open [http://localhost:3000](http://localhost:3000) in your browser. You should see:
- Landing page with hero section, categories, featured products
- Navigation to Products, Pandits, AI Guide, About pages
- Sign In / Get Started buttons

---

## 9. Default Credentials & Demo Data

### Admin Account

| Field | Value |
|-------|-------|
| Email | `admin@pooja.com` |
| Password | `admin123` |
| Role | ADMIN |

### Seed Data (auto-created on first startup)

**Products** (5 items):
- Complete Ganesh Chaturthi Puja Kit — ₹1,499
- Handcrafted Brass Diya Set (5 pcs) — ₹899
- Premium Nag Champa Agarbatti — ₹449
- Navratri Special Pooja Thali Set — ₹2,499
- 5 Mukhi Rudraksha Mala — ₹3,999

**RAG Knowledge Base** (5 entries):
- Ganesh Chaturthi rituals
- Navratri celebrations
- Satyanarayan Katha
- Griha Pravesh ceremony
- Muhurat guidance

---

## 10. API Endpoints Reference

### Authentication (`/api/v1/auth`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/register` | No | Register new user |
| POST | `/login` | No | Login, returns JWT |
| POST | `/refresh` | No | Refresh access token |
| GET | `/profile` | Yes | Get current user profile |
| PUT | `/profile` | Yes | Update profile |

### Products (`/api/v1/products`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/public` | No | List all approved products |
| GET | `/public/{id}` | No | Get product by ID |
| GET | `/public/featured` | No | Featured products |
| POST | `/search` | No | Search products |
| POST | `/` | Yes (SELLER) | Create product |
| PUT | `/{id}` | Yes (SELLER) | Update product |
| POST | `/{id}/approve` | Yes (ADMIN) | Approve product |

### Pandits (`/api/v1/pandits`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/public` | No | List verified pandits |
| GET | `/public/{id}` | No | Get pandit profile |
| POST | `/search` | No | Search pandits |
| POST | `/profile` | Yes (PANDIT) | Create/update profile |
| POST | `/content` | Yes (PANDIT) | Add blog/video |
| POST | `/{id}/verify` | Yes (ADMIN) | Verify pandit |

### Orders (`/api/v1/orders`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/cart` | Yes | View cart |
| POST | `/cart` | Yes | Add to cart |
| DELETE | `/cart/{id}` | Yes | Remove from cart |
| POST | `/` (orders) | Yes | Create order |
| GET | `/` (orders) | Yes | List user orders |
| POST | `/bookings` | Yes | Create pandit booking |
| GET | `/bookings` | Yes | List bookings |

### AI Assistant (`/api/v1/ai`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/chat` | No | Chat with AI guide |
| POST | `/search` | No | Semantic search |
| POST | `/ingest` | Yes (ADMIN) | Ingest knowledge |

### Payments (`/api/v1/payments`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/create-order` | Yes | Create Razorpay order |
| POST | `/verify` | Yes | Verify payment signature |

---

## 11. Services & Ports

| Service | Port | Container Name | Technology |
|---------|------|---------------|------------|
| Frontend | 3000 | pooja-frontend | Next.js 14 |
| API Gateway | 8080 | pooja-gateway | Spring Cloud Gateway |
| Auth Service | 8081 | pooja-auth | Spring Boot + JWT |
| Product Service | 8082 | pooja-product | Spring Boot + Kafka |
| Pandit Service | 8083 | pooja-pandit | Spring Boot |
| Order Service | 8084 | pooja-order | Spring Boot + Kafka |
| RAG AI Service | 8085 | pooja-rag | Spring AI + PGVector |
| Payment Service | 8086 | pooja-payment | Spring Boot + Razorpay |
| Notification Service | 8087 | pooja-notification | Spring Boot + Kafka |
| PostgreSQL | 5432 | pooja-postgres | pgvector/pgvector:pg16 |
| Redis | 6379 | pooja-redis | Redis 7 Alpine |
| Kafka | 9092 | pooja-kafka | Confluent 7.6.0 |
| Zookeeper | 2181 | pooja-zookeeper | Confluent 7.6.0 |
| Prometheus | 9090 | pooja-prometheus | Prom v2.51.0 |
| Grafana | 3001 | pooja-grafana | Grafana 10.4.0 |

---

## 12. Stopping & Cleanup

### Stop All Containers (preserves data)

```bash
docker-compose stop
```

### Stop & Remove Containers (preserves volumes)

```bash
docker-compose down
```

### Full Cleanup (removes everything including data)

```bash
docker-compose down -v --rmi all
```

### Kubernetes Cleanup

```bash
kubectl delete namespace pooja-platform
```

---

## 13. Testing & Code Quality

### Running Tests

```bash
# Run all tests (unit + integration)
./gradlew test

# Run only unit tests
./gradlew test --tests '*Test' --exclude-task '*IntegrationTest*'

# Run integration tests (requires Docker for Testcontainers)
./gradlew test --tests '*IntegrationTest'

# Run tests for a specific service
./gradlew :user-auth-service:test
./gradlew :product-service:test
```

### Test Coverage (JaCoCo)

```bash
# Generate coverage reports per service
./gradlew test jacocoTestReport

# Generate merged coverage report
./gradlew test jacocoMergedReport
```

Coverage HTML reports will be at:
- Per-service: `<service>/build/reports/jacoco/test/html/index.html`
- Merged: `build/reports/jacoco/jacocoMergedReport/html/index.html`

### SonarQube Integration

**Start SonarQube locally:**

```bash
docker-compose -f docker-compose.sonar.yml up -d
# Wait 1-2 minutes, then open http://localhost:9000
# Default login: admin / admin (it will prompt you to change)
```

**Run analysis:**

```bash
# Generate a token in SonarQube: Administration > Security > Users > Tokens
export SONAR_TOKEN=squ_your_token_here
./gradlew test jacocoTestReport sonar
```

Results will appear in the SonarQube dashboard at http://localhost:9000.

### Test Architecture

| Service | Unit Tests | Integration Tests | What's Tested |
|---------|-----------|------------------|---------------|
| user-auth-service | AuthServiceTest, JwtServiceTest, AuthControllerTest | AuthIntegrationTest | Registration, login, JWT, profiles, validation |
| product-service | ProductServiceTest | — | CRUD, stock, approval, authorization |
| order-service | OrderServiceTest | — | Cart, orders, shipping, auth checks |
| pandit-service | PanditServiceTest | — | Profile CRUD, verification |

**Testing stack:**
- **MockK** — Kotlin-first mocking (replaces Mockito)
- **SpringMockK** — MockK integration for Spring Boot tests
- **Testcontainers** — Real PostgreSQL, Redis, Kafka in integration tests
- **JaCoCo** — Code coverage reporting
- **SonarQube** — Static analysis, code smells, security hotspots

### Makefile Shortcuts

```bash
make help              # Show all available commands
make build             # Build all services
make test              # Run all tests
make coverage          # Tests + JaCoCo reports
make sonar-up          # Start SonarQube server
make sonar             # Run SonarQube analysis
make docker-up         # Start full stack
make docker-down       # Stop all containers
make frontend-dev      # Run frontend in dev mode
make init              # First-time setup
```

---

## 14. Troubleshooting

### "Port already in use"

```bash
# Find what's using the port
lsof -i :3000  # or :8080, :5432, etc.

# Kill it, or change ports in docker-compose.yml
```

### "Container keeps restarting"

```bash
# Check logs for the specific service
docker-compose logs user-auth-service
docker-compose logs api-gateway

# Most common cause: Postgres/Kafka not ready yet
# Solution: Wait 30 more seconds, or restart the failing service:
docker-compose restart user-auth-service
```

### "Frontend can't reach backend"

- If running frontend via Docker: API URL is automatically `http://localhost:8080` (configured in docker-compose)
- If running frontend via `npm run dev`: Make sure `.env.local` has `NEXT_PUBLIC_API_URL=http://localhost:8080`
- Check that the API Gateway is running: `curl http://localhost:8080/actuator/health`

### "AI Chat not working"

- The AI service requires a valid `OPENAI_API_KEY` in `.env`
- Without it, the service starts but chat returns errors
- The frontend will show a friendly fallback message

### "Build fails — out of memory"

Docker Desktop → Settings → Resources → increase memory to 8+ GB.

### "Gradle build fails"

The backend services use JDK 21. Make sure Docker can download the build image:

```bash
docker pull eclipse-temurin:21-jdk-alpine
```

### macOS Specific: Docker Slow

- Docker Desktop → Settings → Resources → increase CPU cores to 4+
- Enable "Use Virtualization Framework" in Docker settings

---

## License

This project is for educational/demonstration purposes. Replace all placeholder API keys and secrets before any production deployment.

---

Built with 🙏 using Spring Boot 3.x, Kotlin, Next.js 14, PostgreSQL, Redis, Kafka, and Spring AI.
