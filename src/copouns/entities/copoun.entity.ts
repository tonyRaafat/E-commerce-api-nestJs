import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';

export type CouponDocument = Coupon & Document;

@Schema({ timestamps: true })
export class Coupon {
  @Prop({ type: SchemaTypes.ObjectId, auto: true })
  _id: Types.ObjectId;

  @Prop({ required: true, unique: true })
  code: string;

  @Prop({ required: true, min: 0, max: 100 })
  discountPercentage: number;

  @Prop({ required: true })
  expiryDate: Date;

  @Prop({ default: true })
  isActive: boolean;
}

export const CouponSchema = SchemaFactory.createForClass(Coupon);
