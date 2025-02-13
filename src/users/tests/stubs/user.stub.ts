import { Types } from 'mongoose';
import { User } from 'src/users/entities/user.entity';

export const normalUserStub = (): User => {
  return {
    _id: new Types.ObjectId(),
    name: 'jhon doe',
    email: 'jhondoe@example.com',
    password: 'P@ssw0rd',
    role: 'user',
  };
};

export const multiUsers = (): User[] => {
  return [
    {
      _id: new Types.ObjectId(),
      name: 'jhon doe',
      email: 'jhondoe@example.com',
      password: 'P@ssw0rd',
      role: 'user',
    },
    {
      _id: new Types.ObjectId(),
      name: 'jane doe 2',
      email: 'janedoe@example.com',
      password: 'P@ssw0rd',
      role: 'user',
    },
  ];
};
