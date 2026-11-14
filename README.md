# E-Market Management

[![CI](https://github.com/VTin206/E-Market-Management/actions/workflows/ci.yml/badge.svg)](https://github.com/VTin206/E-Market-Management/actions/workflows/ci.yml)

E-Market Management is a Spring Boot ecommerce backend with a static storefront served from the same application. It provides product catalog management, authentication, cart and checkout flows, order tracking, reviews, memberships, and administrator operations through REST APIs.

## Highlights

- Spring Boot 4.1.0 on Java 21.
- PostgreSQL persistence with Flyway migrations and Hibernate schema validation.
- Stateless JWT access-token authentication with rotating <code>HttpOnly</code> refresh-token cookies.
- Role-based access control for <code>ADMIN</code>, <code>MEMBER</code>, and <code>CUSTOMER</code> users.
- Product, brand, category, cart, order, payment, review, membership, and user modules.
- Static HTML/CSS/JavaScript storefront with responsive layouts and no npm or bundler requirement.
- OpenAPI/Swagger UI for interactive API documentation.
- Docker Compose setup for the application and a local PostgreSQL database.
- GitHub Actions CI for Java 21 test and verification builds.

## Technology stack

| Area | Technology |
| --- | --- |
| Language | Java 21 |
| Backend | Spring Boot 4.1.0, Spring MVC, Spring Security |
| Persistence | Spring Data JPA, PostgreSQL |
| Schema management | Flyway |
| Validation | Jakarta Bean Validation |
| Authentication | JWT with JJWT 0.12.6, BCrypt, refresh-token cookies |
| API documentation | Springdoc OpenAPI 3.2.0 |
| Frontend | Plain HTML, CSS, and JavaScript |
| Packaging | Maven Wrapper, Docker, Docker Compose |

## Requirements

For local development:

- Java 21
- PostgreSQL
- Git
- Python 3, only if the frontend is served separately

For Docker development:

- Docker Desktop with the Linux containers/WSL 2 backend enabled

## Quick start with Docker

Docker is the recommended way to run the complete application locally because it starts both Spring Boot and PostgreSQL.

1. Create a local environment file if one does not exist:

   ~~~powershell
   Copy-Item .env.example .env
   ~~~

2. Set a non-empty, private <code>JWT_SECRET</code> in <code>.env</code>. Do not commit <code>.env</code>.

3. Start the application from the repository root:

   ~~~powershell
   docker compose up --build
   ~~~

   If the standalone Compose command is installed, use <code>docker-compose up --build</code>.

4. Open the storefront:

   ~~~text
   http://localhost:8080/frontend/index.html
   ~~~

The Compose setup contains:

- <code>app</code>: the Spring Boot application on port <code>8080</code>.
- <code>postgres</code>: PostgreSQL 16 on port <code>5432</code>.
- <code>emarket-data</code>: a named volume that preserves PostgreSQL data between restarts.

Flyway applies all migrations automatically when the application starts.

Useful Docker commands:

~~~powershell
# View running services
docker compose ps

# Follow application logs
docker compose logs -f app

# Stop and remove containers, keeping database data
docker compose down

# Stop and remove containers and delete database data
docker compose down -v
~~~

## Local development without Docker

1. Start PostgreSQL and create a database matching the values in <code>.env</code>.

2. Create <code>.env</code> from the example and configure the database and JWT values:

   ~~~powershell
   Copy-Item .env.example .env
   ~~~

3. Start the backend from the repository root:

   ~~~powershell
   .\mvnw.cmd spring-boot:run
   ~~~

   On macOS/Linux:

   ~~~bash
   ./mvnw spring-boot:run
   ~~~

4. Open <code>http://localhost:8080/frontend/index.html</code>.

The application imports <code>.env</code> through <code>spring.config.import</code> and expects <code>ddl-auto=validate</code>; database structure must therefore be changed through a new Flyway migration, not Hibernate auto-generation.

## Environment configuration

<code>.env</code> is local-only and is ignored by Git. Use <code>.env.example</code> as the starting point. Never put real credentials, API keys, or mail passwords in tracked files.

### Required variables

| Variable | Description |
| --- | --- |
| <code>DB_URL</code> | JDBC PostgreSQL connection URL, for example <code>jdbc:postgresql://localhost:5432/emarket</code> |
| <code>DB_USERNAME</code> | PostgreSQL username |
| <code>DB_PASSWORD</code> | PostgreSQL password |
| <code>JWT_SECRET</code> | Secret used to sign access tokens; use a long random value |
| <code>JWT_EXPIRATION</code> | Access-token lifetime in milliseconds |

### Optional variables

| Variable | Default | Description |
| --- | --- | --- |
| <code>JWT_REFRESH_EXPIRATION</code> | <code>604800000</code> | Refresh-token lifetime in milliseconds; seven days by default |
| <code>AUTH_REFRESH_COOKIE_SECURE</code> | <code>false</code> | Set to <code>true</code> when serving through HTTPS |
| <code>CORS_ALLOWED_ORIGINS</code> | <code>http://localhost:5173,http://127.0.0.1:5173</code> | Comma-separated frontend origins |
| <code>MAIL_HOST</code> | <code>localhost</code> | SMTP host for password reset messages |
| <code>MAIL_PORT</code> | <code>587</code> | SMTP port |
| <code>MAIL_USERNAME</code> | empty | SMTP username |
| <code>MAIL_PASSWORD</code> | empty | SMTP password or provider app password |
| <code>MAIL_FROM</code> | empty | Sender address |
| <code>MAIL_SMTP_AUTH</code> | <code>true</code> | Whether SMTP authentication is enabled |
| <code>MAIL_SMTP_STARTTLS_ENABLE</code> | <code>true</code> | Whether SMTP STARTTLS is enabled |
| <code>FRONTEND_BASE_URL</code> | <code>http://localhost:8080/frontend/index.html</code> | Frontend URL used in password-reset links |

When running with Docker Compose, the application receives its database connection from the <code>postgres</code> service. The Compose defaults are database <code>emarket</code>, user <code>emarket</code>, and password <code>emarket123</code>; change them in <code>docker-compose.yml</code> before using the setup outside local development.

## Frontend

The storefront is located at <code>src/main/resources/static/frontend</code>:

~~~text
frontend/
├── index.html          # Storefront, authentication, cart, checkout, orders, admin UI
├── css/styles.css      # Responsive storefront styles
└── js/
    ├── api.js          # API client, JWT storage, refresh handling, error handling
    └── app.js          # UI state, rendering, search, cart, checkout, reviews, admin flows
~~~

### Serve the frontend separately

This is useful when iterating on the static UI:

~~~powershell
Set-Location src\main\resources\static\frontend
python -m http.server 5173
~~~

Open <code>http://localhost:5173/index.html</code>. The frontend calls the backend at <code>http://localhost:8080</code> when opened directly or uses relative API paths when served by Spring Boot. Keep the frontend origin in <code>CORS_ALLOWED_ORIGINS</code> when running the two servers separately.

## REST API overview

All application endpoints use the <code>/api</code> prefix. Protected endpoints require an <code>Authorization: Bearer &lt;access-token&gt;</code> header. Login and registration also set the <code>emarket_refresh</code> <code>HttpOnly</code> cookie.

### Authentication

| Method | Endpoint | Access |
| --- | --- | --- |
| <code>POST</code> | <code>/api/auth/register</code> | Public |
| <code>POST</code> | <code>/api/auth/login</code> | Public |
| <code>POST</code> | <code>/api/auth/refresh</code> | Refresh cookie |
| <code>POST</code> | <code>/api/auth/logout</code> | Public |
| <code>PATCH</code> | <code>/api/auth/change-password</code> | Authenticated |
| <code>POST</code> | <code>/api/auth/forgot-password</code> | Public; SMTP required to send mail |
| <code>POST</code> | <code>/api/auth/reset-password</code> | Public with reset token |

### Catalog and memberships

| Resource | Public operations | Administrator operations |
| --- | --- | --- |
| Products | <code>GET /api/products</code>, <code>GET /api/products/{id}</code> | <code>POST</code>, <code>PUT</code>, <code>DELETE</code> |
| Categories | <code>GET /api/category</code>, <code>GET /api/category/{id}</code> | <code>POST</code>, <code>PUT</code>, <code>DELETE</code> |
| Brands | <code>GET /api/brand</code>, <code>GET /api/brand/{id}</code> | <code>POST</code>, <code>PUT</code>, <code>DELETE</code> |
| Memberships | — | <code>GET /api/membership</code> |

Product listing supports <code>categoryId</code>, <code>brandId</code>, <code>page</code>, and <code>size</code> query parameters.

### Cart and orders

| Method | Endpoint | Access |
| --- | --- | --- |
| <code>GET</code> | <code>/api/cart</code> | Authenticated |
| <code>POST</code> | <code>/api/cart/items</code> | Authenticated |
| <code>PATCH</code> | <code>/api/cart/items/{itemId}</code> | Authenticated |
| <code>DELETE</code> | <code>/api/cart/items/{itemId}</code> | Authenticated |
| <code>POST</code> | <code>/api/orders</code> | Public; guests send <code>items</code> in the request |
| <code>GET</code> | <code>/api/orders/me</code> | Authenticated |
| <code>GET</code> | <code>/api/orders/{id}</code> | Order owner or administrator |
| <code>POST</code> | <code>/api/orders/{id}/cancel</code> | Authenticated order owner |
| <code>POST</code> | <code>/api/orders/track?trackingCode={uuid}</code> | Public |
| <code>GET</code> | <code>/api/orders?page=0&amp;size=10</code> | Administrator |
| <code>PUT</code> | <code>/api/orders/{id}</code> | Administrator |
| <code>POST</code> | <code>/api/orders/{id}/payment/confirm</code> | Administrator |

An order starts in <code>PENDING</code>. Cancellation restores stock. Completing an authenticated customer's order awards points and recalculates the membership tier.

### Reviews and users

| Resource | Endpoints | Access |
| --- | --- | --- |
| Reviews | <code>GET /api/reviews?productId={id}</code>, <code>GET /api/reviews/{id}</code> | Public |
| Reviews | <code>POST /api/reviews/product/{productId}</code> | <code>CUSTOMER</code> or <code>MEMBER</code> |
| Reviews | <code>PUT /api/reviews/{reviewId}</code>, <code>DELETE /api/reviews/{reviewId}</code> | Author or administrator |
| Users | <code>GET /api/users/profile</code>, <code>PATCH /api/users/profile</code> | Authenticated |
| Users | <code>GET /api/users?page=0&amp;size=20</code> | Administrator |
| Users | <code>PATCH /api/users/profile/{id}</code> | Administrator |

## API documentation

With the application running, open:

- Swagger UI: <code>http://localhost:8080/swagger-ui/index.html</code>
- OpenAPI JSON: <code>http://localhost:8080/v3/api-docs</code>

## Database and migrations

Flyway migrations are stored in <code>src/main/resources/db/migration</code> and run in version order. The current migration chain is <code>V1</code> through <code>V12</code> and covers:

- Initial users, memberships, catalog, cart, orders, and reviews schema.
- Schema alignment and uniqueness constraints.
- Fixed membership tiers: <code>MEMBER</code>, <code>SILVER</code>, <code>GOLD</code>, and <code>DIAMOND</code>.
- Payments and payment status.
- Order tracking codes and shipping details.
- Rotating refresh tokens and password-reset tokens.

To change the schema:

1. Add the next migration, for example <code>V13__describe_the_change.sql</code>.
2. Keep the migration forward-only and idempotent where practical.
3. Start the application and verify Flyway completes successfully.
4. Do not edit an already-applied migration in a shared database.

## Project structure

~~~text
src/
├── main/java/E_Market_Management/
│   ├── auth/          # Registration, login, JWT, refresh and password reset
│   ├── brand/         # Brand API and persistence
│   ├── cart/          # Customer carts and cart items
│   ├── category/      # Product category API
│   ├── config/        # Security and application configuration
│   ├── membership/    # Membership tiers and point-based upgrades
│   ├── order/         # Checkout, orders, payments, tracking, shipping
│   ├── product/       # Product catalog and inventory
│   ├── review/        # Product reviews
│   ├── shared/        # Common responses and exception handling
│   └── user/          # Profiles, roles, and administrator user operations
├── main/resources/
│   ├── db/migration/  # Flyway SQL migrations
│   ├── static/frontend/# Static storefront
│   └── application.properties
└── test/java/         # Service-level tests
~~~

Each backend feature follows the project convention of keeping its controller, DTO, entity, mapper, repository, and service code together where applicable:

~~~text
Controller → Service → Repository/Mapper → Entity/DTO
~~~

## Testing and verification

Run the backend test suite:

~~~powershell
.\mvnw.cmd test
~~~

Create a production-style package:

~~~powershell
.\mvnw.cmd package
~~~

The GitHub Actions workflow runs <code>./mvnw -B clean verify</code> on pushes and pull requests targeting <code>main</code> using Java 21.

There is currently no npm project, frontend bundler, ESLint, Prettier, or dedicated frontend test runner. Frontend verification is performed by serving the static files and checking the relevant screens in a browser.

## Error responses

The shared exception handler returns JSON errors with these fields:

~~~json
{
  "timestamp": "2026-01-01T12:00:00Z",
  "status": 404,
  "error": "Not Found",
  "message": "Resource not found",
  "path": "/api/products/999"
}
~~~

## Security notes

- Do not commit <code>.env</code>, database passwords, JWT secrets, SMTP credentials, or refresh tokens.
- Use HTTPS and set <code>AUTH_REFRESH_COOKIE_SECURE=true</code> outside local HTTP development.
- Replace the development PostgreSQL password before sharing a deployed Compose configuration.
- Keep access tokens short-lived and use the refresh-token flow for session renewal.
- Review CORS origins before exposing the API outside localhost.

## License

No license has been declared for this repository yet.
