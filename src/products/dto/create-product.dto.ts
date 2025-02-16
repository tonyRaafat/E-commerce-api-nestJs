import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'iPhone 12', type: String })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Latest iPhone model', type: String })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 999.99, type: Number })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 100, type: Number })
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  @IsString()
  @IsNotEmpty()
  category: string;
}
