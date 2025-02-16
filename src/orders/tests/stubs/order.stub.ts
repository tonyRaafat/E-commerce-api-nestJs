import { Types } from 'mongoose';
import { Order } from '../../entities/order.entity';
import { OrderStatus } from '../../dto/update-order.dto';

export const orderStub = (): Order => {
  return {
    _id: new Types.ObjectId('507f1f77bcf86cd799439011'),
    user: new Types.ObjectId('507f1f77bcf86cd799439012'),
    items: [
      {
        product: new Types.ObjectId('507f1f77bcf86cd799439013'),
        quantity: 2,
        price: 100,
      },
    ],
    totalAmount: 200,
    status: OrderStatus.PENDING,
  };
};

export const orderArrayStub = (): Order[] => {
  return [orderStub()];
};
