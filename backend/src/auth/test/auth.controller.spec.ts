import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { BadRequestException } from '@nestjs/common';
import { LoginRequestDto, LoginResponseDto } from '../auth.types';
import { Types } from 'mongoose';

// Мокируем сервис
const mockAuthService = {
  login: jest.fn(),
  registration: jest.fn(),
};

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('registration', () => {
    it('should call AuthService.registration and return a user object', async () => {
      const mockUser = { login: 'login123', password: 'password123' };
      const mockResponse: LoginResponseDto = {
        _id: new Types.ObjectId('12345'),
        login: 'login123',
        token: 'mockJwtToken',
      };

      mockAuthService.registration.mockResolvedValue(mockResponse);

      const result = await controller.registration(mockUser);

      expect(result).toEqual(mockResponse);
      expect(authService.registration).toHaveBeenCalledWith(mockUser);
    });

    it('should throw BadRequestException if user already exists', async () => {
      const mockUser = { login: 'login123', password: 'password123' };
      mockAuthService.registration.mockRejectedValue(
        new BadRequestException(['Пользователь с таким логином уже существует']),
      );

      await expect(controller.registration(mockUser)).rejects.toThrow(BadRequestException);
    });
  });

  describe('login', () => {
    it('should call AuthService.login and return a user object with token', async () => {
      const mockLoginDto: LoginRequestDto = { login: 'login123', password: 'password123' };
      const mockResponse: LoginResponseDto = {
        _id: new Types.ObjectId('12345'),
        login: 'login123',
        token: 'mockJwtToken',
      };

      mockAuthService.login.mockResolvedValue(mockResponse);

      const result = await controller.login(mockLoginDto);

      expect(result).toEqual(mockResponse);
      expect(authService.login).toHaveBeenCalledWith(mockLoginDto);
    });

    it('should throw BadRequestException if user not found', async () => {
      const mockLoginDto: LoginRequestDto = { login: 'nonexistentUser', password: 'password123' };
      mockAuthService.login.mockRejectedValue(
        new BadRequestException(['Пользователь с таким логином не найден']),
      );

      await expect(controller.login(mockLoginDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if password is incorrect', async () => {
      const mockLoginDto: LoginRequestDto = { login: 'login123', password: 'wrongPassword' };
      mockAuthService.login.mockRejectedValue(
        new BadRequestException(['Неверный пароль']),
      );

      await expect(controller.login(mockLoginDto)).rejects.toThrow(BadRequestException);
    });
  });
});