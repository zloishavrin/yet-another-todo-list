import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { User } from '@db/user.schema';
import { BadRequestException } from '@nestjs/common';

// Мокаем зависимости
const mockJwtService = {
  sign: jest.fn().mockReturnValue('mockJwtToken'),
};

const mockUserModel = {
  findOne: jest.fn(),
  create: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let userModel: Model<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    userModel = module.get<Model<User>>(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('registration', () => {
    it('should create a new user and return a user object with token', async () => {
      // Arrange
      const mockUser: User = { login: 'login123', password: 'password123' };
      const hashedPassword = 'hashedPassword123';
      const mockCreatedUser = { _id: '12345', login: 'login123', password: hashedPassword };
      const mockResponse = {
        _id: '12345',
        login: 'login123',
        token: 'mockJwtToken',
      };

      // Мокаем методы
      bcrypt.hash = jest.fn().mockResolvedValue(hashedPassword);
      mockUserModel.findOne.mockResolvedValue(null); // Нет пользователя с таким логином
      mockUserModel.create.mockResolvedValue(mockCreatedUser);
      mockJwtService.sign.mockReturnValue('mockJwtToken');

      // Act
      const result = await service.registration(mockUser);

      // Assert
      expect(result).toEqual(mockResponse);
      expect(mockUserModel.create).toHaveBeenCalledWith({
        login: mockUser.login,
        password: hashedPassword,
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(mockUser.password, 10);
      expect(mockJwtService.sign).toHaveBeenCalledWith({ sub: mockCreatedUser._id });
    });

    it('should throw BadRequestException if user with the same login exists', async () => {
      // Arrange
      const mockUser: User = { login: 'login123', password: 'password123' };
      const existingUser = { login: 'login123', password: 'hashedPassword123' };

      mockUserModel.findOne.mockResolvedValue(existingUser); // Пользователь уже существует

      // Act & Assert
      await expect(service.registration(mockUser)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.registration(mockUser)).rejects.toThrow(
        'Пользователь с таким логином уже существует',
      );
    });
  });
});