import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CopounsService } from './copouns.service';
import { CopounsController } from './copouns.controller';
import { Coupon, CouponSchema } from './entities/copoun.entity';
import { CouponRepository } from './copouns.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Coupon.name, schema: CouponSchema }]),
  ],
  controllers: [CopounsController],
  providers: [CopounsService, CouponRepository],
  exports: [CopounsService],
})
export class CopounsModule {}
