import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { LoginRequestDto, LoginResponseDto } from '../auth.types';
import { Types } from 'mongoose';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    registration: jest.fn(),
    login: jest.fn(),
  };

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

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('Контроллер определен', () => {
    expect(authController).toBeDefined();
  });

  describe('registration', () => {
    it('Вызывает метод сервиса и возвращает результат', async () => {
      const dto: LoginRequestDto = {
        login: 'test',
        password: 'password',
      };
      const response: LoginResponseDto = {
        _id: new Types.ObjectId(),
        login: 'test',
        token: 'test-token',
      };

      mockAuthService.registration.mockResolvedValue(response);

      const result = await authController.registration(dto);

      expect(mockAuthService.registration).toHaveBeenCalledWith(dto);
      expect(result).toEqual(response);
    });
  });

  describe('login', () => {
    it('Вызывает метод сервиса и возвращает результат', async () => {
      const dto: LoginRequestDto = { login: 'test', password: 'password' };
      const response: LoginResponseDto = {
        _id: new Types.ObjectId(),
        login: 'test',
        token: 'test-token',
      };

      mockAuthService.login.mockResolvedValue(response);

      const result = await authController.login(dto);

      expect(mockAuthService.login).toHaveBeenCalledWith(dto);
      expect(result).toEqual(response);
    });
  });
});
