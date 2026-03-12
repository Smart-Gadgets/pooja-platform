# 🪔 Pooja Platform — Your Sacred Marketplace

A production-grade full-stack microservices platform for spiritual commerce. Features **4 completely separate web applications** — like Amazon (storefront) vs Amazon Seller Central vs AWS Console.

---

## 🏗️ Architecture

### 4 Independent Portals (Different Websites)

| Portal | URL | Login URL | Design Language | Purpose |
|--------|-----|-----------|----------------|---------|
| **🛍️ Customer Store** | `/` | `/auth/login` | Warm saffron, spiritual | Shopping, AI guide |
| **👑 Admin Console** | `/admin` | `/admin/login` | Dark slate, corporate (Stripe-like) | Full platform control |
| **🏪 Seller Central** | `/seller` | `/seller/login` | White+green, commerce (Shopify-like) | Products & sales |
| **🙏 Pandit Portal** | `/pandit` | `/pandit/login` | Amber gradient, traditional | Bookings & services |

Each portal has its own layout, sidebar, color scheme, authentication flow, and navigation. They share API client code but render completely different user experiences.

### Backend: 8 Microservices

| Service | Port | Stack | Purpose |
|---------|------|-------|---------|
| API Gateway | 8080 | Spring Cloud Gateway | Routing, JWT validation, rate limiting, circuit breakers |
| User Auth | 8081 | Spring Boot + JPA | Registration, login, JWT, RBAC, user management |
| Product | 8082 | Spring Boot + JPA | Product CRUD, search, approval workflow |
| Pandit | 8083 | Spring Boot + JPA | Pandit profiles, verification, content |
| Order | 8084 | Spring Boot + JPA | Cart, orders, bookings |
| RAG AI | 8085 | Spring AI + PGVector | AI spiritual chat, ritual knowledge base |
| Payment | 8086 | Spring Boot + Razorpay | Payment processing |
| Notification | 8087 | Spring Boot + Kafka | Event-driven notifications |

### Infrastructure

| Component | Port | Purpose |
|-----------|------|---------|
| PostgreSQL (pgvector) | 5432 | Database (schemas: auth, product, pandit, orders, rag) |
| Redis | 6379 | JWT tokens, rate limiting, caching |
| Kafka | 9092 | Event-driven messaging |
| Prometheus | 9090 | Metrics collection |
| Grafana | 3001 | Monitoring dashboards |

---

## 🚀 Quick Start

### Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| Docker Desktop | 4.x+ | Container runtime |
| JDK | 17+ | Backend build |
| Gradle | 8.12+ | Build system |
| Node.js | 20+ | Frontend dev (optional) |

### First-Time Setup

```bash
cd pooja-platform
gradle wrapper --gradle-version 8.12    # Generate Gradle wrapper
cp .env.example .env                     # Copy environment config
```

### Start Everything

```bash
docker-compose up -d --build

# Wait 60-90 seconds, then access:
# Customer Store:   http://localhost:3000
# Admin Console:    http://localhost:3000/admin/login
# Seller Central:   http://localhost:3000/seller/login
# Pandit Portal:    http://localhost:3000/pandit/login
# API Gateway:      http://localhost:8080
# Grafana:          http://localhost:3001 (admin/admin)
```

### Demo Accounts (auto-seeded on startup)

| Role | Email | Password | Login URL |
|------|-------|----------|-----------|
| 👑 Admin | `admin@pooja.com` | `admin123` | `/admin/login` |
| 🏪 Seller | `seller@pooja.com` | `seller123` | `/seller/login` |
| 🙏 Pandit | `pandit@pooja.com` | `pandit123` | `/pandit/login` |
| 🛍️ Customer | `customer@pooja.com` | `customer123` | `/auth/login` |

---

## 🤖 AI Features

### 1. AI Spiritual Guide (RAG) — All Users
- Multi-language chat (English, Hindi, Tamil)
- Retrieval-Augmented Generation using PGVector + OpenAI
- Curated knowledge base of Hindu rituals and ceremonies
- Product and pandit recommendations

### 2. AI Image Generation — Sellers
- **Pollinations.ai** — 100% free, no API key required
- Generates 4 product photo variations per product:
  - Front view (clean studio shot)
  - Lifestyle shot (product in context)
  - Detail macro (close-up of craftsmanship)
  - Packaging mockup (branded presentation)
- URL format: `https://image.pollinations.ai/prompt/{description}`

### 3. AI Description Generator — Sellers
- Auto-generates compelling product descriptions
- Considers product name, category, spiritual significance
- One-click generation in the Add Product form

### 4. AI Price Suggestion — Sellers
- Market-aware pricing recommendations in INR
- Based on product category and Indian market data

### Free AI Image Services (Alternatives)
| Service | API Key | Quality | URL |
|---------|---------|---------|-----|
| **Pollinations.ai** (used) | None needed | Good | `image.pollinations.ai` |
| Craiyon | None needed | Basic | `craiyon.com` |
| Stable Diffusion XL (Hugging Face) | Free tier | Excellent | `api-inference.huggingface.co` |
| DALL-E 3 (OpenAI) | Paid | Best | `api.openai.com` |

---

## 👑 Admin Console Features

| Feature | Endpoint | Description |
|---------|----------|-------------|
| User Management | `/admin/users` | Search, filter, approve, suspend, activate, delete, change roles |
| Product Approval | `/admin/products` | Review seller submissions, approve/reject |
| Pandit Verification | `/admin/pandits` | Verify pandit profiles before they go live |
| Order Management | `/admin/orders` | Full lifecycle: Pending → Confirmed → Shipped → Delivered |
| Settings | `/admin/settings` | Platform configuration |

### Admin Actions

| Action | What It Does | Restrictions |
|--------|-------------|--------------|
| **Approve** | Activate pending accounts | PENDING_APPROVAL status only |
| **Suspend** | Temporarily disable account | Cannot suspend other admins |
| **Activate** | Re-enable suspended account | SUSPENDED status only |
| **Delete** | Permanently remove user | Cannot delete admin accounts |
| **Change Role** | Switch between CUSTOMER/SELLER/PANDIT | Cannot change admin role |

---

## 🏪 Seller Central Features

| Feature | Path | Description |
|---------|------|-------------|
| Dashboard | `/seller` | Revenue, product stats, recent activity |
| Products | `/seller/products` | All products with status badges |
| Add Product | `/seller/products/new` | AI-powered form with image gen, description gen, price suggest |
| Orders | `/seller/orders` | Orders received from customers |
| Analytics | `/seller/analytics` | Sales insights and trends |

---

## 🙏 Pandit Portal Features

| Feature | Path | Description |
|---------|------|-------------|
| Dashboard | `/pandit` | Upcoming bookings, earnings, rating |
| Bookings | `/pandit/bookings` | Accept/decline/complete bookings |
| Profile | `/pandit/profile` | Create/edit profile, specializations, availability |
| Content | `/pandit/content` | Blog and video content management |
| Schedule | `/pandit/schedule` | Availability calendar |

---

## 📚 Documentation

PDF documentation is available for each role:

| Document | Download | Content |
|----------|----------|---------|
| Platform Documentation | `/docs/Pooja_Platform_Documentation.pdf` | Architecture, API, deployment |
| Admin Guide | `/docs/Admin_Guide.pdf` | User/product/pandit/order management |
| Seller Guide | `/docs/Seller_Guide.pdf` | Products, AI features, orders |
| Pandit Guide | `/docs/Pandit_Guide.pdf` | Profile, bookings, content |
| Customer Guide | `/docs/Customer_Guide.pdf` | Shopping, AI guide, bookings |

Access the documentation page at `http://localhost:3000/docs`.

---

## 🧪 Testing & Code Quality

```bash
./gradlew test                           # All tests (unit + integration)
./gradlew :user-auth-service:test        # Single service
./gradlew test jacocoTestReport          # Tests + JaCoCo coverage
```

### SonarQube

```bash
docker-compose -f docker-compose.sonar.yml up -d
# http://localhost:9000 → admin/admin → generate token
export SONAR_TOKEN=squ_your_token
./gradlew test jacocoTestReport sonar
```

### Test Coverage

| Service | Test Files | What's Covered |
|---------|-----------|----------------|
| user-auth | AuthServiceTest, JwtServiceTest, AuthControllerTest, AuthIntegrationTest | Registration, login, JWT, profiles, admin actions |
| product | ProductServiceTest | CRUD, stock, approval, authorization |
| order | OrderServiceTest | Cart, orders, shipping calculation |
| pandit | PanditServiceTest | Profile CRUD, verification |

---

## 🔌 API Reference

### Auth (`/api/v1/auth/`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/register` | No | Register new user |
| POST | `/login` | No | Login → JWT tokens |
| POST | `/refresh` | Yes | Refresh access token |
| GET | `/profile` | Yes | Get user profile |
| PUT | `/profile` | Yes | Update profile |
| GET | `/users` | Admin | List all users (paginated) |
| POST | `/users/{id}/approve` | Admin | Approve pending user |
| POST | `/users/{id}/suspend` | Admin | Suspend user |
| POST | `/users/{id}/activate` | Admin | Reactivate user |
| DELETE | `/users/{id}` | Admin | Delete user (not admins) |
| PUT | `/users/{id}/role?role=X` | Admin | Change user role |

### Products (`/api/v1/products/`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/public` | No | List active products |
| GET | `/public/{id}` | No | Get product detail |
| POST | `/public/search` | No | Search with filters |
| GET | `/public/featured` | No | Featured products |
| POST | `/` | Seller | Create product (pending approval) |
| PUT | `/{id}` | Seller | Update own product |
| GET | `/seller/my-products` | Seller | List seller's products |
| POST | `/{id}/approve` | Admin | Approve product |
| POST | `/{id}/reject` | Admin | Reject product |

---

## 🔧 Environment Variables

| Variable | Default | Required |
|----------|---------|----------|
| `OPENAI_API_KEY` | placeholder | For AI chat (get at platform.openai.com) |
| `RAZORPAY_KEY_ID` | placeholder | For payments (get at dashboard.razorpay.com) |
| `DB_NAME` | `pooja_db` | PostgreSQL database name (double 'o'!) |
| `DB_USER` | `pooja` | Database user |
| `DB_PASSWORD` | `pooja_secret` | Database password |
| `JWT_SECRET` | auto-generated | JWT signing key (change in production) |

---

## 🔒 Security

- **JWT Authentication** with access/refresh token pattern
- **Role-Based Access Control** — 5 roles: CUSTOMER, SELLER, PANDIT, ADMIN, MANAGER
- **Portal isolation** — each portal validates role server-side, redirects on mismatch
- **BCrypt** password hashing (10 rounds)
- **Rate limiting** via Redis at API Gateway
- **Circuit breakers** via Resilience4j
- **CORS** configured for development
- **Non-root Docker containers** with health checks

---

## 🛑 Stopping & Cleanup

```bash
docker-compose down          # Stop (keep data)
docker-compose down -v       # Stop + delete all data
docker system prune -f       # Clean unused resources
```

---

## ❓ Troubleshooting

| Problem | Solution |
|---------|----------|
| **Docker build OOM** | `make docker-build-low-memory` or increase Docker memory to 6GB+ |
| **Gradle daemon crashed** | Already fixed — Dockerfiles now use `--no-daemon` with 512MB limit |
| Containers restarting | Wait 90 seconds — services depend on Kafka/Postgres |
| Demo accounts don't work | `docker-compose down -v && docker-compose up -d --build` |
| `useSearchParams` error | Already fixed — use latest `products/page.tsx` |
| `location is not defined` | Already fixed — checkout uses `useEffect` for redirects |
| Port 5432 in use | `lsof -i :5432` → kill process or change port in docker-compose |
| AI images not loading | Pollinations.ai may be slow — images generate on-demand |

### Memory-Constrained Systems (< 8GB RAM)

If `docker-compose up --build` fails with "cannot allocate memory":

```bash
# Option 1: Build services one-by-one (recommended)
make docker-build-low-memory
docker-compose up -d

# Option 2: Increase Docker Desktop memory limit
# Docker Desktop → Settings → Resources → Memory: 6GB+

# Option 3: Build specific services only
docker-compose up -d postgres redis kafka  # Infrastructure first
docker-compose up -d --build api-gateway user-auth-service product-service
```

