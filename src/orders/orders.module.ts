import { Module, forwardRef } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './entities/order.entity';
import { OrderRepository } from './orders.repository';
import { ProductsModule } from '../products/products.module';
import { CopounsModule } from '../copouns/copouns.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    forwardRef(() => ProductsModule),
    CopounsModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrderRepository],
  exports: [OrderRepository],
})
export class OrdersModule {}
