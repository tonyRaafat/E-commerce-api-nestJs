import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderRepository } from './orders.repository';
import { ProductRepository } from '../products/products.repository';
import { User } from '../users/entities/user.entity';
import { CopounsService } from '../copouns/copouns.service';

@Injectable()
export class OrdersService {
  constructor(
    private orderRepository: OrderRepository,
    private productRepository: ProductRepository,
    private couponService: CopounsService,
  ) {}

  async create(createOrderDto: CreateOrderDto, user: User) {
    interface OrderItem {
      product: any;
      quantity: number;
      price: number;
    }
    const orderItems: OrderItem[] = [];
    let totalAmount = 0;

    for (const item of createOrderDto.items) {
      const product = await this.productRepository.findOne({
        _id: item.product,
      });

      if (!product) {
        throw new NotFoundException(`Product ${item.product} not found`);
      }

      if (product.stock < item.quantity) {
        throw new BadRequestException(
          `Not enough stock for product ${product.name}. Available: ${product.stock}`,
        );
      }

      // Update product stock
      await this.productRepository.findOneAndUpdate(
        { _id: product._id },
        { stock: product.stock - item.quantity },
      );

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
      });

      totalAmount += product.price * item.quantity;
    }

    let finalAmount = totalAmount;
    if (createOrderDto.couponCode) {
      const coupon = await this.couponService.validateCoupon(
        createOrderDto.couponCode,
      );
      finalAmount = totalAmount * (1 - coupon.discountPercentage / 100);
    }

    const order = await this.orderRepository.create({
      user: user._id,
      items: orderItems,
      totalAmount: finalAmount,
      couponCode: createOrderDto.couponCode,
      status: 'pending',
    });

    return {
      success: true,
      message: 'Order created successfully',
      data: order,
    };
  }

  async findAll(user: User) {
    const query = user.role === 'admin' ? {} : { user: user._id };
    const orders = await this.orderRepository.findOrdersHistory(query);
    return {
      success: true,
      data: orders,
    };
  }

  async findOne(id: string, user: User) {
    const query =
      user.role === 'admin' ? { _id: id } : { _id: id, user: user._id };
    const order = await this.orderRepository.findOneOrdersHistory(query);
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return {
      success: true,
      data: order,
    };
  }

  async update(user: User, id: string, updateOrderDto: UpdateOrderDto) {
    try {
      const order = await this.orderRepository.findOneAndUpdate(
        { _id: id, user: user._id },
        updateOrderDto,
      );

      if (!order) {
        throw new NotFoundException('Order not found');
      }

      return {
        success: true,
        message: 'Order updated successfully',
        data: order,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to update order');
    }
  }

  async remove(user: User, id: string) {
    try {
      const order = await this.orderRepository.deleteMany({
        _id: id,
        user: user._id,
      });

      if (!order) {
        throw new NotFoundException('Order not found');
      }

      return {
        success: true,
        message: 'Order deleted successfully',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to delete order');
    }
  }
}
