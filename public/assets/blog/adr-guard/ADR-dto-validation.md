# ADR: DTO validation — class-validator required

**Status**: Accepted  ·  **Date**: 2026-01-20

## Context

The global `ValidationPipe` is configured with `whitelist: true` and
`forbidNonWhitelisted: true`. It only runs when the incoming body is typed
with a DTO class decorated with `class-validator`. An untyped
`@Body() body: any` silently bypasses validation, letting malformed or
unexpected payloads reach the service layer.

## Decision

Every incoming request body must be typed with a DTO decorated with
`class-validator`. `@Body() body: any` and
`@Body() body: Record<string, unknown>` are forbidden on public endpoints.

## Consequences

**Positive**
- `ValidationPipe` rejects malformed payloads before they hit the service.
- API contracts are explicit and documented via Swagger decorators.
- No runtime surprises from untyped bodies.

**Negative**
- Every new endpoint requires a dedicated DTO class, even for simple payloads.
- Partial updates (PATCH) need either a separate DTO or `PartialType`
  from `@nestjs/mapped-types`.

## Verification

```bash
# @Body() must never be typed as `any`
grep -rn "@Body().*: any" src --include="*.controller.ts"

# @Body() must never be typed as Record<string, unknown>
grep -rn "@Body().*: Record" src --include="*.controller.ts"
```

**Violation (first check):** `@Body() body: any` found — create a DTO class
with appropriate `class-validator` decorators.

**Violation (second check):** `@Body() body: Record<string, unknown>` found —
same fix.

**Manual check:**
- Every DTO class used in `@Body()` must have at least one `class-validator`
  decorator (`@IsString()`, `@IsUUID()`, `@IsNotEmpty()`, etc.) on each
  property.
