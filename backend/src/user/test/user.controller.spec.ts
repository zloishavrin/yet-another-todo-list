import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../user.controller';
import { UserService } from '../user.service';
import { UserResponseDto } from '../user.types';
import { Types } from 'mongoose';
import { AuthGuard } from 'src/auth/auth.guard';
import { JwtService } from '@nestjs/jwt';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  const mockUserService = {
    getCurrentUser: jest.fn(),
    getAllUsers: jest.fn(),
  };

  const mockJwtService = {
    verify: jest.fn().mockReturnValue({ userId: 'test-user-id' }),
  };

  const mockAuthGuard = { canActivate: jest.fn(() => true) };

  const validObjectId = '507f191e810c19729de860ea';
  const validObjectId2 = '507f191e810c19729de860eb';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('Контроллер определен', () => {
    expect(controller).toBeDefined();
  });

  describe('getCurrentUser', () => {
    it('Возвращает пользователя по ID', async () => {
      const userId = validObjectId;
      const user: UserResponseDto = {
        _id: new Types.ObjectId(userId),
        login: 'JohnDoe',
      };

      mockUserService.getCurrentUser.mockResolvedValue(user);

      const result = await controller.getCurrentUser(userId);

      expect(userService.getCurrentUser).toHaveBeenCalledWith(userId);
      expect(result).toEqual(user);
    });
  });

  describe('getMeUser', () => {
    it('Возвращает пользователя по токену', async () => {
      const userId = validObjectId;
      const user: UserResponseDto = {
        _id: new Types.ObjectId(userId),
        login: 'JohnDoe',
      };

      mockUserService.getCurrentUser.mockResolvedValue(user);

      const result = await controller.getMeUser(userId);

      expect(userService.getCurrentUser).toHaveBeenCalledWith(userId);
      expect(result).toEqual(user);
    });
  });

  describe('getAllUsers', () => {
    it('Возвращает всех пользователей', async () => {
      const users: UserResponseDto[] = [
        {
          _id: new Types.ObjectId(validObjectId),
          login: 'JohnDoe',
        },
        {
          _id: new Types.ObjectId(validObjectId2),
          login: 'JohnDoe',
        },
      ];

      mockUserService.getAllUsers.mockResolvedValue(users);

      const result = await controller.getAllUsers();

      expect(userService.getAllUsers).toHaveBeenCalled();
      expect(result).toEqual(users);
    });
  });
});
