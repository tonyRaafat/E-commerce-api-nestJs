import { multiUsers, normalUserStub } from '../tests/stubs/user.stub';

export const UsersService = jest.fn().mockReturnValue({
  findOne: jest.fn().mockResolvedValue(normalUserStub()),
  create: jest.fn().mockResolvedValue(normalUserStub()),
  findAll: jest.fn().mockResolvedValue(multiUsers()),
  update: jest.fn().mockResolvedValue(normalUserStub()),
  remove: jest.fn().mockResolvedValue(true),
});
