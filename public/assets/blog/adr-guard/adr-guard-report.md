## ADR Compliance Report

```
layered-arch   ✗ 1 violation — @InjectRepository in orders.controller.bad.ts:10
error-handling ✗ 1 violation — throw new Error() in orders.service.bad.ts:8
dto-validation ✗ 1 violation — @Body() body: any in payments.controller.bad.ts:5
order-status   ✗ 1 violation — order.status = … in payment-webhook.service.bad.ts:18
```

---

### layered-arch — violation detail

`src/orders/orders.controller.bad.ts:10` — `@InjectRepository(Order)`
appears directly in the controller constructor. Per the ADR, controllers
must only inject Services.

**Fix:** remove `@InjectRepository` and `private repo: Repository<Order>`
from the controller, inject `OrdersService` instead, and move the `findOne`
query into the service.

---

### error-handling — violation detail

`src/orders/orders.service.bad.ts:8` — `throw new Error(\`Order \${id} not found\`)`.
Per the ADR, native `Error` is forbidden in service files.

**Fix:** `throw new NotFoundException(\`Order \${id} not found\`)`

---

### dto-validation — violation detail

`src/payments/payments.controller.bad.ts:5` — `@Body() body: any` bypasses
the global `ValidationPipe`. Per the ADR, every request body must be typed
with a DTO class decorated with `class-validator`.

**Fix:** create `CreatePaymentDto` with the relevant `class-validator`
decorators and replace `body: any` with `body: CreatePaymentDto`.

---

### order-status — violation detail

`src/payments/payment-webhook.service.bad.ts:18` — `order.status = OrderStatus.CANCELLED`
assigns the status directly, bypassing `OrderStateMachine`. Per the ADR,
all status mutations must go through `OrderStateMachine.transition()`.

**Fix:** replace the direct assignment with
`OrderStateMachine.transition(order, OrderStatus.CANCELLED)` (or equivalent
method signature), and remove the raw `orders.save()` call if the state
machine handles persistence internally.
