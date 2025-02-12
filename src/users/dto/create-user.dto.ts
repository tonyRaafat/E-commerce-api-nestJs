/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export enum Role {
  admin = 'Admin',
  user = 'User',
}

export class CreateUserDto {
  @ApiProperty({ example: 'jhon doe', type: String })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'jhondoe@example.com', type: String })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({ enum: Role, default: Role.user })
  @IsEnum(Role, { message: 'role must be either User or Admin' })
  role: Role;
}
