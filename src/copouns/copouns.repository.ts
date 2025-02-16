import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Coupon, CouponDocument } from './entities/copoun.entity';
import { EntityRepository } from 'src/database/entity.repository';

@Injectable()
export class CouponRepository extends EntityRepository<CouponDocument> {
  constructor(
    @InjectModel(Coupon.name)
    private couponModel: Model<CouponDocument>,
  ) {
    super(couponModel);
  }
}
