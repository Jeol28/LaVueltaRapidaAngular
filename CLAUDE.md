# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**La Vuelta Rápida** is an Angular 16 SPA for a Formula 1-themed pizzeria. The frontend communicates with a Java Spring Boot 3 backend at `http://localhost:8090`.

## Commands

```bash
npm install          # Install dependencies
npm start            # Dev server at http://localhost:5000
npm run build        # Production build → dist/la-vuelta-rapida/
npm test             # Run unit tests (Karma + Jasmine)
```

No linter is configured. TypeScript strict mode is enforced (`tsconfig.json`).

## Architecture

### Tech Stack
- **Angular 16** + TypeScript 5.1 (strict mode)
- **RxJS** for reactive state; **Swiper**, **ngx-bootstrap**, **Bootstrap Icons** for UI
- Backend: Spring Boot 3 / H2 (not part of this repo); all API calls point to `localhost:8090`

### Key Architectural Decisions

**Role-Based Authorization (no guards):**  
Three roles — `admin`, `operador`, `cliente` — are stored in `localStorage` after login. Route protection happens inside each component's `ngOnInit()` via a localStorage role check + redirect. There are no Angular route guards or HTTP interceptors.

**localStorage as Session Store:**  
After login, `user`, `role`, `clienteId`, and `carritoId` are written to localStorage. All services and components read these values directly rather than through a shared auth state service.

**Offline-First Cart:**  
`CarritoService` uses a `BehaviorSubject` (`items$`) as the source of truth. When a user is authenticated (has `carritoId`), cart mutations are synced to the backend; otherwise changes persist only in localStorage. This dual-path logic lives entirely in `carrito.service.ts`.

**No Lazy Loading:**  
All routes are declared in `app-routing.module.ts` and all components in `app.module.ts`. No feature modules or lazy-loaded chunks.

### Service Responsibilities

| Service | Key Role |
|---------|---------|
| `auth.service.ts` | Login → stores session in localStorage, role-based redirect |
| `carrito.service.ts` | Cart BehaviorSubject, online/offline sync, clear on checkout |
| `comida.service.ts` | Product CRUD + recommendations |
| `pedido.service.ts` | Create order from cart, status updates |
| `cliente.service.ts` | Profile management, username uniqueness check |

### Component Patterns

- **Smart containers** (fetch data, own subscriptions): `MenuComponent`, `CarritoComponent`, `PerfilComponent`, admin/operator dashboards
- **Dumb presentational**: `CardsComponent`, `PerfilInfoRowComponent`, `InputIconFieldComponent`
- Always unsubscribe in `ngOnDestroy()` — the codebase uses explicit `Subscription` management

### Core Data Models (`src/app/models/`)

```
Comida → belongs to Categoria, has Adicional[]
Carrito → belongs to Cliente, has LineaPedido[]
Pedido → created from Carrito, has estado: 'RECIBIDO'|'COCINANDO'|'ENVIADO'|'ENTREGADO'
LineaPedido → links Comida + Adicional[] to either a Carrito or Pedido
```

## Auth Roles

| Role | Default Redirect | Scope |
|------|-----------------|-------|
| `admin` | `/admin/comidas` | Full CRUD on products, operators, additionals, delivery staff |
| `operador` | `/operador/inicio` | View/manage active orders and delivery assignment |
| `cliente` | `/menu` | Browse, cart, checkout, own profile and order history |

## Adding a New Feature Checklist

1. Add TypeScript interface to `src/app/models/`
2. Add service in `src/app/services/` following existing `HttpClient` + `.subscribe({ next, error })` pattern
3. Create component, declare it in `app.module.ts`
4. Add route in `app-routing.module.ts`
5. Guard the route with a localStorage role check in `ngOnInit()`

## Notable Patterns to Follow

- Query params (`?success=added`, `?error=notfound`) are used for cross-navigation flash messages
- Backend URL constant is defined at the top of each service file as `const API_URL = 'http://localhost:8090'`
- Global F1-themed CSS variables and shared styles live in `src/styles.css`
- `src/app/data/mock-data.ts` exists for development but production components use live API calls
