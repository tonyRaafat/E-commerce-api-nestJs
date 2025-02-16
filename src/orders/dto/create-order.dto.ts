import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class OrderItemDto {
  @ApiProperty({
    description: 'Product ID or unique identifier',
    example: '507f1f77bcf86cd799439011',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  product: string;

  @ApiProperty({
    description: 'Quantity of the product to order',
    example: 2,
    minimum: 1,
    type: Number,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({
    description: 'Array of order items',
    type: [OrderItemDto],
    example: [
      {
        product: '507f1f77bcf86cd799439011',
        quantity: 2,
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  @IsNotEmpty()
  items: OrderItemDto[];

  @ApiProperty({
    description: 'Coupon code to apply discount to the order',
    example: 'SUMMER2023',
    required: false,
    type: String,
  })
  @IsString()
  @IsOptional()
  couponCode?: string;

  @ApiProperty({
    description: 'Shipping address for the order',
    example: '123 Main St, City, Country',
    required: false,
    type: String,
  })
  @IsString()
  @IsOptional()
  shippingAddress?: string;

  @ApiProperty({
    description: 'Additional notes for the order',
    example: 'Please deliver after 6 PM',
    required: false,
    type: String,
  })
  @IsString()
  @IsOptional()
  notes?: string;
}
