/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
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
import { CategoryRepository } from '../categories/categories.repository';
import { Cron, CronExpression } from '@nestjs/schedule';
import { OrderRepository } from '../orders/orders.repository';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
type CacheType = Cache;
import { CACHE_KEYS } from './products.constants';
import { ClientProxy } from '@nestjs/microservices';
import { timeout } from 'rxjs';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);
  constructor(
    private productRepository: ProductRepository,
    private categoryRepository: CategoryRepository,
    @Inject(forwardRef(() => OrderRepository))
    private orderRepository: OrderRepository,
    @Inject(CACHE_MANAGER) private cacheManager: CacheType,
    @Inject('ORDERS_SERVICE') private rabbitMq: ClientProxy,
  ) {}

  getHello() {
    return this.rabbitMq.send({ cmd: 'hello' }, {}).pipe(timeout(5000));
  }

  async create(createProductDto: CreateProductDto) {
    const category = await this.categoryRepository.findOne({
      _id: createProductDto.category,
    });
    if (!category) {
      throw new BadRequestException('Category not found');
    }
    const product = await this.productRepository.create(createProductDto);
    this.rabbitMq.send({ emit: 'create_doc' }, product);
    await this.cacheManager.del(CACHE_KEYS.ALL_PRODUCTS);
    return product;
  }

  findAll() {
    const products = this.rabbitMq.send({ cmd: 'find_all_docs' }, {});
    return products;
  }

  async findOne(id: string) {
    try {
      const cacheKey = CACHE_KEYS.PRODUCT_BY_ID(id);
      const cachedProduct = await this.cacheManager.get(cacheKey);

      if (cachedProduct) {
        this.logger.debug(`Cache HIT - findOne product ${id}`);
        return JSON.parse(cachedProduct as string);
      }

      this.logger.debug(`Cache MISS - findOne product ${id}`);
      const product = await this.productRepository.findOne({
        _id: id,
        isActive: true,
      });

      if (product) {
        const serializedProduct = JSON.stringify(product.toJSON());
        await this.cacheManager.set(cacheKey, serializedProduct, 120);
      }

      return product;
    } catch (error) {
      this.logger.error(`Cache error: ${error.message}`);
      return this.productRepository.findOne({ _id: id, isActive: true });
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.findOneAndUpdate(
      { _id: id },
      updateProductDto,
    );
    // Invalidate caches
    await Promise.all([
      this.cacheManager.del(CACHE_KEYS.ALL_PRODUCTS),
      this.cacheManager.del(CACHE_KEYS.PRODUCT_BY_ID(id)),
    ]);
    return product;
  }

  async remove(id: string) {
    const product = await this.productRepository.findOneAndUpdate(
      { _id: id },
      { isActive: false },
    );
    await Promise.all([
      this.cacheManager.del(CACHE_KEYS.ALL_PRODUCTS),
      this.cacheManager.del(CACHE_KEYS.PRODUCT_BY_ID(id)),
    ]);
    return product;
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async logProductOrderStatistics() {
    this.logger.debug('Running product order statistics...');

    const orders = await this.orderRepository.findOrdersHistory();
    const productOrderCount = new Map<string, number>();

    orders.forEach((order) => {
      order.items.forEach((item) => {
        const productId = item.product._id.toString();
        productOrderCount.set(
          productId,
          (productOrderCount.get(productId) || 0) + item.quantity,
        );
      });
    });

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
