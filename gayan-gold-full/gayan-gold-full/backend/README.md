# Gayan Gold House – Spring Boot Backend

Production-ready Spring Boot + Java backend for the existing **Gayan Gold** jewellery e-commerce frontend.

> **Important:** The provided frontend is a **gold & jewellery** boutique platform (Gayan Gold House), not a clothing store. This backend is designed strictly against the actual frontend code, types, and API contracts found in `src/services/api.ts` and the existing Node/Express backend.

## Frontend → Backend Mapping (Audit Summary)

| Frontend Feature | Page / Component | API Endpoint(s) | Entity / Notes |
|------------------|------------------|-----------------|----------------|
| Login / Register | LoginPage | `POST /api/auth/login`, `POST /api/auth/register` | User + RewardProfile (500 welcome points) |
| Profile / Me | AccountPage | `GET /api/auth/me`, `PUT /api/auth/profile` | User |
| Product listing + filters | ShopPage | `GET /api/products?category&purity&search&sort&featured&...` | Product + Category |
| Product detail + related + reviews | ProductDetailPage | `GET /api/products/{id\|slug}` | Product, Review |
| Categories | Shop / Home | `GET /api/categories` | Category |
| Gold rates & calculator | GoldRatesPage | `GET /api/gold-rates/today`, `/history`, `POST /calculate` | GoldRate |
| Cart → Checkout | CheckoutPage | `POST /api/orders` | OrderEntity + OrderItem (price at purchase time) |
| My Orders | AccountPage | `GET /api/orders/my-orders` | OrderEntity |
| Wishlist | WishlistPage | `GET /api/wishlist`, `POST /api/wishlist/toggle` | WishlistItem |
| Rewards / Lucky Spin | RewardsPage | `/api/rewards/*` | RewardProfile, LuckySpin* |
| Appointments | AppointmentsPage | `/api/appointments/*` | Appointment + StoreActivity |
| Store traffic | Live indicators | `/api/store-activity/live` | StoreActivity |
| Gifts / Combos / Offers | GiftCelebration, Offers | `/api/gifts/*`, `/api/offers/*` | Gift*, Offer |
| Homepage sections | HomePage | `/api/homepage/sections` | HomepageSection |
| Admin Dashboard KPIs | AdminPage | `GET /api/admin/dashboard` | Aggregates from Orders, Users, Products, Appointments |
| Admin CRUD Products / Categories / Orders / Users | AdminPage | `/api/admin/*`, `/api/products`, `/api/categories` | Full CRUD |
| Reviews | ProductDetail | `/api/reviews` | Review |

All endpoints return shapes that match the TypeScript interfaces in `src/types/index.ts` (plain JSON objects, not wrapped in `{success,data}` unless the original Node API did so). Errors use `{ error | message }` so the existing `api.ts` error handling continues to work.

## Technology Stack

- Java 17
- Spring Boot 3.3.4
- Spring Web, Data JPA, Security, Validation
- MySQL 8 (Docker)
- Flyway migrations
- JWT (jjwt 0.12.x)
- Lombok
- Maven

## Project Structure

```
src/main/java/com/example/gayangold/
├── entity/
├── controller/
├── dto/request/  dto/response/
├── repository/
├── service/  service/impl/
├── exception/
├── config/
├── security/
└── util/
```

## Prerequisites

- JDK 17+
- Maven 3.9+
- Docker & Docker Compose

## 1. Start MySQL (Docker)

```bash
cd gayan-gold-backend
docker compose up -d
```

This starts MySQL 8 on port **3306** with:

| Variable | Default |
|----------|---------|
| DB_NAME | `gayan_gold` |
| DB_USERNAME | `gayan` |
| DB_PASSWORD | `gayan_gold_secret` |
| Root password | `root_secret` |

Data is persisted in the Docker volume `gayan_gold_mysql_data`.

## 2. Configure Environment (optional)

```bash
export DB_HOST=localhost
export DB_PORT=3306
export DB_NAME=gayan_gold
export DB_USERNAME=gayan
export DB_PASSWORD=gayan_gold_secret
export JWT_SECRET=GayanGoldHouseSuperSecretKeyForJWT2026MustBeLongEnoughForHS256Algorithm!!
export CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

Or place values in `application.properties` / environment files.

## 3. Run the Backend

```bash
mvn spring-boot:run
```

Or with Docker profile:

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=docker
```

Health check: `GET http://localhost:8080/api/health`

## 4. Seeded Admin Accounts

| Email | Password | Role |
|-------|----------|------|
| admin@gayangold.com | AdminGold2026! | ADMIN |
| admin@gayangoldhouse.lk | AdminGold2026! | ADMIN |
| janendra.silva2001@gmail.com | AdminGold2026! | ADMIN |
| customer@example.com | gold123 | CUSTOMER |

## 5. Frontend Integration

The frontend already calls relative paths such as `/api/products`, `/api/auth/login`, etc.

**Option A – Vite proxy (recommended for local dev)**

In `vite.config.ts`:

```ts
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
    },
  },
},
```

**Option B – Absolute base URL**

Set a base URL in the frontend or environment if the frontend and backend are on different origins. CORS is already configured for `localhost:5173` and `localhost:3000`.

Token storage remains `localStorage` key `gayan_gold_token` – no frontend change required for JWT.

## Implemented Core APIs

- Auth (login, register, me, profile, forgot-password stub)
- Categories CRUD
- Products list (filter/search/sort), detail (related + reviews), create/update/delete
- Health endpoint
- Security: JWT + role-based (`ROLE_ADMIN` / `ROLE_CUSTOMER`)
- Global exception handling matching frontend error parsing
- Flyway schema + seed data (categories, sample products, gold rates, store activity)

## Extending (remaining modules)

The following modules exist in the frontend and original Node backend and should be implemented following the same patterns already established:

- Orders + stock reduction (transactional)
- Wishlist
- Rewards / Lucky Spin (24h cooldown)
- Appointments + availability
- Store activity live updates
- Gifts (categories, products, combos, recommendations)
- Offers & Homepage sections
- Reviews (submit + admin approve)
- Admin dashboard aggregates
- Notifications / Audit logs
- Image upload (base64 → URL storage)

Use the existing controllers/services as templates. Keep response shapes identical to the TypeScript types.

## Database

- Single source of truth: **MySQL**
- No in-memory lists for business data
- Schema managed by Flyway (`src/main/resources/db/migration/V1__initial_schema.sql`)
- Product images stored as URL list (ElementCollection)
- Order items store price at purchase time

## Testing

```bash
mvn test
```

Add unit/integration tests for ProductService, AuthService, Order creation with stock validation, and admin authorization.

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Connection refused to MySQL | Ensure `docker compose up -d` and wait for healthy status |
| Flyway / schema errors | Drop volume `docker volume rm gayan-gold-backend_gayan_gold_mysql_data` and restart |
| CORS errors | Add frontend origin to `app.cors.allowed-origins` |
| 401 on protected routes | Ensure `Authorization: Bearer <token>` header |
| Port 8080 in use | Change `server.port` in `application.properties` |

## License

Private – Gayan Gold House project.
