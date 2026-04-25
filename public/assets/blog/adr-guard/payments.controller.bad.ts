// ✗ VIOLATION dto-validation

import { Controller, Post, Body } from '@nestjs/common'

@Controller('payments')
export class PaymentsController {
  async create(@Body() body: any) {
    return this.paymentsService.create(body)
  }
}
