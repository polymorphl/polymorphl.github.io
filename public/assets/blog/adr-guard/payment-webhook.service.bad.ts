// ✗ VIOLATION order-status

import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Order, OrderStatus } from './order.entity'

@Injectable()
export class PaymentWebhookService {

  constructor(
    @InjectRepository(Order)
    private readonly orders: Repository<Order>,
  ) {}

  async handlePaymentFailure(orderId: string): Promise<void> {
    const order = await this.orders.findOneOrFail({ where: { id: orderId } })
    order.status = OrderStatus.CANCELLED
    await this.orders.save(order)
  }
}
