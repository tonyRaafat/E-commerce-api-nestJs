import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { CreateOrderDto } from './create-order.dto';

export enum OrderStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @ApiProperty({
    description: 'Order status',
    enum: OrderStatus,
    example: OrderStatus.COMPLETED,
  })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;
}
