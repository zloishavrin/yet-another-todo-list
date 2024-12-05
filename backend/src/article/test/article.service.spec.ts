import { Test, TestingModule } from '@nestjs/testing';
import { ArticleService } from '../article.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article } from '@db/article.schema';
import { BadRequestException } from '@nestjs/common';

describe('ArticleService', () => {
  let articleService: ArticleService;
  let articleModel: Model<Article>;

  const validObjectId = '507f191e810c19729de860ea';
  const validObjectId2 = '507f191e810c19729de860eb';

  beforeEach(async () => {
    const mockArticleModel = {
      create: jest.fn(),
      findById: jest.fn(),
      findByIdAndDelete: jest.fn(),
      find: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticleService,
        { provide: getModelToken(Article.name), useValue: mockArticleModel },
      ],
    }).compile();

    articleService = module.get<ArticleService>(ArticleService);
    articleModel = module.get<Model<Article>>(getModelToken(Article.name));
  });

  describe('newArticle', () => {
    it('Должен создать новую запись', async () => {
      const userId = 'userId';
      const articleDto = {
        title: 'Test Title',
        description: 'Test Description',
        imageId: 'image123',
        status: 'draft',
      };
      const newArticle = {
        ...articleDto,
        owner: userId,
        _id: '12345',
        createdAt: new Date(),
      };

      articleModel.create = jest.fn().mockResolvedValue(newArticle);

      const result = await articleService.newArticle(articleDto, userId);

      expect(result).toEqual({
        _id: '12345',
        _idAuthor: userId,
        title: 'Test Title',
        description: 'Test Description',
        imageId: 'image123',
        status: 'draft',
        createdAt: newArticle.createdAt,
      });
      expect(articleModel.create).toHaveBeenCalledWith({
        ...articleDto,
        owner: userId,
      });
    });
  });

  describe('completeArticle', () => {
    it('Должен изменить статус на завершенный', async () => {
      const articleId = '12345';
      const userId = 'userId';
      const article = {
        _id: articleId,
        owner: userId,
        status: 'draft',
        title: 'Test Title',
        description: 'Test Description',
        imageId: 'image123',
        createdAt: new Date(),
        save: jest.fn().mockResolvedValue({
          _id: articleId,
          owner: userId,
          status: 'completed',
          title: 'Test Title',
          description: 'Test Description',
          imageId: 'image123',
          createdAt: new Date(),
        }),
      };
      articleModel.findById = jest.fn().mockResolvedValue(article);
      article.save = jest.fn().mockResolvedValue(article);

      const result = await articleService.completeArticle(articleId, userId);

      expect(result.status).toBe('completed');
      expect(article.save).toHaveBeenCalled();
    });

    it('Ошибка, если записи нет', async () => {
      const articleId = '12345';
      const userId = 'userId';
      articleModel.findById = jest.fn().mockResolvedValue(null);

      await expect(
        articleService.completeArticle(articleId, userId),
      ).rejects.toThrowError(new BadRequestException(['Запись не найдена']));
    });

    it('Ошибка, если пользователь не автор записи', async () => {
      const articleId = '12345';
      const userId = 'wrongUserId';
      const article = {
        _id: articleId,
        owner: 'userId',
        status: 'draft',
        title: 'Test Title',
        description: 'Test Description',
        imageId: 'image123',
        createdAt: new Date(),
      };
      articleModel.findById = jest.fn().mockResolvedValue(article);

      await expect(
        articleService.completeArticle(articleId, userId),
      ).rejects.toThrowError(
        new BadRequestException(['Вы не можете редактировать чужую запись']),
      );
    });
  });

  describe('editArticle', () => {
    it('Должен изменить запись', async () => {
      const articleId = '12345';
      const userId = 'userId';
      const editDto = {
        title: 'Updated Title',
        description: 'Updated Description',
        imageId: 'image123',
      };
      const article = {
        _id: articleId,
        owner: userId,
        status: 'draft',
        title: 'Test Title',
        description: 'Test Description',
        imageId: 'image123',
        createdAt: new Date(),
        save: jest.fn().mockResolvedValue({
          _id: articleId,
          owner: userId,
          status: 'completed',
          title: 'Test Title',
          description: 'Test Description',
          imageId: 'image123',
          createdAt: new Date(),
        }),
      };
      articleModel.findById = jest.fn().mockResolvedValue(article);
      article.save = jest
        .fn()
        .mockResolvedValue({ ...article, title: 'Updated Title' });

      const result = await articleService.editArticle(
        userId,
        articleId,
        editDto,
      );

      expect(result.title).toBe('Updated Title');
      expect(article.save).toHaveBeenCalled();
    });

    it('Ошибка, если запись не найдена', async () => {
      const articleId = '12345';
      const userId = 'userId';
      const editDto = {
        title: 'Updated Title',
        description: 'Updated Description',
        imageId: 'image123',
      };
      articleModel.findById = jest.fn().mockResolvedValue(null);

      await expect(
        articleService.editArticle(userId, articleId, editDto),
      ).rejects.toThrowError(new BadRequestException(['Запись не найдена']));
    });

    it('Ошибка, если пользователь не автор записи', async () => {
      const articleId = '12345';
      const userId = 'wrongUserId';
      const editDto = {
        title: 'Updated Title',
        description: 'Updated Description',
        imageId: 'image123',
      };
      const article = {
        _id: articleId,
        owner: 'userId',
        status: 'draft',
        title: 'Test Title',
        description: 'Test Description',
        imageId: 'image123',
        createdAt: new Date(),
      };
      articleModel.findById = jest.fn().mockResolvedValue(article);

      await expect(
        articleService.editArticle(userId, articleId, editDto),
      ).rejects.toThrowError(
        new BadRequestException(['Вы не можете редактировать чужую запись']),
      );
    });
  });

  describe('deleteArticle', () => {
    it('Ошибка, если пользователь не автор записи', async () => {
      const articleId = '12345';
      const userId = 'userId';
      const article = { _id: articleId, owner: userId };
      articleModel.findById = jest.fn().mockResolvedValue(article);
      articleModel.findByIdAndDelete = jest.fn().mockResolvedValue(article);

      await articleService.deleteArticle(userId, articleId);

      expect(articleModel.findByIdAndDelete).toHaveBeenCalledWith(articleId);
    });

    it('Ошибка, если запись не найдена', async () => {
      const articleId = '12345';
      const userId = 'userId';
      articleModel.findById = jest.fn().mockResolvedValue(null);

      await expect(
        articleService.deleteArticle(userId, articleId),
      ).rejects.toThrowError(new BadRequestException(['Запись не найдена']));
    });

    it('Ошибка, если пользователь не автор записи', async () => {
      const articleId = '12345';
      const userId = 'wrongUserId';
      const article = { _id: articleId, owner: 'userId' };
      articleModel.findById = jest.fn().mockResolvedValue(article);

      await expect(
        articleService.deleteArticle(userId, articleId),
      ).rejects.toThrowError(
        new BadRequestException(['Вы не можете удалить чужую запись']),
      );
    });
  });

  describe('getArticle', () => {
    it('Ошибка, если запись не найдена', async () => {
      const articleId = validObjectId;
      const userId = validObjectId2;
      articleModel.findById = jest.fn().mockResolvedValue(null);

      await expect(
        articleService.getArticle(userId, articleId),
      ).rejects.toThrowError(new BadRequestException(['Запись не найдена']));
    });
  });
});
