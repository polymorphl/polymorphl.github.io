# ADR: Layered architecture — controllers & services

**Status**: Accepted  ·  **Date**: 2026-01-12

## Context

As the API grows, mixing HTTP concerns with business logic in controllers
creates classes that are hard to test and hard to reuse. Two failure modes
kept appearing: repository calls scattered across controllers, and business
logic unreachable without spinning up an HTTP context.

## Decision

Controllers handle HTTP only. All business logic and data access must go
through a Service. Direct repository injection in a controller is forbidden.

## Consequences

**Positive**
- Services are independently testable without HTTP context.
- Swapping the data layer requires only touching the service.
- Controllers stay thin and readable.

**Negative**
- One extra indirection for trivial CRUD endpoints.
- Developers must resist the temptation to "just inject the repo here quickly."

## Verification

```bash
# @InjectRepository must never appear in a controller
grep -rn "@InjectRepository" src --include="*.controller.ts"

# Controllers must only inject classes ending in Service
grep -rn "constructor" src --include="*.controller.ts" -A 5 \
  | grep "Inject\|inject" \
  | grep -v "Service"
```

**Violation (first check):** `@InjectRepository` found in a controller —
move data access to the corresponding service.

**Violation (second check):** non-Service dependency injected in a
controller — only Services should be constructor-injected.

**Manual check:**
- No TypeORM / Prisma / Mongoose calls (`find`, `save`, `create`, `query`)
  appear directly in any controller file.
