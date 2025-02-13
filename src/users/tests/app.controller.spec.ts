// /* eslint-disable @typescript-eslint/unbound-method */
// import { Test } from '@nestjs/testing';
// import { UsersController } from '../users.controller';
// import { UsersService } from '../users.service';
// import { User } from '../entities/user.entity';
// import { multiUsers, normalUserStub } from './stubs/user.stub';
// import { Role } from '../dto/create-user.dto';

// jest.mock('../users.service');

// describe('UserController', () => {
//   let usersController: UsersController;
//   let usersService: UsersService;

//   beforeEach(async () => {
//     const moduleRef = await Test.createTestingModule({
//       imports: [],
//       controllers: [UsersController],
//       providers: [UsersService],
//     }).compile();

//     usersController = moduleRef.get<UsersController>(UsersController);
//     usersService = moduleRef.get<UsersService>(UsersService);
//     jest.clearAllMocks();
//   });

//   describe('get user', () => {
//     describe('when findOne is called', () => {
//       let user: User | null;
//       beforeEach(async () => {
//         const id = normalUserStub()._id;
//         user = await usersController.findOne(id.toString());
//       });

//       test('expect userService.findOne to be called', () => {
//         const id = normalUserStub()._id;

//         expect(usersService.findOne).toHaveBeenCalledWith(id.toString());
//       });

//       test('user is returned', () => {
//         expect(user).toEqual(normalUserStub());
//       });
//     });

//     describe('when findAll is called', () => {
//       let users: User[] | null;
//       beforeEach(async () => {
//         users = await usersController.findAll();
//       });

//       test('expect userService.findAll to be called', () => {
//         expect(usersService.findAll).toHaveBeenCalledWith();
//       });

//       test('expect to return users array', () => {
//         expect(users).toEqual(multiUsers());
//       });
//     });
//   });

//   describe('create user', () => {
//     describe('when create is called', () => {
//       let newUser;
//       const createUserDto = {
//         name: 'jhon doe',
//         email: 'jhondoe@example.com',
//         role: Role.user,
//       };
//       beforeEach(async () => {
//         newUser = await usersController.create(createUserDto);
//       });

//       test('expect useService.create to be called', () => {
//         expect(usersService.create).toHaveBeenCalledWith(createUserDto);
//       });

//       test('expect to return user', () => {
//         expect(newUser).toEqual(normalUserStub());
//       });
//     });
//   });
// });
