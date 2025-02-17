/* eslint-disable @typescript-eslint/unbound-method */
import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { OrderRepository } from '../orders.repository';
import { Order } from '../entities/order.entity';
import { OrderModel } from './support/orderModel';
import { orderStub, orderArrayStub } from './stubs/order.stub';
import { Types } from 'mongoose';

describe('OrderRepository', () => {
  let orderRepository: OrderRepository;
  let orderModel: OrderModel;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        OrderRepository,
        {
          provide: getModelToken(Order.name),
          useClass: OrderModel,
        },
      ],
    }).compile();

    orderRepository = moduleRef.get<OrderRepository>(OrderRepository);
    orderModel = moduleRef.get<OrderModel>(getModelToken(Order.name));
    jest.clearAllMocks();
  });

  describe('findOne', () => {
    describe('when findOne is called', () => {
      let order: Order | null;
      beforeEach(async () => {
        order = await orderRepository.findOne({ _id: orderStub()._id }).exec();
      });

      test('should call findOne with correct filter', () => {
        expect(orderModel.findOne).toHaveBeenCalledWith(
          { _id: orderStub()._id },
          { __v: 0, undefined },
        );
      });

      test('should return the order', () => {
        expect(order).toEqual(orderStub());
      });
    });
  });

  describe('findOrdersHistory', () => {
    describe('when findOrdersHistory is called', () => {
      let orders: Order[];
      const filter = { user: new Types.ObjectId() };

      beforeEach(async () => {
        orders = await orderRepository.findOrdersHistory(filter);
      });

      test('should call find with correct filter', () => {
        expect(orderModel.find).toHaveBeenCalledWith(filter);
      });

      test('should return the orders', () => {
        expect(orders).toEqual([orderStub()]);
      });
    });
  });

  describe('findOneOrdersHistory', () => {
    describe('when findOneOrdersHistory is called', () => {
      let order: Order | null;
      const filter = { _id: orderStub()._id };

      beforeEach(async () => {
        order = await orderRepository.findOneOrdersHistory(filter);
      });

      test('should call findOne with correct filter', () => {
        expect(orderModel.findOne).toHaveBeenCalledWith(filter);
      });

      test('should return the order', () => {
        expect(order).toEqual(orderStub());
      });
    });
  });

  describe('count', () => {
    describe('when count is called', () => {
      let count: number;
      const filter = { status: 'PENDING' };

      beforeEach(async () => {
        count = await orderRepository.count(filter);
      });

      test('should call countDocuments with correct filter', () => {
        expect(orderModel.countDocuments).toHaveBeenCalledWith(filter);
      });

      test('should return the count', () => {
        expect(count).toEqual(1);
      });
    });
  });

  describe('create', () => {
    describe('when create is called with a single order', () => {
      let order: Order;
      const createOrderDto = orderStub();

      beforeEach(async () => {
        order = (await orderRepository.create(createOrderDto)) as Order;
      });

      test('should return the created order', () => {
        expect(order).toEqual(orderStub());
      });
    });

    describe('when create is called with multiple orders', () => {
      let orders: Order[];
      const createOrderDtos = orderArrayStub();

      beforeEach(async () => {
        orders = (await orderRepository.create(createOrderDtos)) as Order[];
      });

      test('should return the created orders', () => {
        expect(orders).toEqual(createOrderDtos);
      });
    });
  });

  describe('findOneAndUpdate', () => {
    describe('when findOneAndUpdate is called', () => {
      let updatedOrder: Order | null;
      const filter = { _id: orderStub()._id };
      const update = { status: 'COMPLETED' };

      beforeEach(async () => {
        updatedOrder = await orderRepository.findOneAndUpdate(filter, update);
      });

      test('should return the updated order', () => {
        expect(updatedOrder).toEqual(orderStub());
      });
    });
  });

  describe('deleteMany', () => {
    describe('when deleteMany is called', () => {
      let result: boolean;
      const filter = { user: orderStub().user };

      beforeEach(async () => {
        result = await orderRepository.deleteMany(filter);
        console.log(result);
      });

      test('should return true when documents are deleted', () => {
        expect(result).toBeTruthy();
      });
    });
  });
});
