import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '@db/user.schema';
import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;
  let userModel: Model<User>;

  beforeEach(async () => {
    const mockJwtService = {
      sign: jest.fn().mockReturnValue('mockToken'),
    };
    const mockUserModel = {
      findOne: jest.fn(),
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: mockJwtService },
        { provide: getModelToken(User.name), useValue: mockUserModel },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    userModel = module.get<Model<User>>(getModelToken(User.name));
  });

  it('Контроллер определен', () => {
    expect(authService).toBeDefined();
  });

  describe('registration', () => {
    it('Ошибка, если пользователь уже существует', async () => {
      const userDto = { login: 'test', password: 'password123' };

      userModel.findOne = jest.fn().mockResolvedValue({ login: 'test' });

      await expect(authService.registration(userDto)).rejects.toThrowError(
        new BadRequestException(['Пользователь с таким логином уже существует']),
      );
    });

    it('Должен создать пользователя и вернуть его объект с токеном', async () => {
      const userDto = { login: 'test', password: 'password123' };
      const createdUser = { _id: '12345', login: 'test', password: 'hashedPassword' };
      const hashedPassword = await bcrypt.hash(userDto.password, 3);

      userModel.findOne = jest.fn().mockResolvedValue(null);
      userModel.create = jest.fn().mockResolvedValue({ ...createdUser, password: hashedPassword });

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await authService.registration(userDto);

      expect(result).toHaveProperty('_id');
      expect(result).toHaveProperty('login');
      expect(result).toHaveProperty('token');
      expect(jwtService.sign).toHaveBeenCalledWith({ sub: createdUser._id });
    });
  });

  describe('login', () => {
    it('Ошибка, если пользователь не найден', async () => {
      const userDto = { login: 'test', password: 'password123' };

      userModel.findOne = jest.fn().mockResolvedValue(null);

      await expect(authService.login(userDto)).rejects.toThrowError(
        new BadRequestException(['Пользователь с таким логином не найден']),
      );
    });

    it('Ошибка, если пароль неверный', async () => {
      const userDto = { login: 'test', password: 'password123' };
      const existingUser = { login: 'test', password: 'hashedPassword' };

      userModel.findOne = jest.fn().mockResolvedValue(existingUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(authService.login(userDto)).rejects.toThrowError(
        new BadRequestException(['Неверный пароль']),
      );
    });

    it('Должен вернуть объект пользователя с токеном', async () => {
      const userDto = { login: 'test', password: 'password123' };
      const existingUser = { _id: '12345', login: 'test', password: 'hashedPassword' };

      userModel.findOne = jest.fn().mockResolvedValue(existingUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await authService.login(userDto);

      expect(result).toHaveProperty('_id');
      expect(result).toHaveProperty('login');
      expect(result).toHaveProperty('token');
      expect(jwtService.sign).toHaveBeenCalledWith({ sub: existingUser._id });
    });
  });
});
