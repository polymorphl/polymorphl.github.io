# ADR: Error handling — NestJS exceptions only

**Status**: Accepted  ·  **Date**: 2026-01-15

## Context

The API ships a global exception filter that intercepts NestJS HTTP exceptions
and serialises them into a consistent JSON envelope
(`{ statusCode, message, error }`). Native `Error` objects bypass this filter,
leak stack traces to the client in development, and produce inconsistent
HTTP 500 responses in production.

## Decision

Never throw a native `Error` in a service. Use NestJS HTTP exceptions
(`NotFoundException`, `BadRequestException`, `ConflictException`, etc.) so
the global exception filter can intercept and format them correctly.

## Consequences

**Positive**
- All errors are caught by the global filter — no unhandled rejections.
- HTTP status codes are consistent across the API.
- Native `Error` leaking to the client is impossible.

**Negative**
- Developers must know which NestJS exception maps to which HTTP status.
- Third-party libraries that throw native errors must be caught and re-thrown.

## Verification

```bash
# throw new Error(...) is forbidden in services
grep -rn "throw new Error(" src --include="*.service.ts"

# throw new Error(...) is also forbidden in guards and interceptors
grep -rn "throw new Error(" src \
  --include="*.guard.ts" \
  --include="*.interceptor.ts"
```

**Violation:** `throw new Error(...)` found — replace with the appropriate
NestJS exception:
- Resource not found → `NotFoundException`
- Invalid input → `BadRequestException`
- Duplicate / conflict → `ConflictException`
- Unauthorised → `UnauthorizedException`

**Manual check:**
- Any `try/catch` block wrapping a third-party call must re-throw a NestJS
  exception, not re-throw the original error.
