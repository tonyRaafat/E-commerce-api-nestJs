import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateCopounDto } from './dto/create-copoun.dto';
import { UpdateCopounDto } from './dto/update-copoun.dto';
import { CouponRepository } from './copouns.repository';

@Injectable()
export class CopounsService {
  constructor(private readonly couponRepository: CouponRepository) {}

  async create(createCopounDto: CreateCopounDto) {
    const existingCoupon = await this.couponRepository.findOne({
      code: createCopounDto.code,
    });
    if (existingCoupon) {
      throw new BadRequestException('Coupon code already exists');
    }
    const coupon = await this.couponRepository.create(createCopounDto);
    return { success: true, data: coupon };
  }

  async findAll() {
    const coupons = await this.couponRepository.find({});
    return { success: true, data: coupons };
  }

  async findOne(id: string) {
    const coupon = await this.couponRepository.findById(id);
    if (!coupon) throw new NotFoundException('Coupon not found');
    return { success: true, data: coupon };
  }

  async validateCoupon(code: string) {
    const coupon = await this.couponRepository.findOne({
      code,
      isActive: true,
      expiryDate: { $gt: new Date() },
    });
    if (!coupon) throw new NotFoundException('Invalid or expired coupon');
    return coupon;
  }

  async update(id: string, updateCopounDto: UpdateCopounDto) {
    const coupon = await this.couponRepository.findOneAndUpdate(
      { _id: id },
      updateCopounDto,
    );
    if (!coupon) throw new NotFoundException('Coupon not found');
    return { success: true, data: coupon };
  }

  async remove(id: string) {
    const coupon = await this.couponRepository.deleteMany({ _id: id });
    if (!coupon) throw new NotFoundException('Coupon not found');
    return { success: true, message: 'Coupon deleted successfully' };
  }
}
