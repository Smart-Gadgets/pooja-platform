<p align="center">
  <h1 align="center">🙏 Pooja Platform</h1>
  <p align="center">
    <strong>Your Sacred Marketplace</strong> — A production-grade microservices e-commerce platform<br/>for Hindu pooja items, pandit marketplace &amp; AI-powered spiritual guidance.
  </p>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Spring%20Boot-3.4.1-6DB33F?logo=springboot&logoColor=white" alt="Spring Boot">
  <img src="https://img.shields.io/badge/Kotlin-2.1.0-7F52FF?logo=kotlin&logoColor=white" alt="Kotlin">
  <img src="https://img.shields.io/badge/Next.js-14-000000?logo=nextdotjs&logoColor=white" alt="Next.js">
  <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/Redis-7-DC382D?logo=redis&logoColor=white" alt="Redis">
  <img src="https://img.shields.io/badge/Kafka-7.6-231F20?logo=apachekafka&logoColor=white" alt="Kafka">
  <img src="https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white" alt="Docker">
  <img src="https://img.shields.io/badge/Kubernetes-Ready-326CE5?logo=kubernetes&logoColor=white" alt="K8s">
</p>

---

## ✨ Key Features

| Category | Highlights |
|----------|-----------|
| 🛒 **E-Commerce** | Product catalog, cart, checkout, order tracking, multi-seller support |
| 🙏 **Pandit Marketplace** | Browse, book & review verified pandits; pandit dashboard with earnings |
| 🤖 **AI Spiritual Guide** | RAG-powered chat using Spring AI + PGVector + OpenAI for ritual guidance |
| 💳 **Payments** | Razorpay integration with order creation & signature verification |
| 📢 **Notifications** | Kafka-driven async email/SMS via dedicated notification service |
| 🔐 **Auth & RBAC** | JWT-based authentication with 4 roles — Admin, Customer, Seller, Pandit |
| 📊 **Observability** | Prometheus metrics, Grafana dashboards, Spring Actuator health checks |
| ☸️ **Cloud-Native** | Kubernetes manifests, HPA autoscaling, Nginx Ingress, Docker Compose |

---

## 🏗️ Architecture

```
                                    ┌──────────────┐
                                    │   Frontend   │
                                    │  (Next.js)   │
                                    │   :3000      │
                                    └──────┬───────┘
                                           │
                                           ▼
                                  ┌─────────────────┐
                                  │   API Gateway    │
                                  │ (Spring Cloud)   │
                                  │     :8080        │
                                  └────┬───┬───┬─────┘
                         ┌─────────────┤   │   ├──────────────┐
                         ▼             ▼   │   ▼              ▼
                 ┌──────────────┐ ┌────────┴───────┐  ┌──────────────┐
                 │  User Auth   │ │    Product     │  │   Pandit     │
                 │   Service    │ │    Service     │  │   Service    │
                 │   :8081      │ │    :8082       │  │   :8083      │
                 └──────────────┘ └────────────────┘  └──────────────┘
                         │             │                      │
            ┌────────────┼─────────────┼──────────────────────┤
            ▼            ▼             ▼                      ▼
    ┌──────────────┐ ┌──────────┐ ┌──────────────┐  ┌──────────────┐
    │    Order     │ │  RAG AI  │ │   Payment    │  │ Notification │
    │   Service    │ │  Service │ │   Service    │  │   Service    │
    │   :8084      │ │  :8085   │ │   :8086      │  │   :8087      │
    └──────┬───────┘ └────┬─────┘ └──────┬───────┘  └──────┬───────┘
           │              │              │                  │
           ▼              ▼              ▼                  ▼
    ┌─────────────────────────────────────────────────────────────┐
    │                    Infrastructure                           │
    │  ┌────────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
    │  │ PostgreSQL  │  │  Redis   │  │  Kafka   │  │ PGVector │ │
    │  │   :5432     │  │  :6379   │  │  :9092   │  │ (in PG)  │ │
    │  └────────────┘  └──────────┘  └──────────┘  └──────────┘ │
    └─────────────────────────────────────────────────────────────┘
```

---

## 📑 Table of Contents

- [Key Features](#-key-features)
- [Architecture](#️-architecture)
- [Quick Start](#-quick-start)
- [Demo Accounts](#-demo-accounts)
- [Project Structure](#-project-structure)
- [Environment Variables](#️-environment-variables)
- [Running with Docker Compose](#-running-with-docker-compose)
- [Frontend Development](#-frontend-development)
- [Kubernetes Deployment](#️-kubernetes-deployment)
- [API Reference](#-api-reference)
- [Services & Ports](#-services--ports)
- [Testing & Code Quality](#-testing--code-quality)
- [Observability](#-observability)
- [Stopping & Cleanup](#-stopping--cleanup)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🚀 Quick Start

> **Time to launch:** ~5 minutes (first build) · ~30 seconds (subsequent runs)

### Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Docker Desktop | 4.x+ | [Get Docker](https://docs.docker.com/get-docker/) |
| JDK _(local dev only)_ | 17+ | [Adoptium](https://adoptium.net/) |
| Node.js _(frontend dev only)_ | 20.x+ | [nodejs.org](https://nodejs.org/) |

> **System Requirements:** 8 GB RAM minimum (16 GB recommended) · 5 GB disk · macOS / Linux / Windows WSL2

### Three Commands to Launch

```bash
# 1 — Clone and enter the project
cd pooja-platform

# 2 — Set up environment
cp .env.example .env          # Optional: add OPENAI_API_KEY & Razorpay keys (see below)

# 3 — Launch everything 🚀
docker-compose up -d --build
```

Wait **60–90 seconds**, then open:

| What | URL |
|------|-----|
| 🌐 **Frontend** | [http://localhost:3000](http://localhost:3000) |
| ⚡ **API Gateway** | [http://localhost:8080](http://localhost:8080) |
| 📊 **Grafana** | [http://localhost:3001](http://localhost:3001) _(admin / admin)_ |
| 📈 **Prometheus** | [http://localhost:9090](http://localhost:9090) |

> **Tip:** The platform works out of the box without API keys. AI chat and payments will gracefully fall back to mock/simulated mode.

### Verify It's Running

```bash
curl http://localhost:8080/actuator/health
# → {"status":"UP"}
```

---

## 👤 Demo Accounts

These accounts are **automatically seeded** on first startup:

| Role | Email | Password | Access |
|------|-------|----------|--------|
| 👑 **Admin** | `admin@pooja.com` | `admin123` | User management, product approvals, pandit verification, order oversight |
| 🛒 **Customer** | `customer@pooja.com` | `customer123` | Browse, cart, orders, bookings, AI guide |
| 🏪 **Seller** | `seller@pooja.com` | `seller123` | Product management, revenue tracking, order fulfillment |
| 🙏 **Pandit** | `pandit@pooja.com` | `pandit123` | Booking management, profile, content, earnings |
| 🏪 **Seller 2** | `seller2@pooja.com` | `seller123` | _(additional seller for multi-vendor testing)_ |
| 🙏 **Pandit 2** | `pandit2@pooja.com` | `pandit123` | _(additional pandit for marketplace testing)_ |

> **Login:** [http://localhost:3000/auth/login](http://localhost:3000/auth/login) — click any demo account button to auto-fill credentials.  
> After login you're redirected to a **role-specific dashboard**.

### Seed Data (auto-created)

<details>
<summary><b>📦 Products (5 items)</b></summary>

| Product | Price |
|---------|-------|
| Complete Ganesh Chaturthi Puja Kit | ₹1,499 |
| Handcrafted Brass Diya Set (5 pcs) | ₹899 |
| Premium Nag Champa Agarbatti | ₹449 |
| Navratri Special Pooja Thali Set | ₹2,499 |
| 5 Mukhi Rudraksha Mala | ₹3,999 |

</details>

<details>
<summary><b>🧠 RAG Knowledge Base (5 entries)</b></summary>

- Ganesh Chaturthi rituals & procedures
- Navratri celebrations & traditions
- Satyanarayan Katha significance
- Griha Pravesh ceremony guide
- Muhurat timing guidance

</details>

---

## 📂 Project Structure

```
pooja-platform/
├── api-gateway/                 # Spring Cloud Gateway — routing, rate limiting     :8080
├── user-auth-service/           # JWT auth, RBAC, user profiles                     :8081
├── product-service/             # Product CRUD, search, Kafka events                :8082
├── pandit-service/              # Pandit profiles, content, verification             :8083
├── order-service/               # Cart, orders, bookings, Kafka events              :8084
├── rag-ai-service/              # AI chat — Spring AI + PGVector RAG                :8085
├── payment-service/             # Razorpay integration                              :8086
├── notification-service/        # Kafka consumer — email/SMS dispatch               :8087
│
├── frontend/                    # Next.js 14 web app                                :3000
│   ├── src/app/                 #   App Router pages
│   ├── src/components/          #   Shared UI components
│   └── src/lib/                 #   API client, stores, types
│
├── k8s/
│   ├── base/                    # Kubernetes manifests (namespace → infra → services → HPA → ingress)
│   └── overlays/local/          # Local overrides
│
├── scripts/
│   ├── deploy-k8s.sh            # Automated K8s deployment
│   └── prometheus.yml           # Prometheus scrape config
│
├── docker-compose.yml           # Full-stack orchestration (15 containers)
├── docker-compose.sonar.yml     # SonarQube for static analysis
├── build.gradle.kts             # Root Gradle build (Kotlin DSL)
├── settings.gradle.kts          # Multi-module project config
├── Makefile                     # Developer shortcuts
└── README.md
```

---

## ⚙️ Environment Variables

### Backend `.env` (project root)

```bash
cp .env.example .env
```

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `OPENAI_API_KEY` | For AI chat | `sk-placeholder` | [Get key →](https://platform.openai.com/api-keys) |
| `RAZORPAY_KEY_ID` | For payments | `rzp_test_placeholder` | [Get key →](https://dashboard.razorpay.com/app/keys) |
| `RAZORPAY_KEY_SECRET` | For payments | `placeholder_secret` | Paired with key ID |
| `DB_HOST` | No | `postgres` | PostgreSQL host |
| `DB_PORT` | No | `5432` | PostgreSQL port |
| `DB_NAME` | No | `pooja_db` | Database name |
| `DB_USER` | No | `pooja` | Database user |
| `DB_PASSWORD` | No | `pooja_secret` | Database password |
| `JWT_SECRET` | No | _(auto-set)_ | Min 256-bit secret for JWT signing |

> **Without API keys**, the platform still runs — AI chat shows a fallback message and payments are simulated.

### Frontend `.env.local` _(only for local dev outside Docker)_

```bash
cd frontend && cp .env.example .env.local
```

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

> When running via `docker-compose`, the frontend API URL is pre-configured automatically.

---

## 🐳 Running with Docker Compose

### Step-by-Step

```bash
# 1. Verify Docker is running
docker --version && docker compose version

# 2. Configure environment
cd pooja-platform
cp .env.example .env            # Edit .env to add API keys (optional)

# 3. Build & start (first run: ~5–10 min; subsequent: ~30s)
docker-compose up -d --build

# 4. Monitor startup
docker-compose ps               # Check container status
docker-compose logs -f           # Stream all logs (Ctrl+C to exit)
```

### Startup Order (automatic via health checks)

```
PostgreSQL ─→ Redis ─→ Kafka ─→ Backend Services (8) ─→ Frontend
```

### Quick Health Verification

```bash
# All containers healthy?
docker-compose ps

# API Gateway responding?
curl http://localhost:8080/actuator/health

# Test login
curl -s -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@pooja.com","password":"admin123"}' | python3 -m json.tool
```

---

## 🎨 Frontend Development

Run the Next.js frontend with **hot-reload** while the backend runs in Docker:

```bash
# Start backend infrastructure + services only
docker-compose up -d postgres redis zookeeper kafka \
  api-gateway user-auth-service product-service pandit-service \
  order-service rag-ai-service payment-service notification-service

# Run frontend locally
cd frontend
npm install
cp .env.example .env.local      # NEXT_PUBLIC_API_URL=http://localhost:8080
npm run dev                     # → http://localhost:3000
```

> **Offline mode:** The frontend includes built-in sample data, so you can explore the UI design without any backend running.

---

## ☸️ Kubernetes Deployment

<details>
<summary><b>Option A: Automated Script (recommended)</b></summary>

```bash
chmod +x scripts/deploy-k8s.sh
./scripts/deploy-k8s.sh
```

The script handles:
1. 🔨 Building all Docker images (backend + frontend)
2. 📦 Creating the `pooja-platform` namespace
3. 🏗️ Deploying infrastructure (Postgres, Redis, Kafka)
4. ⏳ Waiting for infrastructure readiness
5. 🚀 Deploying all 8 microservices + frontend
6. 📈 Applying Horizontal Pod Autoscalers
7. 📋 Printing status & port-forward instructions

</details>

<details>
<summary><b>Option B: Manual Step-by-Step</b></summary>

```bash
# ── Build images ──
for svc in api-gateway user-auth-service product-service pandit-service \
           order-service rag-ai-service payment-service notification-service; do
  docker build -t pooja-platform/$svc:latest -f $svc/Dockerfile .
done
docker build -t pooja-platform/frontend:latest \
  --build-arg NEXT_PUBLIC_API_URL=http://api-gateway:8080 \
  -f frontend/Dockerfile frontend/

# ── Deploy infrastructure ──
kubectl apply -f k8s/base/00-namespace.yaml
kubectl apply -f k8s/base/01-postgres.yaml
kubectl apply -f k8s/base/02-redis.yaml
kubectl apply -f k8s/base/03-kafka.yaml

# ── Wait for readiness ──
kubectl wait --for=condition=ready pod -l app=postgres -n pooja-platform --timeout=120s
kubectl wait --for=condition=ready pod -l app=redis -n pooja-platform --timeout=60s
sleep 15  # Kafka needs extra init time

# ── Deploy services ──
for i in 10 11 12 13 14 15 16 17 18; do
  kubectl apply -f k8s/base/$i-*.yaml
done
kubectl apply -f k8s/base/20-hpa.yaml

# ── Access ──
kubectl port-forward svc/frontend 3000:3000 -n pooja-platform &
kubectl port-forward svc/api-gateway 8080:8080 -n pooja-platform &
```

</details>

<details>
<summary><b>Updating K8s Secrets</b></summary>

Edit `k8s/base/00-namespace.yaml` with base64-encoded secrets:

```bash
echo -n "sk-your-openai-key" | base64
echo -n "rzp_test_your_key" | base64
```

Replace the values in the Secret section of the manifest.

</details>

---

## 📡 API Reference

All endpoints are accessed through the **API Gateway** at `http://localhost:8080`.

### 🔐 Authentication — `/api/v1/auth`

| Method | Endpoint | Auth | Description |
|:------:|----------|:----:|-------------|
| `POST` | `/register` | ❌ | Register a new user |
| `POST` | `/login` | ❌ | Login → returns JWT access + refresh tokens |
| `POST` | `/refresh` | ❌ | Refresh an expired access token |
| `GET` | `/profile` | ✅ | Get current user's profile |
| `PUT` | `/profile` | ✅ | Update profile |

### 📦 Products — `/api/v1/products`

| Method | Endpoint | Auth | Description |
|:------:|----------|:----:|-------------|
| `GET` | `/public` | ❌ | List all approved products |
| `GET` | `/public/{id}` | ❌ | Get product by ID |
| `GET` | `/public/featured` | ❌ | Get featured products |
| `POST` | `/search` | ❌ | Search products (filters + pagination) |
| `POST` | `/` | 🏪 Seller | Create a new product |
| `PUT` | `/{id}` | 🏪 Seller | Update own product |
| `POST` | `/{id}/approve` | 👑 Admin | Approve a product listing |

### 🙏 Pandits — `/api/v1/pandits`

| Method | Endpoint | Auth | Description |
|:------:|----------|:----:|-------------|
| `GET` | `/public` | ❌ | List all verified pandits |
| `GET` | `/public/{id}` | ❌ | Get pandit profile |
| `POST` | `/search` | ❌ | Search pandits |
| `POST` | `/profile` | 🙏 Pandit | Create / update pandit profile |
| `POST` | `/content` | 🙏 Pandit | Add blog post or video |
| `POST` | `/{id}/verify` | 👑 Admin | Verify a pandit |

### 🛒 Orders — `/api/v1/orders`

| Method | Endpoint | Auth | Description |
|:------:|----------|:----:|-------------|
| `GET` | `/cart` | ✅ | View cart |
| `POST` | `/cart` | ✅ | Add item to cart |
| `DELETE` | `/cart/{id}` | ✅ | Remove item from cart |
| `POST` | `/` | ✅ | Place an order |
| `GET` | `/` | ✅ | List user's orders |
| `POST` | `/bookings` | ✅ | Book a pandit |
| `GET` | `/bookings` | ✅ | List bookings |

### 🤖 AI Assistant — `/api/v1/ai`

| Method | Endpoint | Auth | Description |
|:------:|----------|:----:|-------------|
| `POST` | `/chat` | ❌ | Chat with AI spiritual guide (RAG-powered) |
| `POST` | `/search` | ❌ | Semantic search over knowledge base |
| `POST` | `/ingest` | 👑 Admin | Ingest new knowledge documents |

### 💳 Payments — `/api/v1/payments`

| Method | Endpoint | Auth | Description |
|:------:|----------|:----:|-------------|
| `POST` | `/create-order` | ✅ | Create a Razorpay payment order |
| `POST` | `/verify` | ✅ | Verify payment signature |

---

## 🌐 Services & Ports

| Service | Port | Container | Stack |
|---------|:----:|-----------|-------|
| 🌐 Frontend | `3000` | `pooja-frontend` | Next.js 14, React 18 |
| ⚡ API Gateway | `8080` | `pooja-gateway` | Spring Cloud Gateway, Redis |
| 🔐 Auth Service | `8081` | `pooja-auth` | Spring Boot, JWT, BCrypt |
| 📦 Product Service | `8082` | `pooja-product` | Spring Boot, Kafka |
| 🙏 Pandit Service | `8083` | `pooja-pandit` | Spring Boot, PostgreSQL |
| 🛒 Order Service | `8084` | `pooja-order` | Spring Boot, Kafka, Redis |
| 🤖 RAG AI Service | `8085` | `pooja-rag` | Spring AI, PGVector, OpenAI |
| 💳 Payment Service | `8086` | `pooja-payment` | Spring Boot, Razorpay |
| 📢 Notification Service | `8087` | `pooja-notification` | Spring Boot, Kafka |
| 🐘 PostgreSQL | `5432` | `pooja-postgres` | pgvector/pgvector:pg16 |
| 🔴 Redis | `6379` | `pooja-redis` | Redis 7 Alpine |
| 📨 Kafka | `9092` | `pooja-kafka` | Confluent 7.6.0 |
| 🦁 Zookeeper | `2181` | `pooja-zookeeper` | Confluent 7.6.0 |
| 📈 Prometheus | `9090` | `pooja-prometheus` | Prom v2.51.0 |
| 📊 Grafana | `3001` | `pooja-grafana` | Grafana 10.4.0 |

---

## 🧪 Testing & Code Quality

### Running Tests

```bash
make test                       # Run all tests (unit + integration)
make test-unit                  # Unit tests only
make test-integration           # Integration tests (requires Docker for Testcontainers)

# Or use Gradle directly
./gradlew :user-auth-service:test
./gradlew :product-service:test
```

### Test Coverage

```bash
make coverage                   # Per-service JaCoCo reports
make coverage-merged            # Merged report across all services
```

Reports are generated at:
- **Per-service:** `<service>/build/reports/jacoco/test/html/index.html`
- **Merged:** `build/reports/jacoco/jacocoMergedReport/html/index.html`

### Test Matrix

| Service | Unit Tests | Integration Tests | Coverage Areas |
|---------|:----------:|:-----------------:|----------------|
| user-auth-service | ✅ `AuthServiceTest`, `JwtServiceTest`, `AuthControllerTest` | ✅ `AuthIntegrationTest` | Registration, login, JWT, profiles, validation |
| product-service | ✅ `ProductServiceTest` | — | CRUD, stock, approval, authorization |
| order-service | ✅ `OrderServiceTest` | — | Cart, orders, shipping, auth checks |
| pandit-service | ✅ `PanditServiceTest` | — | Profile CRUD, verification |

### Testing Stack

| Tool | Purpose |
|------|---------|
| **MockK** | Kotlin-first mocking (replaces Mockito) |
| **SpringMockK** | MockK ↔ Spring Boot integration |
| **Testcontainers** | Real PostgreSQL, Redis, Kafka in integration tests |
| **JaCoCo** | Code coverage reporting (XML + HTML) |
| **SonarQube** | Static analysis, code smells, security hotspots |

### SonarQube Analysis

```bash
make sonar-up                   # Start SonarQube → http://localhost:9000 (admin/admin)

# After SonarQube is ready:
export SONAR_TOKEN=squ_your_token_here
make sonar                      # Run analysis
```

---

## 📊 Observability

The platform ships with a full observability stack:

| Component | URL | Purpose |
|-----------|-----|---------|
| **Prometheus** | [localhost:9090](http://localhost:9090) | Metrics collection & queries |
| **Grafana** | [localhost:3001](http://localhost:3001) | Dashboards & visualization |
| **Spring Actuator** | `/actuator/health`, `/actuator/metrics` | Per-service health & metrics |

Every backend service exposes **Micrometer + Prometheus** metrics automatically. Prometheus scrapes them via the config in `scripts/prometheus.yml`.

---

## 🧹 Stopping & Cleanup

```bash
# Stop containers (preserves data)
docker-compose stop

# Stop & remove containers (preserves volumes)
docker-compose down

# Full nuclear cleanup (removes containers, volumes, and images)
docker-compose down -v --rmi all

# Kubernetes cleanup
kubectl delete namespace pooja-platform
```

---

## 🔧 Troubleshooting

<details>
<summary><b>🚫 Port already in use</b></summary>

```bash
lsof -i :3000    # Find what's using the port
kill -9 <PID>    # Kill it, or change ports in docker-compose.yml
```

</details>

<details>
<summary><b>🔄 Container keeps restarting</b></summary>

```bash
docker-compose logs <service-name>    # Check logs for errors

# Most common cause: Postgres or Kafka not ready yet.
# Solution: Wait 30 more seconds, then:
docker-compose restart <service-name>
```

</details>

<details>
<summary><b>🌐 Frontend can't reach backend</b></summary>

- **Docker mode:** API URL is auto-configured to `http://localhost:8080`
- **Local dev mode:** Ensure `.env.local` contains `NEXT_PUBLIC_API_URL=http://localhost:8080`
- **Verify gateway:** `curl http://localhost:8080/actuator/health`

</details>

<details>
<summary><b>🤖 AI Chat not working</b></summary>

- Requires a valid `OPENAI_API_KEY` in `.env`
- Without it, the service starts but chat returns a fallback message
- The frontend gracefully handles this with a friendly UI message

</details>

<details>
<summary><b>💥 Build fails — out of memory</b></summary>

Docker Desktop → **Settings** → **Resources** → increase memory to **8+ GB** and CPU to **4+ cores**.

</details>

<details>
<summary><b>🔨 Gradle build fails</b></summary>

The backend uses **JDK 21** in Docker. Ensure the build image is available:

```bash
docker pull eclipse-temurin:21-jdk-alpine
```

For local development, JDK 17+ is sufficient (configured via `sourceCompatibility`).

</details>

<details>
<summary><b>🐢 Docker slow on macOS</b></summary>

- Docker Desktop → Settings → Resources → increase CPU to 4+ cores
- Enable **"Use Virtualization Framework"** in Docker settings
- Consider using [OrbStack](https://orbstack.dev/) as a faster Docker Desktop alternative

</details>

---

## 🛠️ Makefile Reference

```
make help              Show all available commands
make init              First-time setup (Gradle wrapper + .env)
make build             Build all services (skip tests)
make test              Run all tests
make test-unit         Run unit tests only
make test-integration  Run integration tests
make coverage          Run tests + generate JaCoCo reports
make coverage-merged   Merged coverage report
make sonar-up          Start SonarQube server
make sonar             Run SonarQube analysis
make docker-up         Build & start full stack
make docker-down       Stop all containers
make docker-logs       Tail all container logs
make docker-ps         Show container status
make frontend-dev      Run frontend in dev mode
make frontend-build    Build frontend for production
make clean             Clean build artifacts
```

---

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Development Guidelines

- Follow **Kotlin coding conventions** for backend services
- Write **unit tests** for new service logic (aim for >80% coverage)
- Use **MockK** for mocking, not Mockito
- Run `make test` and `make coverage` before submitting PRs
- Keep services **loosely coupled** — communicate via Kafka events where possible

---

## 📄 License

This project is for **educational and demonstration purposes**. Replace all placeholder API keys and secrets before any production deployment.

---

<p align="center">
  Built with 🙏 by the Pooja Platform team
  <br/>
  <sub>Spring Boot 3.4 · Kotlin 2.1 · Next.js 14 · PostgreSQL 16 · Redis 7 · Kafka · Spring AI · Docker · Kubernetes</sub>
</p>
