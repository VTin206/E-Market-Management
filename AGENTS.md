# Project Instructions

## Project Overview

E-Market Management is a Spring Boot ecommerce backend with a static demo storefront served from Spring resources. The backend exposes REST APIs under `/api/**`; the frontend is plain HTML/CSS/JavaScript in `src/main/resources/static/frontend`.

## Tech Stack

- Java 21 project configured with Maven Wrapper (`mvnw`, `mvnw.cmd`).
- Spring Boot 4.1.0 with Web MVC, Spring Security, Data JPA, Validation, Flyway, PostgreSQL, Lombok, and JJWT.
- Database schema is managed by Flyway migrations in `src/main/resources/db/migration`.
- Frontend uses no npm package manager and no bundler. It is static `index.html`, `css/styles.css`, and `js/*.js`.
- No ESLint, Prettier, Checkstyle, Spotless, package.json scripts, or frontend test runner are currently configured.

## Project Structure

- `src/main/java/E_Market_Management/EmarketApplication.java`: Spring Boot entry point and root for component, entity and repository scanning.
- `src/main/java/E_Market_Management/modules`: business modules (`auth`, `catalog`, `cart`, `order`, `customer`, `review`).
- Each module owns its `controller`, `application` (services and transactions), `repository`, `domain` (JPA entities), `dto`, and `mapper` packages as needed.
- `src/main/java/E_Market_Management/modules/auth/security` and `modules/auth/config`: JWT/security implementation and configuration.
- `src/main/java/E_Market_Management/shared`: cross-cutting DTOs and exceptions.
- `src/main/resources/static/frontend`: static storefront UI.
- `src/main/resources/application.properties`: active Spring config; imports `.env`.
- `.env` contains local secrets and must not be edited or committed.

## Development Commands

Run commands from the repository root unless noted.

- Backend dev server: `.\mvnw.cmd spring-boot:run`
- Backend tests/compile check: `.\mvnw.cmd test`
- Backend package/build: `.\mvnw.cmd package`
- Static frontend only:
  - `cd src\main\resources\static\frontend`
  - `python -m http.server 5173`
  - open `http://localhost:5173/index.html`
- Frontend through Spring Boot: open `http://localhost:8080/frontend/index.html` after `spring-boot:run`.

There is no real lint, format, typecheck, or npm build command in this project yet. Do not invent one.

## Coding Conventions

- Keep the existing package name `E_Market_Management` and feature subpackages.
- Java classes use PascalCase; methods, fields, and variables use camelCase.
- Keep backend layering within each module: Controller -> Service (`application`) -> Repository/Mapper -> Entity (`domain`)/DTO.
- Use constructor injection for Spring dependencies, matching the existing code.
- Put transactional business logic in services. Use `@Transactional` on write operations and `@Transactional(readOnly = true)` for read-only service methods when applicable.
- Use DTO request/response objects at API boundaries. Do not return JPA entities directly from controllers.
- Use Lombok consistently for entities/DTOs where the project already does (`@Getter`, `@Setter`, `@Builder`, constructors).
- Keep API routes under `/api/<resource>`. Use `ResponseEntity` for status-specific responses.
- Add or change database schema only through new Flyway migrations. Do not rely on Hibernate schema generation; `ddl-auto` is `validate`.
- Frontend JavaScript follows the current IIFE pattern. Keep API calls in `js/api.js`, UI state/rendering in `js/app.js`, and demo data in `js/data.js`.
- Frontend CSS is plain CSS in `css/styles.css`; reuse existing `:root` variables and class patterns before adding new styling.

## Architecture Rules

- Read the related controller, service, DTO, entity, repository, mapper, and migration before changing backend behavior.
- Preserve API contracts unless the task explicitly asks to change them.
- Prefer small, focused changes over broad rewrites.
- Do not add dependencies unless the existing stack cannot reasonably solve the task.
- Do not duplicate a service, mapper, DTO, or UI pattern if a similar one already exists.
- Keep frontend and backend integration compatible with both same-origin Spring serving and static frontend fallback behavior.

## UI/UX Rules

- Maintain the current storefront design language: blue primary color, compact ecommerce layout, 8px-ish radii, product cards, drawer/modal patterns.
- Check responsive behavior on mobile, tablet, and desktop when touching UI: especially 320, 375, 390, 430, 768, 1024, 1280, 1440, and 1920 px when feasible.
- Prevent text overflow, component overlap, and unintended page-level horizontal scrolling.
- Prefer flexible layout (`min-width: 0`, wrapping, responsive grids) over fixed widths/heights.
- Do not use `overflow: hidden` merely to hide a broken layout. Use it only for intentional framed visuals or scroll containers.
- Test long product names, long email/URL-like strings, empty results, backend error fallback, cart drawer, auth modal, and product detail when relevant.
- Keep button, input, card, badge, modal, drawer, spacing, typography, and color treatment consistent with existing CSS.
- Do not redesign the UI unless the task asks for a redesign.

## Error Handling

- Backend missing resources should use `ResourceNotFoundException` as existing services do.
- Validate incoming request DTOs with Jakarta Validation where applicable and keep `@Valid` in controllers.
- Frontend API errors should flow through `emarketApi.request` and show user-facing feedback through existing toast/demo fallback behavior.
- Do not swallow errors silently. If a fallback is intentional, make it visible or documented in UI state text.

## Testing

- Before finishing backend changes, run `.\mvnw.cmd test` when feasible.
- Before finishing build-sensitive changes, run `.\mvnw.cmd package` when feasible.
- Before finishing frontend changes, run the static frontend or Spring Boot frontend and inspect the changed screens. Use browser screenshots/DOM overflow checks when possible.
- Remember that untracked files inside `src/main/java` still affect Maven compilation. Check `git status --short` before interpreting build failures.
- If checks cannot be run or fail due to local environment/configuration, report exactly what was run and why it failed.

## Git Rules

- Do not commit or push unless the user explicitly asks.
- Use the existing commit style when committing: examples include `feat(cart): ...`, `feat(product): ...`, `design: ...`, and `refactor(product): ...`.
- Do not stage unrelated files. Pay special attention to untracked local work such as `src/main/java/E_Market_Management/modules/order/application/OrderService.java`.
- Never rewrite history or force-push unless explicitly requested.

## Do Not

- Do not delete files unless required by the task.
- Do not edit `.env` or introduce secrets into tracked files.
- Do not change dependencies, Maven config, database migrations, or API contracts without a clear reason.
- Do not rewrite a whole component/service to fix a small issue.
- Do not create premature abstractions.
- Do not ignore lint/test/build failures to claim a task is complete.
- Do not change business logic when the task is UI-only.

## Definition of Done

- The relevant code was read before editing.
- The change is scoped to the task and follows existing project patterns.
- Appropriate Maven/frontend checks were run, or skipped with a clear reason.
- UI changes were visually or programmatically checked at relevant breakpoints/states.
- `git status --short` was reviewed so unrelated user work is not accidentally included.
