# Modular monolith architecture

Backend code is organized by business module under `E_Market_Management.modules`.
Each module owns its application services, controllers, DTOs, repositories and
domain entities where applicable.

## Modules

- `auth`: registration, login, JWT security components and security configuration.
- `catalog`: products, categories, brands and product presentation mapping.
- `cart`: carts, cart items and cart operations.
- `order`: orders, order items and checkout application logic.
- `customer`: users, roles and memberships.
- `review`: reviews and review persistence.
- `E_Market_Management.shared`: cross-cutting DTOs and exceptions shared by the business modules.

## Source layout

```text
E_Market_Management/
  EmarketApplication.java
  modules/
    auth/          # application, controller, dto, security, config
    catalog/       # application, controller, domain, dto, mapper, repository
    cart/          # application, controller, domain, dto, repository
    order/         # application, domain, dto, mapper, repository
    customer/      # domain, dto, repository
    review/        # domain, dto, repository
  shared/
    dto/
    exception/
```

`EmarketApplication` stays in the root package so Spring Boot discovers all
module components, repositories and entities with its default scanning rules.
Security configuration belongs to `modules.auth.config`. New feature classes
belong inside their owning module; do not recreate root-level layer packages.

The application keeps the existing REST routes under `/api/**` and builds as
one Maven application. Cross-module references use explicit imports. Existing
JPA relationships and direct repository access still couple modules; package
organization alone does not enforce isolation or remove dependency cycles.
