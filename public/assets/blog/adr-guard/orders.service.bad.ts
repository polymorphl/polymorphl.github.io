// ✗ VIOLATION error-handling

import { Injectable } from '@nestjs/common'

@Injectable()
export class OrdersService {

  async findOne(id: string) {
    const order = await this.repo.findOne({ where: { id } })
    if (!order) throw new Error(`Order ${id} not found`)
    return order
  }
}
