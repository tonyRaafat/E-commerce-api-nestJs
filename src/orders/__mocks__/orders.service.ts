import { orderArrayStub, orderStub } from '../tests/stubs/order.stub';

export const OrdersService = jest.fn().mockReturnValue({
  create: jest.fn().mockResolvedValue({
    success: true,
    message: 'Order created successfully',
    data: orderStub(),
  }),
  findAll: jest.fn().mockResolvedValue({
    success: true,
    data: orderArrayStub(),
  }),
  findOne: jest.fn().mockResolvedValue({
    success: true,
    data: orderStub(),
  }),
  update: jest.fn().mockResolvedValue({
    success: true,
    message: 'Order updated successfully',
    data: orderStub(),
  }),
  remove: jest.fn().mockResolvedValue({
    success: true,
    message: 'Order deleted successfully',
  }),
});
