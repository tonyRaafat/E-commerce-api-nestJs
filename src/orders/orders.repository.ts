import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryOptions } from 'mongoose';
import { EntityRepository } from 'src/database/entity.repository';
import { Order, OrderDocument } from './entities/order.entity';

@Injectable()
export class OrderRepository extends EntityRepository<OrderDocument> {
  constructor(
    @InjectModel(Order.name) readonly orderModel: Model<OrderDocument>,
  ) {
    super(orderModel);
  }

  findOrdersHistory(query: QueryOptions<OrderDocument>) {
    return this.orderModel
      .find(query)
      .populate('user', 'name email')
      .populate('items.product', 'name price');
  }

  findOneOrdersHistory(query: QueryOptions<OrderDocument>) {
    return this.orderModel
      .findOne(query)
      .populate('user', 'name email')
      .populate('items.product', 'name price');
  }
}
