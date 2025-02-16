import { IsString, IsNumber, IsDate, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCopounDto {
  @ApiProperty({
    description: 'Unique coupon code',
    example: 'SUMMER2023',
    type: String,
  })
  @IsString()
  code: string;

  @ApiProperty({
    description: 'Discount percentage (0-100)',
    example: 20,
    minimum: 0,
    maximum: 100,
    type: Number,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  discountPercentage: number;

  @ApiProperty({
    description: 'Coupon expiry date',
    example: '2024-12-31T23:59:59Z',
    type: Date,
  })
  @Type(() => Date)
  @IsDate()
  expiryDate: Date;
}
