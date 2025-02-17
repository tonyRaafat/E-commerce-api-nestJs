import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CopounsService } from './copouns.service';
import { CreateCopounDto } from './dto/create-copoun.dto';
import { UpdateCopounDto } from './dto/update-copoun.dto';
import { JwtAuthGaurd } from '../auth/guards/jwtAuth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/guards/roles/roles.guard';

@ApiTags('Coupons')
@Controller('copouns')
@UseGuards(JwtAuthGaurd)
@ApiBearerAuth()
export class CopounsController {
  constructor(private readonly copounsService: CopounsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Create a new coupon' })
  @ApiResponse({
    status: 201,
    description: 'The coupon has been successfully created.',
    schema: {
      example: {
        success: true,
        data: {
          code: 'SUMMER2023',
          discountPercentage: 20,
          expiryDate: '2024-12-31T23:59:59Z',
          isActive: true,
          _id: '507f1f77bcf86cd799439011',
          createdAt: '2025-01-01T00:00:00Z',
          updatedAt: '2025-01-01T00:00:00Z',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  create(@Body() createCopounDto: CreateCopounDto) {
    return this.copounsService.create(createCopounDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all coupons' })
  @ApiResponse({
    status: 200,
    description: 'List of all coupons',
    schema: {
      example: {
        success: true,
        data: [
          {
            code: 'SUMMER2023',
            discountPercentage: 20,
            expiryDate: '2024-12-31T23:59:59Z',
            isActive: true,
            _id: '507f1f77bcf86cd799439011',
            createdAt: '2025-01-01T00:00:00Z',
            updatedAt: '2025-01-01T00:00:00Z',
          },
        ],
      },
    },
  })
  findAll() {
    return this.copounsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a coupon by ID' })
  @ApiResponse({
    status: 200,
    description: 'The found coupon',
    schema: {
      example: {
        success: true,
        data: {
          code: 'SUMMER2023',
          discountPercentage: 20,
          expiryDate: '2025-12-31T23:59:59Z',
          isActive: true,
          _id: '507f1f77bcf86cd799439011',
          createdAt: '2025-01-01T00:00:00Z',
          updatedAt: '2025-01-01T00:00:00Z',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Coupon not found' })
  findOne(@Param('id') id: string) {
    return this.copounsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Update a coupon' })
  @ApiResponse({
    status: 200,
    description: 'The updated coupon',
    schema: {
      example: {
        success: true,
        data: {
          code: 'SUMMER2023_UPDATED',
          discountPercentage: 25,
          expiryDate: '2024-12-31T23:59:59Z',
          isActive: true,
          _id: '507f1f77bcf86cd799439011',
          createdAt: '2025-01-01T00:00:00Z',
          updatedAt: '2025-01-01T00:00:00Z',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Coupon not found' })
  update(@Param('id') id: string, @Body() updateCopounDto: UpdateCopounDto) {
    return this.copounsService.update(id, updateCopounDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Delete a coupon' })
  @ApiResponse({
    status: 200,
    description: 'The coupon has been deleted',
    schema: {
      example: {
        success: true,
        message: 'Coupon deleted successfully',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Coupon not found' })
  remove(@Param('id') id: string) {
    return this.copounsService.remove(id);
  }
}
