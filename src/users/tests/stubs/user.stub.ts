import { User } from 'src/users/entities/user.entity';

export const normalUserStub = (): User => {
  return {
    name: 'jhon doe',
    email: 'jhondoe@example.com',
    role: 'user',
  };
};

export const multiUsers = (): User[] => {
  return [
    {
      name: 'jhon doe',
      email: 'jhondoe@example.com',
      role: 'user',
    },
    {
      name: 'jane doe 2',
      email: 'janedoe@example.com',
      role: 'user',
    },
  ];
};
