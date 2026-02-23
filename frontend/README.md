# Pooja Platform — Frontend

A **Next.js 14** web application with PWA support for the Pooja Platform spiritual marketplace.

## Tech Stack

- **Framework:** Next.js 14 (App Router, TypeScript)
- **Styling:** Tailwind CSS with custom saffron/gold/vermillion theme
- **State:** Zustand (auth + cart stores)
- **Animations:** Framer Motion-ready, CSS keyframes
- **Notifications:** react-hot-toast
- **PWA:** Installable via `manifest.json`

## Pages

| Route | Description |
|---|---|
| `/` | Landing page — hero, categories, featured products, pandits, AI, testimonials |
| `/products` | Product catalog with search, category filter, sort |
| `/products/[id]` | Product detail — images, pricing, add to cart |
| `/pandits` | Pandit listing with specialization filters |
| `/pandits/[id]` | Pandit profile — bio, booking form |
| `/ai-assistant` | AI chat interface — multi-language spiritual guidance |
| `/cart` | Shopping cart |
| `/checkout` | Address form + order summary + payment |
| `/orders` | Order & booking history |
| `/dashboard` | User dashboard (role-based: Customer/Seller/Pandit/Admin) |
| `/auth/login` | Login (demo: `admin@pooja.com` / `admin123`) |
| `/auth/register` | Registration with role selection |
| `/about` | About page, mission, features, contact |

## Getting Started

### Local Development

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

| Variable | Default | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8080` | Backend API Gateway URL |

### With Docker Compose (full stack)

From the project root:

```bash
docker-compose up -d
```

- Frontend: http://localhost:3000
- API Gateway: http://localhost:8080
- Grafana: http://localhost:3001

### Kubernetes

```bash
chmod +x scripts/deploy-k8s.sh
./scripts/deploy-k8s.sh

# Port forward
kubectl port-forward svc/frontend 3000:3000 -n pooja-platform
kubectl port-forward svc/api-gateway 8080:8080 -n pooja-platform
```

## Design System

The frontend uses a warm, spiritual Indian aesthetic:

- **Font Display:** Cormorant Garamond (serif) — headings
- **Font Body:** DM Sans — text
- **Colors:** Saffron (#FF6B00), Temple Gold (#D4A012), Vermillion (#E23D28), Burgundy (#5C1A1A), Cream (#FFF8F0)
- **Components:** `.btn-primary`, `.btn-secondary`, `.card`, `.input-field`, `.badge-saffron`, etc.

## Offline / Demo Mode

The frontend includes **sample data** (`src/lib/sampleData.ts`) that renders when the backend is unavailable. This means you can explore the UI without running any backend services.

## Project Structure

```
frontend/
├── public/              # Static assets, PWA manifest
├── src/
│   ├── app/             # Next.js App Router pages
│   ├── components/
│   │   └── layout/      # Navbar, Footer
│   ├── lib/
│   │   ├── api.ts       # Backend API client
│   │   ├── types.ts     # TypeScript interfaces
│   │   ├── sampleData.ts# Demo/fallback data
│   │   └── store/       # Zustand stores (auth, cart)
│   └── styles/
│       └── globals.css  # Tailwind + custom styles
├── Dockerfile           # Multi-stage production build
├── next.config.js
├── tailwind.config.js
└── package.json
```
