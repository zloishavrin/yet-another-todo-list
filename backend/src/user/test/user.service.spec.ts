import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from '@db/user.schema';
import { BadRequestException } from '@nestjs/common';
import { UserResponseDto } from '../user.types';

describe('UserService', () => {
  let userService: UserService;
  let userModel: Model<User>;

  const validObjectId = '507f191e810c19729de860ea';
  const validObjectId2 = '507f191e810c19729de860eb';

  beforeEach(async () => {
    const mockUserModel = {
      findById: jest.fn(),
      find: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getModelToken(User.name), useValue: mockUserModel },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userModel = module.get<Model<User>>(getModelToken(User.name));
  });

  describe('getCurrentUser', () => {
    it('Ошибка, если пользователь не существует', async () => {
      const userId = 'nonexistentUserId';
      userModel.findById = jest.fn().mockResolvedValue(null);

      await expect(userService.getCurrentUser(userId)).rejects.toThrowError(
        new BadRequestException(['Пользователя с таким ID не существует']),
      );
    });

    it('Должен вернуть информацию о пользователе', async () => {
      const userId = validObjectId;
      const user: UserResponseDto = {
        _id: new Types.ObjectId(validObjectId),
        login: 'testUser',
      };
      userModel.findById = jest.fn().mockResolvedValue(user);

      const result: UserResponseDto = await userService.getCurrentUser(userId);

      expect(result).toEqual({
        _id: new Types.ObjectId(validObjectId),
        login: 'testUser',
      });
    });
  });

  describe('getAllUsers', () => {
    it('Должен вернуть всех пользователей', async () => {
      const users: UserResponseDto[] = [
        {
          _id: new Types.ObjectId(validObjectId),
          login: 'user1',
        },
        {
          _id: new Types.ObjectId(validObjectId2),
          login: 'user2',
        },
      ];
      userModel.find = jest.fn().mockResolvedValue(users);

      const result: UserResponseDto[] = await userService.getAllUsers();

      expect(result).toEqual(users);
    });

    it('Должен вернуть пустой массив, если пользователей нет', async () => {
      userModel.find = jest.fn().mockResolvedValue([]);

      const result: UserResponseDto[] = await userService.getAllUsers();

      expect(result).toEqual([]);
    });
  });
});
