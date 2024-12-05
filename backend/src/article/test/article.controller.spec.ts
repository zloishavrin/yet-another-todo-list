import { Test, TestingModule } from '@nestjs/testing';
import { ArticleController } from '../article.controller';
import { ArticleService } from '../article.service';
import {
  ArticleRequestDto,
  ArticleEditRequestDto,
  ArticleResponseDto,
} from '../article.types';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserId } from 'src/auth/auth.decorator';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Types } from 'mongoose';

jest.mock('../article.service');

describe('ArticleController', () => {
  let controller: ArticleController;
  let service: ArticleService;

  const validObjectId = '507f191e810c19729de860ea';
  const validObjectId2 = '507f191e810c19729de860eb';

  const mockJwtService = {
    verify: jest.fn().mockReturnValue({ userId: 'test-user-id' }),
  };
  const mockAuthGuard = { canActivate: jest.fn(() => true) };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArticleController],
      providers: [
        {
          provide: ArticleService,
          useValue: {
            newArticle: jest.fn() as jest.MockedFunction<
              (
                article: ArticleRequestDto,
                userId: string,
              ) => Promise<ArticleResponseDto>
            >,
            completeArticle: jest.fn() as jest.MockedFunction<
              (id: string, userId: string) => Promise<ArticleResponseDto>
            >,
            editArticle: jest.fn() as jest.MockedFunction<
              (
                userId: string,
                id: string,
                body: ArticleEditRequestDto,
              ) => Promise<ArticleResponseDto>
            >,
            deleteArticle: jest.fn() as jest.MockedFunction<
              (userId: string, id: string) => Promise<void>
            >,
            getAllArticles: jest.fn() as jest.MockedFunction<
              (userId: string) => Promise<ArticleResponseDto[]>
            >,
            getArticle: jest.fn() as jest.MockedFunction<
              (userId: string, id: string) => Promise<ArticleResponseDto>
            >,
          },
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

    controller = module.get<ArticleController>(ArticleController);
    service = module.get<ArticleService>(ArticleService);
  });

  it('Контроллер определен', () => {
    expect(controller).toBeDefined();
  });

  describe('newArticle', () => {
    it('Должен создать новую запись', async () => {
      const mockArticle: ArticleRequestDto = {
        title: 'Test',
        description: 'Content',
        imageId: 'image4.png',
      };
      const mockResponse: ArticleResponseDto = {
        _id: new Types.ObjectId(validObjectId),
        _idAuthor: new Types.ObjectId(validObjectId2),
        status: 'in-progress',
        title: 'Test',
        description: 'Content',
        imageId: 'image4.png',
        createdAt: new Date(),
      };
      (service.newArticle as jest.Mock).mockResolvedValue(mockResponse);

      const result: ArticleResponseDto = await controller.newArticle(
        mockArticle,
        'userId',
      );
      expect(result).toEqual(mockResponse);
      expect(service.newArticle).toHaveBeenCalledWith(mockArticle, 'userId');
    });
  });

  describe('completeArticle', () => {
    it('Должен отметить запись, как выполненную', async () => {
      const mockResponse: ArticleResponseDto = {
        _id: new Types.ObjectId(validObjectId),
        _idAuthor: new Types.ObjectId(validObjectId2),
        status: 'in-progress',
        title: 'Test',
        description: 'Content',
        imageId: 'image4.png',
        createdAt: new Date(),
      };
      (service.completeArticle as jest.Mock).mockResolvedValue(mockResponse);

      const result: ArticleResponseDto = await controller.completeArticle(
        '123',
        'userId',
      );
      expect(result).toEqual(mockResponse);
      expect(service.completeArticle).toHaveBeenCalledWith('123', 'userId');
    });
  });

  describe('editArticle', () => {
    it('Должен отредактировать запись', async () => {
      const mockEditDto: ArticleEditRequestDto = {
        title: 'Updated Title',
        description: 'Updated Description',
        imageId: 'image4.png',
      };
      const mockResponse: ArticleResponseDto = {
        _id: new Types.ObjectId(validObjectId),
        _idAuthor: new Types.ObjectId(validObjectId2),
        status: 'in-progress',
        title: 'Test',
        description: 'Content',
        imageId: 'image4.png',
        createdAt: new Date(),
      };
      (service.editArticle as jest.Mock).mockResolvedValue(mockResponse);

      const result = await controller.editArticle('123', mockEditDto, 'userId');
      expect(result).toEqual(mockResponse);
      expect(service.editArticle).toHaveBeenCalledWith(
        'userId',
        '123',
        mockEditDto,
      );
    });
  });

  describe('deleteArticle', () => {
    it('Должен удалить запись', async () => {
      (service.deleteArticle as jest.Mock).mockResolvedValue(undefined);

      const result = await controller.deleteArticle('123', 'userId');
      expect(result).toBe('Запись успешно удалена');
      expect(service.deleteArticle).toHaveBeenCalledWith('userId', '123');
    });
  });

  describe('getAllArticles', () => {
    it('Должен вернуть все записи пользователя', async () => {
      const mockResponse: ArticleResponseDto[] = [
        {
          _id: new Types.ObjectId(validObjectId),
          _idAuthor: new Types.ObjectId(validObjectId2),
          status: 'in-progress',
          title: 'Test',
          description: 'Content',
          imageId: 'image4.png',
          createdAt: new Date(),
        },
      ];
      (service.getAllArticles as jest.Mock).mockResolvedValue(mockResponse);

      const result: ArticleResponseDto[] =
        await controller.getAllArticles('userId');
      expect(result).toEqual(mockResponse);
      expect(service.getAllArticles).toHaveBeenCalledWith('userId');
    });
  });

  describe('getArticle', () => {
    it('Должен вернуть одну запись', async () => {
      const mockResponse: ArticleResponseDto = {
        _id: new Types.ObjectId(validObjectId),
        _idAuthor: new Types.ObjectId(validObjectId2),
        status: 'in-progress',
        title: 'Test',
        description: 'Content',
        imageId: 'image4.png',
        createdAt: new Date(),
      };
      (service.getArticle as jest.Mock).mockResolvedValue(mockResponse);

      const result = await controller.getArticle('123', 'userId');
      expect(result).toEqual(mockResponse);
      expect(service.getArticle).toHaveBeenCalledWith('userId', '123');
    });
  });
});
