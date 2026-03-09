# 🪔 Pooja Platform — Your Sacred Marketplace

A full-stack microservices platform for pooja/spiritual commerce, built with Kotlin/Spring Boot backend and Next.js frontend. Features **4 separate portal experiences** — like Amazon (customer) vs Amazon Seller Central vs Admin Console.

---

## Architecture Overview

### 4 Separate Web Applications (Same Domain, Different Experiences)

| Portal | URL | Layout | Purpose | Design |
|--------|-----|--------|---------|--------|
| **🛍️ Customer Storefront** | `/` | Navbar + Footer | Shopping, browsing, AI guide | Warm saffron/spiritual theme |
| **👑 Admin Console** | `/admin` | Dark slate sidebar | Platform management | Corporate dark sidebar (Stripe-style) |
| **🏪 Seller Central** | `/seller` | White sidebar, green accent | Product & order management | Commerce dashboard (Shopify-style) |
| **🙏 Pandit Portal** | `/pandit` | Amber gradient sidebar | Bookings, profile, content | Traditional warm theme |

Each portal has its own **layout, sidebar, navigation, color scheme, and pages** — they look and feel like completely different websites.

### How It Works (Next.js Route Groups)

```
src/app/
├── layout.tsx                    # Root: just <html> + <body>
├── dashboard/page.tsx            # Smart redirect → role-specific portal
├── (storefront)/                 # GROUP: Customer-facing pages
│   ├── layout.tsx                # Navbar + Footer layout
│   ├── page.tsx                  # Home page
│   ├── products/                 # Product catalog
│   ├── pandits/                  # Pandit directory
│   ├── ai-assistant/             # AI spiritual guide
│   ├── cart/                     # Shopping cart
│   ├── checkout/                 # Checkout flow
│   ├── orders/                   # Customer order history
│   ├── about/                    # About page
│   └── auth/login|register/      # Authentication
├── (admin)/                      # GROUP: Admin Console
│   ├── layout.tsx                # Dark sidebar + header layout
│   └── admin/
│       ├── page.tsx              # Admin dashboard
│       ├── users/                # User management (approve/reject)
│       ├── products/             # Product approval (approve/reject)
│       ├── pandits/              # Pandit verification
│       ├── orders/               # Order lifecycle management
│       └── settings/             # Platform settings
├── (seller)/                     # GROUP: Seller Central
│   ├── layout.tsx                # White sidebar + green accent layout
│   └── seller/
│       ├── page.tsx              # Seller dashboard
│       ├── products/             # Product list + management
│       ├── products/new/         # Add new product form
│       ├── orders/               # Orders received
│       └── analytics/            # Sales analytics
└── (pandit)/                     # GROUP: Pandit Portal
    ├── layout.tsx                # Amber gradient sidebar layout
    └── pandit/
        ├── page.tsx              # Pandit dashboard
        ├── bookings/             # Booking management
        ├── profile/              # Profile create/edit
        ├── content/              # Blog/video content
        └── schedule/             # Availability management
```

---

## Demo Accounts

| Role | Email | Password | What You'll See |
|------|-------|----------|-----------------|
| **👑 Admin** | `admin@pooja.com` | `admin123` | Dark sidebar → Users, Products, Pandits, Orders management |
| **🏪 Seller** | `seller@pooja.com` | `seller123` | Green sidebar → Products, Orders, Analytics |
| **🙏 Pandit** | `pandit@pooja.com` | `pandit123` | Amber sidebar → Bookings, Profile, Content, Schedule |
| **🛍️ Customer** | `customer@pooja.com` | `customer123` | Public storefront → Shop, Cart, Orders |

> **Login flow:** `/auth/login` → enter credentials → auto-redirected to role-specific portal
> **Portal protection:** Each portal checks your role. Wrong role → redirected to correct portal.

---

## Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| **Docker Desktop** | 4.x+ | Container runtime |
| **JDK** | 17+ | Backend build |
| **Gradle** | 8.12+ | Build system |
| **Node.js** | 20+ | Frontend (for local dev only) |

### First-Time Setup

```bash
cd pooja-platform

# Generate Gradle wrapper (one-time)
gradle wrapper --gradle-version 8.12

# Copy environment file
cp .env.example .env
```

---

## Quick Start

### Option 1: Full Stack with Docker Compose

```bash
docker-compose up -d --build

# Wait 60-90 seconds for all services to start
# Customer Storefront: http://localhost:3000
# Admin Console:       http://localhost:3000/admin
# Seller Central:      http://localhost:3000/seller
# Pandit Portal:       http://localhost:3000/pandit
# API Gateway:         http://localhost:8080
# Grafana:             http://localhost:3001 (admin/admin)
```

### Option 2: Frontend Development (Hot Reload)

```bash
# Start backend services
docker-compose up -d postgres redis kafka api-gateway user-auth-service product-service pandit-service order-service rag-ai-service payment-service notification-service

# Run frontend separately
cd frontend
npm install
npm run dev
# → http://localhost:3000
```

### Nuclear Reset (Clean Start)

```bash
docker-compose down -v       # Stop + delete all data
docker-compose up -d --build # Rebuild from scratch
```

---

## Backend: 8 Microservices

| Service | Port | Technology | Purpose |
|---------|------|-----------|---------|
| **API Gateway** | 8080 | Spring Cloud Gateway | Routing, JWT validation, rate limiting |
| **User Auth** | 8081 | Spring Boot + JPA | Registration, login, JWT, RBAC |
| **Product** | 8082 | Spring Boot + JPA | Product CRUD, search, approval |
| **Pandit** | 8083 | Spring Boot + JPA | Pandit profiles, verification, content |
| **Order** | 8084 | Spring Boot + JPA | Cart, orders, bookings |
| **RAG AI** | 8085 | Spring AI + PGVector | AI chat, ritual knowledge base |
| **Payment** | 8086 | Spring Boot + Razorpay | Payment processing |
| **Notification** | 8087 | Spring Boot + Kafka | Email/push notifications |

### Infrastructure

| Component | Port | Purpose |
|-----------|------|---------|
| PostgreSQL (pgvector) | 5432 | Database (schemas: auth, product, pandit, orders, rag) |
| Redis | 6379 | JWT refresh tokens, rate limiting, caching |
| Kafka | 9092 | Event-driven messaging (10+ topics) |
| Prometheus | 9090 | Metrics collection |
| Grafana | 3001 | Monitoring dashboards |

---

## Frontend Pages by Portal

### 🛍️ Customer Storefront

| Page | Path | Description |
|------|------|-------------|
| Home | `/` | Hero, categories, featured products, CTA |
| Products | `/products` | Catalog with filters, search, sort |
| Product Detail | `/products/[id]` | Full product page |
| Pandits | `/pandits` | Pandit directory |
| Pandit Detail | `/pandits/[id]` | Profile, specializations, booking |
| AI Guide | `/ai-assistant` | Multi-language spiritual AI chat |
| Cart | `/cart` | Shopping cart |
| Checkout | `/checkout` | Address + payment |
| Orders | `/orders` | Order & booking history |
| About | `/about` | Platform info |

### 👑 Admin Console (`/admin`)

| Page | Path | Features |
|------|------|----------|
| Dashboard | `/admin` | Stats, alerts for pending actions, recent orders |
| Users | `/admin/users` | Search, filter by role/status, approve pending users |
| Products | `/admin/products` | Filter by status, approve/reject seller products |
| Pandits | `/admin/pandits` | View profiles, verify pandits |
| Orders | `/admin/orders` | Full order lifecycle: Pending → Confirm → Ship → Deliver |
| Settings | `/admin/settings` | Platform configuration |

### 🏪 Seller Central (`/seller`)

| Page | Path | Features |
|------|------|----------|
| Dashboard | `/seller` | Revenue, product stats, recent products/orders |
| Products | `/seller/products` | Product cards with status badges |
| Add Product | `/seller/products/new` | Full form → submitted for admin approval |
| Orders | `/seller/orders` | Orders received from customers |
| Analytics | `/seller/analytics` | Sales and performance data |

### 🙏 Pandit Portal (`/pandit`)

| Page | Path | Features |
|------|------|----------|
| Dashboard | `/pandit` | Upcoming bookings, earnings, rating, profile status |
| Bookings | `/pandit/bookings` | Filter, accept/decline/complete bookings |
| Profile | `/pandit/profile` | Create/edit profile, specializations, availability |
| Content | `/pandit/content` | Blog, video content management |
| Schedule | `/pandit/schedule` | Availability management |

---

## Testing & Code Quality

### Running Tests

```bash
./gradlew test                           # All tests
./gradlew :user-auth-service:test        # Single service
./gradlew test jacocoTestReport          # Tests + coverage
./gradlew test jacocoTestReport sonar    # + SonarQube analysis
```

### SonarQube

```bash
docker-compose -f docker-compose.sonar.yml up -d   # Start SonarQube
# http://localhost:9000 → login admin/admin → generate token
export SONAR_TOKEN=squ_your_token
./gradlew test jacocoTestReport sonar
```

### Test Coverage

| Service | Tests | What's Covered |
|---------|-------|----------------|
| user-auth | AuthServiceTest, JwtServiceTest, AuthControllerTest, AuthIntegrationTest | Register, login, JWT, profiles |
| product | ProductServiceTest | CRUD, stock, approval, authorization |
| order | OrderServiceTest | Cart, orders, shipping |
| pandit | PanditServiceTest | Profile CRUD, verification |

---

## API Endpoints Reference

### Auth (`/api/v1/auth/`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/register` | No | Register user |
| POST | `/login` | No | Login, returns JWT |
| POST | `/refresh` | Yes | Refresh access token |
| GET | `/profile` | Yes | Get user profile |
| PUT | `/profile` | Yes | Update profile |
| GET | `/users` | Admin | List all users |
| POST | `/users/{id}/approve` | Admin | Approve pending user |

### Products (`/api/v1/products/`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/public` | No | List active products |
| GET | `/public/{id}` | No | Get product detail |
| POST | `/public/search` | No | Search products |
| POST | `/` | Seller | Create product |
| PUT | `/{id}` | Seller | Update product |
| GET | `/seller/my-products` | Seller | List seller's products |
| POST | `/{id}/approve` | Admin | Approve product |
| POST | `/{id}/reject` | Admin | Reject product |

### Orders (`/api/v1/`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/cart` | Yes | Add to cart |
| GET | `/cart` | Yes | Get cart |
| POST | `/orders` | Yes | Create order |
| GET | `/orders` | Yes | List orders |
| PATCH | `/orders/{id}/status` | Admin | Update order status |
| POST | `/bookings` | Yes | Create booking |
| GET | `/bookings` | Yes | List bookings |

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `OPENAI_API_KEY` | `sk-placeholder` | OpenAI API key (for AI chat) |
| `RAZORPAY_KEY_ID` | `rzp_test_placeholder` | Razorpay key (for payments) |
| `DB_HOST` | `postgres` | PostgreSQL host |
| `DB_NAME` | `pooja_db` | Database name |
| `DB_USER` | `pooja` | Database user |
| `DB_PASSWORD` | `pooja_secret` | Database password |
| `JWT_SECRET` | auto-generated | JWT signing key |

---

## Stopping & Cleanup

```bash
docker-compose down          # Stop containers (keep data)
docker-compose down -v       # Stop + delete all data volumes
docker system prune -f       # Clean unused Docker resources
```

---

## Kubernetes Deployment

```bash
./scripts/deploy-k8s.sh

# Port forward
kubectl port-forward svc/frontend 3000:3000 -n pooja-platform
kubectl port-forward svc/api-gateway 8080:8080 -n pooja-platform
```

---

## Troubleshooting

### "database poja_db does not exist"
The database name is `pooja_db` (double 'o'), not `poja_db`.

### Containers keep restarting
Wait 90 seconds. Services depend on Kafka/Postgres/Redis — they auto-retry via `restart: on-failure`.

### Can't login / demo accounts don't work
```bash
docker-compose down -v && docker-compose up -d --build
# DataInitializer.kt seeds demo users on first startup with proper BCrypt hashing
```

### Frontend build error: "useSearchParams should be wrapped in Suspense"
This is already fixed in the codebase. If you see it, ensure you have the latest `products/page.tsx`.

### Frontend build error: "location is not defined"
This is already fixed. The checkout page uses `useEffect` for redirects instead of render-time calls.

### Port conflicts
Check what's using the port: `lsof -i :5432` and stop the conflicting process, or change the port mapping in `docker-compose.yml`.
