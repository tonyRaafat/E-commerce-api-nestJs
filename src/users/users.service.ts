import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './users.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(private userRepository: UserRepository) {}
  async create(createUserDto: CreateUserDto) {
    await this.userRepository.create(createUserDto);

    return { msg: 'user created' };
  }

  async findAll() {
    console.log();
    return this.userRepository.find({}, { __v: 0 });
  }

  async findOne(id: string) {
    return this.userRepository.findOne({ _id: id });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.userRepository.findOneAndUpdate({ _id: id }, updateUserDto);
  }

  async remove(id: string) {
    console.log();

    return this.userRepository.deleteMany({ _id: id });
  }
}
