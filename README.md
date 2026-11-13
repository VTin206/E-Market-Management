# E-Market-Management

## Local setup

- Java 21 and PostgreSQL are required. The project uses the Maven Wrapper and Flyway.
- Copy `.env.example` to `.env`, then set `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `JWT_SECRET`, and `JWT_EXPIRATION` for your local environment. Keep `.env` private and out of Git.
- Start the backend from the repository root with `./mvnw spring-boot:run` (Windows PowerShell: `./mvnw.cmd spring-boot:run`). Flyway applies database migrations at startup.
- Open the storefront at `http://localhost:8080/frontend/index.html`.
- Run backend tests with `./mvnw test` (Windows PowerShell: `./mvnw.cmd test`).

## Authentication sessions

- `JWT_EXPIRATION` is the access-token lifetime in milliseconds; the example uses 15 minutes. `JWT_REFRESH_EXPIRATION` is the refresh-token lifetime in milliseconds; the default is 7 days.
- Login and registration return an access token and set a rotating refresh token in an `HttpOnly` cookie. The refresh token itself is stored as a SHA-256 hash in the database.
- Set `AUTH_REFRESH_COOKIE_SECURE=true` when serving over HTTPS. Keep it `false` for local HTTP development.
- When using the static frontend at `http://localhost:5173`, keep that origin in `CORS_ALLOWED_ORIGINS`. The Spring-served frontend at `http://localhost:8080` is same-origin and needs no CORS entry.

## API behavior

- API routes use the `/api` prefix. Errors use the shared JSON fields `timestamp`, `status`, `error`, `message`, and `path`.
- Product reviews are public to read with `GET /api/reviews?productId={id}`. A signed-in customer or member can create one with `POST /api/reviews/product/{productId}`. Only its author or an admin can update/delete it.
- Orders use `PENDING`, `PROCESSING`, `COMPLETED`, and `CANCELLED`. Allowed changes are `PENDING` to `PROCESSING` or `CANCELLED`, then `PROCESSING` to `COMPLETED` or `CANCELLED`. Repeating the current state is allowed; completed and cancelled orders are terminal.
