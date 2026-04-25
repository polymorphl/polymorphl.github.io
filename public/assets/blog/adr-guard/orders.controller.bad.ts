// ✗ VIOLATION layered-arch

import { Controller, Get, Param } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Order } from './order.entity'

@Controller('orders')
export class OrdersController {

  constructor(
    @InjectRepository(Order)
    private repo: Repository<Order>
  ) {}

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.repo.findOne({ where: { id } })
  }
}
