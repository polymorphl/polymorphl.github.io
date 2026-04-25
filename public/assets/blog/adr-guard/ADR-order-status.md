# ADR: Order status — guarded state transitions

**Status**: Accepted  ·  **Date**: 2026-02-03

## Context

Order status is modified in several places: payment webhook, cancellation
endpoint, fulfilment service. Without a central guard, invalid transitions
accumulate silently — a DELIVERED order can be cancelled, a CANCELLED order
can be re-shipped. These bugs only surface in production edge cases and are
nearly impossible to reproduce in tests.

## Decision

Status mutations must go through a single `OrderStateMachine.transition()`
method that enforces the allowed graph:

```
PENDING → CONFIRMED → SHIPPED → DELIVERED
PENDING → CANCELLED
CONFIRMED → PAYMENT_FAILED → CANCELLED
```

Direct assignment to `order.status` outside of `OrderStateMachine` is
forbidden. Any transition not in the graph above must throw a
`ConflictException`.

## Consequences

**Positive**
- Illegal transitions are rejected at runtime with a clear error.
- The allowed graph is in one place — easy to audit and extend.
- Side effects (emails, events) can be attached centrally to transitions.

**Negative**
- Every new status or edge case requires updating the state machine.
- Developers must resist bypassing it for "quick fixes" in urgent hotfixes.

## Verification

```bash
# order.status must never be assigned directly outside the state machine
grep -rn "\.status\s*=" src --include="*.ts" \
  | grep -v "OrderStateMachine" \
  | grep -v "\.spec\.ts"

# OrderStateMachine.transition() must be the only mutating entry point
grep -rn "OrderStateMachine" src --include="*.ts" \
  | grep -v "transition(" \
  | grep -v "import\|spec"
```

**Violation (first check):** `order.status =` found outside `OrderStateMachine`
— move the assignment into `transition()`.

**Violation (second check):** `OrderStateMachine` used without calling
`transition()` — verify it is not being used to read state while bypassing
the guard.

**Manual check — transition guard correctness:**
Open `OrderStateMachine.transition()` and verify:
- The allowed-transitions map covers exactly the graph above — no extra edges,
  no missing edges.
- Each unsupported transition throws `ConflictException` (not a silent no-op,
  not a native `Error`).
- `PAYMENT_FAILED → CANCELLED` is present (frequently forgotten in hotfixes).
- No `if (env === 'test')` bypass or similar escape hatch exists.

This check cannot be automated: a grep can confirm the method is called, but
cannot validate that the transition table is logically complete and correct.
