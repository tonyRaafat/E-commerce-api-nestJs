/* eslint-disable @typescript-eslint/unbound-method */
import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { OrderRepository } from '../orders.repository';
import { Order } from '../entities/order.entity';
import { OrderModel } from './support/orderModel';
import { orderStub } from './stubs/order.stub';

describe('OrderRepository', () => {
  let orderRepository: OrderRepository;
  let orderModel: OrderModel;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        OrderRepository,
        {
          provide: getModelToken(Order.name),
          useFactory: () => new OrderModel(),
        },
      ],
    }).compile();

    orderRepository = moduleRef.get<OrderRepository>(OrderRepository);
    orderModel = moduleRef.get<OrderModel>(getModelToken(Order.name));
    jest.clearAllMocks();
  });

  test('should be defined', () => {
    expect(orderRepository).toBeDefined();
    expect(orderModel).toBeDefined();
  });

  describe('findOne', () => {
    describe('when findOne is called', () => {
      let order: Order | null;
      beforeEach(async () => {
        order = await orderRepository.findOne({ _id: '1' });
      });

      test('findOne should be called', () => {
        expect(orderModel.findOne).toHaveBeenCalledWith({ _id: '1' });
      });

      test('should return the order', () => {
        expect(order).toEqual(orderStub());
      });
    });
  });
});
