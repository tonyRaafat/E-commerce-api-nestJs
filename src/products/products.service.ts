import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductRepository } from './products.repository';
import { CategoryRepository } from 'src/categories/categories.repository';

@Injectable()
export class ProductsService {
  constructor(
    private productRepository: ProductRepository,
    private categoryRepository: CategoryRepository,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const category = await this.categoryRepository.findOne({
      _id: createProductDto.category,
    });
    if (!category) {
      throw new BadRequestException('Category not found');
    }
    return this.productRepository.create(createProductDto);
  }

  async findAll() {
    return this.productRepository.find({ isActive: true }, { __v: 0 });
  }

  async findOne(id: string) {
    return this.productRepository.findOne({ _id: id, isActive: true });
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    return this.productRepository.findOneAndUpdate(
      { _id: id },
      updateProductDto,
    );
  }

  async remove(id: string) {
    return this.productRepository.findOneAndUpdate(
      { _id: id },
      { isActive: false },
    );
  }
}
