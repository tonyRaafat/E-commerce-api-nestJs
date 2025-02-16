/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from '../orders.controller';
import { OrdersService } from '../orders.service';
import { orderStub } from './stubs/order.stub';
import { Types } from 'mongoose';
import { OrderStatus } from '../dto/update-order.dto';

jest.mock('../orders.service');

describe('OrdersController', () => {
  let controller: OrdersController;
  let service: OrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [OrdersController],
      providers: [OrdersService],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
    service = module.get<OrdersService>(OrdersService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createOrderDto = {
      items: [
        {
          product: new Types.ObjectId().toString(),
          quantity: 2,
        },
      ],
    };
    const mockUser = {
      _id: new Types.ObjectId(),
      role: 'user',
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedpassword',
    };

    it('should create an order', async () => {
      const result = await controller.create(createOrderDto, mockUser);

      expect(service.create).toHaveBeenCalledWith(createOrderDto, mockUser);
      expect(result.data).toEqual(orderStub());
    });
  });

  describe('findAll', () => {
    const mockUser = {
      _id: new Types.ObjectId(),
      role: 'user',
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedpassword',
    };

    it('should return all orders', async () => {
      const result = await controller.findAll(mockUser);

      expect(service.findAll).toHaveBeenCalledWith(mockUser);
      expect(result.data).toEqual([orderStub()]);
    });
  });

  describe('findOne', () => {
    const orderId = new Types.ObjectId().toString();
    const mockUser = {
      _id: new Types.ObjectId(),
      role: 'user',
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedpassword',
    };

    it('should return a specific order', async () => {
      const result = await controller.findOne(orderId, mockUser);

      expect(service.findOne).toHaveBeenCalledWith(orderId, mockUser);
      expect(result.data).toEqual(orderStub());
    });
  });

  describe('update', () => {
    const orderId = new Types.ObjectId().toString();
    const mockUser = {
      _id: new Types.ObjectId(),
      role: 'user',
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedpassword',
    };
    const updateOrderDto = { status: OrderStatus.COMPLETED };

    it('should update an order', async () => {
      const result = await controller.update(mockUser, orderId, updateOrderDto);

      expect(service.update).toHaveBeenCalledWith(
        mockUser,
        orderId,
        updateOrderDto,
      );
      expect(result.data).toEqual(orderStub());
    });
  });

  describe('remove', () => {
    const orderId = new Types.ObjectId().toString();
    const mockUser = {
      _id: new Types.ObjectId(),
      role: 'user',
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedpassword',
    };

    it('should delete an order', async () => {
      const result = await controller.remove(mockUser, orderId);

      expect(service.remove).toHaveBeenCalledWith(mockUser, orderId);
      expect(result.message).toBe('Order deleted successfully');
    });
  });
});
