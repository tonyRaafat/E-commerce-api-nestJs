/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { HashUtil } from 'src/utils/hash.util';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './users.repository';
import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { OrderRepository } from '../orders/orders.repository';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private userRepository: UserRepository,
    private orderRepository: OrderRepository,
    private configService: ConfigService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async logUserOrderStatistics() {
    try {
      const users = await this.userRepository.find({});
      const userStats: { email: string; name: string; orderCount: number }[] =
        [];

      for (const user of users) {
        const orderCount = await this.orderRepository.count({ user: user._id });
        userStats.push({
          email: user.email,
          name: user.name,
          orderCount,
        });
      }

      // Sort by order count in descending order
      userStats.sort((a, b) => b.orderCount - a.orderCount);

      this.logger.log('User Order Statistics:');
      userStats.forEach((stat) => {
        this.logger.log(
          `User: ${stat.name} (${stat.email}) - Orders: ${stat.orderCount}`,
        );
      });
    } catch (error) {
      this.logger.error('Failed to log user order statistics', error);
    }
  }

  async signup(createUserDto: CreateUserDto) {
    try {
      // Check if user already exists
      const existingUser = await this.userRepository.findOne({
        email: createUserDto.email,
      });
      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }

      const salt: number = Number(this.configService.getOrThrow('SALT'));
      const hashedPassword = await HashUtil.hashPassword(
        createUserDto.password,
        salt,
      );

      const hashedUser = {
        ...createUserDto,
        password: hashedPassword,
      };
      const newUser = await this.userRepository.create(hashedUser);

      return {
        success: true,
        message: 'User created successfully',
        data: newUser,
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException('Failed to create user');
    }
  }

  async findAll() {
    try {
      const users = await this.userRepository.find({}, { __v: 0, password: 0 });
      return {
        success: true,
        data: users,
      };
    } catch (error) {
      throw new BadRequestException('Failed to fetch users');
    }
  }

  async findOne(id: string) {
    try {
      const user = await this.userRepository.findOne(
        { _id: id },
        { __v: 0, password: 0 },
      );
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return {
        success: true,
        data: user,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to fetch user');
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      // Check if user exists
      const existingUser = await this.userRepository.findOne({ _id: id });
      if (!existingUser) {
        throw new NotFoundException('User not found');
      }

      // If updating password, hash it
      if (updateUserDto.password) {
        const salt: number = Number(this.configService.getOrThrow('SALT'));
        updateUserDto.password = await HashUtil.hashPassword(
          updateUserDto.password,
          salt,
        );
      }

      const updatedUser = await this.userRepository.findOneAndUpdate(
        { _id: id },
        updateUserDto,
        { new: true, projection: { password: 0, __v: 0 } },
      );

      return {
        success: true,
        message: 'User updated successfully',
        data: updatedUser,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to update user');
    }
  }

  async remove(id: string) {
    try {
      const result = await this.userRepository.deleteMany({ _id: id });
      if (result === false) {
        throw new NotFoundException('User not found');
      }
      return {
        success: true,
        message: 'User deleted successfully',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to delete user');
    }
  }
}
