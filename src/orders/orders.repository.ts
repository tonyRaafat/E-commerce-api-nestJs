import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EntityRepository } from '../database/entity.repository';
import { Order, OrderDocument } from './entities/order.entity';

@Injectable()
export class OrderRepository extends EntityRepository<OrderDocument> {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
  ) {
    super(orderModel);
  }

  async findOrdersHistory(filter = {}) {
    return this.orderModel
      .find(filter)
      .populate('user', 'name email')
      .populate('items.product', 'name price')
      .exec();
  }

  async findOneOrdersHistory(filter = {}) {
    return this.orderModel
      .findOne(filter)
      .populate('user', 'name email')
      .populate('items.product', 'name price')
      .exec();
  }

  count(filter = {}): any {
    return this.orderModel.countDocuments(filter).exec();
  }
}
