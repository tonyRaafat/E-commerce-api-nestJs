import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryRepository } from './categories.repository';

@Injectable()
export class CategoriesService {
  constructor(private categoryRepository: CategoryRepository) {}

  async create(createCategoryDto: CreateCategoryDto) {
    return this.categoryRepository.create(createCategoryDto);
  }

  async findAll() {
    return this.categoryRepository.find({ isActive: true });
  }

  async findOne(id: string) {
    const category = await this.categoryRepository.findOne({
      _id: id,
      isActive: true,
    });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryRepository.findOneAndUpdate(
      { _id: id },
      updateCategoryDto,
    );
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async remove(id: string) {
    const category = await this.categoryRepository.findOneAndUpdate(
      { _id: id },
      { isActive: false },
    );
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }
}
