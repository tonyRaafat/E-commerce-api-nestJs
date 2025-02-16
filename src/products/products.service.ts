import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  forwardRef,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductRepository } from './products.repository';
import { CategoryRepository } from 'src/categories/categories.repository';
import { Cron, CronExpression } from '@nestjs/schedule';
import { OrderRepository } from 'src/orders/orders.repository';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    private productRepository: ProductRepository,
    private categoryRepository: CategoryRepository,
    @Inject(forwardRef(() => OrderRepository))
    private orderRepository: OrderRepository,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const category = await this.categoryRepository.findOne({
      _id: createProductDto.category,
    });
    if (!category) {
      throw new BadRequestException('Category not found');
    }
    return this.productRepository.create(createProductDto);
  }

  async findAll() {
    return this.productRepository.find({ isActive: true }, { __v: 0 });
  }

  async findOne(id: string) {
    return this.productRepository.findOne({ _id: id, isActive: true });
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    return this.productRepository.findOneAndUpdate(
      { _id: id },
      updateProductDto,
    );
  }

  async remove(id: string) {
    return this.productRepository.findOneAndUpdate(
      { _id: id },
      { isActive: false },
    );
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async logProductOrderStatistics() {
    this.logger.debug('Running product order statistics...');

    const orders = await this.orderRepository.findOrdersHistory();
    const productOrderCount = new Map<string, number>();

    // Count orders for each product
    orders.forEach((order) => {
      order.items.forEach((item) => {
        const productId = item.product._id.toString();
        productOrderCount.set(
          productId,
          (productOrderCount.get(productId) || 0) + item.quantity,
        );
      });
    });

    // Get all products and sort them by order count
    const products = await this.productRepository.find({ isActive: true });
    const sortedProducts = products.sort((a, b) => {
      const aCount = productOrderCount.get(a._id.toString()) || 0;
      const bCount = productOrderCount.get(b._id.toString()) || 0;
      return bCount - aCount;
    });

    this.logger.debug('Products sorted by order count:');
    sortedProducts.forEach((product) => {
      const orderCount = productOrderCount.get(product._id.toString()) || 0;
      this.logger.debug(`${product.name}: ${orderCount} orders`);
    });
  }
}
