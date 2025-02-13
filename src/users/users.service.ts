import { HashUtil } from 'src/utils/hash.util';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './users.repository';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    private userRepository: UserRepository,
    private configService: ConfigService,
  ) {}
  async signup(createUserDto: CreateUserDto) {
    const salt: number = Number(this.configService.getOrThrow('SALT'));
    const hashedPassword = await HashUtil.hashPassword(
      createUserDto.password,
      salt,
    );

    const hashedUser = {
      ...createUserDto,
      password: hashedPassword,
    };
    await this.userRepository.create(hashedUser);

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
