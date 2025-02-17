/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from '../orders.service';
import { OrderRepository } from '../orders.repository';
import { ProductRepository } from '../../products/products.repository';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { orderStub } from './stubs/order.stub';
import { Types } from 'mongoose';
import { OrderStatus } from '../dto/update-order.dto';
import { CopounsService } from '../../copouns/copouns.service';

describe('OrdersService', () => {
  let service: OrdersService;
  let orderRepository: OrderRepository;
  let productRepository: ProductRepository;

  const mockOrderRepository = {
    create: jest.fn(),
    findOrdersHistory: jest.fn(),
    findOneOrdersHistory: jest.fn(),
    findOneAndUpdate: jest.fn(),
    deleteMany: jest.fn(),
  };

  const mockProductRepository = {
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
  };

  const mockCouponService = {
    validateCoupon: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        OrdersService,
        {
          provide: OrderRepository,
          useValue: mockOrderRepository,
        },
        {
          provide: ProductRepository,
          useValue: mockProductRepository,
        },
        {
          provide: CopounsService,
          useValue: mockCouponService,
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    orderRepository = module.get<OrderRepository>(OrderRepository);
    productRepository = module.get<ProductRepository>(ProductRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const mockUser = {
      _id: new Types.ObjectId(),
      role: 'user',
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedpassword',
    };
    const mockProduct = {
      _id: new Types.ObjectId(),
      name: 'Test Product',
      price: 100,
      stock: 10,
    };
    const createOrderDto = {
      items: [{ product: mockProduct._id.toString(), quantity: 2 }],
    };

    it('should create an order successfully', async () => {
      mockProductRepository.findOne.mockResolvedValue(mockProduct);
      mockOrderRepository.create.mockResolvedValue(orderStub());

      const result = await service.create(createOrderDto, mockUser);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Order created successfully');
      expect(productRepository.findOneAndUpdate).toHaveBeenCalled();
    });

    it('should throw NotFoundException when product not found', async () => {
      mockProductRepository.findOne.mockResolvedValue(null);

      await expect(service.create(createOrderDto, mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException when insufficient stock', async () => {
      mockProductRepository.findOne.mockResolvedValue({
        ...mockProduct,
        stock: 1,
      });

      await expect(service.create(createOrderDto, mockUser)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should return all orders for admin', async () => {
      const mockUser = {
        _id: new Types.ObjectId(),
        role: 'admin',
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'hashedpassword',
      };
      mockOrderRepository.findOrdersHistory.mockResolvedValue([orderStub()]);

      const result = await service.findAll(mockUser);

      expect(result.success).toBe(true);
      expect(result.data).toEqual([orderStub()]);
      expect(orderRepository.findOrdersHistory).toHaveBeenCalledWith({});
    });

    it('should return user-specific orders for non-admin', async () => {
      const mockUser = {
        _id: new Types.ObjectId(),
        role: 'user',
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedpassword',
      };
      mockOrderRepository.findOrdersHistory.mockResolvedValue([orderStub()]);

      const result = await service.findAll(mockUser);

      expect(result.success).toBe(true);
      expect(orderRepository.findOrdersHistory).toHaveBeenCalledWith({
        user: mockUser._id,
      });
    });
  });

  describe('findOne', () => {
    const orderId = new Types.ObjectId().toString();

    it('should return a specific order', async () => {
      mockOrderRepository.findOneOrdersHistory.mockResolvedValue(orderStub());
      const mockUser = {
        _id: new Types.ObjectId(),
        role: 'user',
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedpassword',
      };

      const result = await service.findOne(orderId, mockUser);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(orderStub());
    });

    it('should throw NotFoundException when order not found', async () => {
      mockOrderRepository.findOneOrdersHistory.mockResolvedValue(null);
      const mockUser = {
        _id: new Types.ObjectId(),
        role: 'user',
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedpassword',
      };

      await expect(service.findOne(orderId, mockUser)).rejects.toThrow(
        NotFoundException,
      );
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

    it('should update an order successfully', async () => {
      mockOrderRepository.findOneAndUpdate.mockResolvedValue(orderStub());

      const result = await service.update(mockUser, orderId, updateOrderDto);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Order updated successfully');
    });

    it('should throw NotFoundException when order not found', async () => {
      mockOrderRepository.findOneAndUpdate.mockResolvedValue(null);

      await expect(
        service.update(mockUser, orderId, updateOrderDto),
      ).rejects.toThrow(NotFoundException);
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

    it('should delete an order successfully', async () => {
      mockOrderRepository.deleteMany.mockResolvedValue(true);

      const result = await service.remove(mockUser, orderId);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Order deleted successfully');
    });

    it('should throw NotFoundException when order not found', async () => {
      mockOrderRepository.deleteMany.mockResolvedValue(false);

      await expect(service.remove(mockUser, orderId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
