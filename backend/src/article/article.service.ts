import { Article } from '@db/article.schema';
import { User } from '@db/user.schema';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ArticleEditRequestDto,
  ArticleRequestDto,
  ArticleResponseDto,
} from './article.types';

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<User>,
    @InjectModel(Article.name) private ArticleModel: Model<Article>,
  ) {}

  async newArticle(
    article: ArticleRequestDto,
    userId: string,
  ): Promise<ArticleResponseDto> {
    const newArticle = await this.ArticleModel.create({
      ...article,
      owner: userId,
    });

    const articleObject = {
      _id: newArticle._id,
      _idAuthor: newArticle.owner,
      title: newArticle.title,
      description: newArticle.description,
      imageId: newArticle.imageId,
      status: newArticle.status,
      createdAt: newArticle.createdAt,
    };
    return articleObject;
  }

  async completeArticle(
    id: string,
    userId: string,
  ): Promise<ArticleResponseDto> {
    const article = await this.ArticleModel.findById(id);
    if (!article) {
      throw new BadRequestException(['Запись не найдена']);
    }

    if (article.owner.toString() !== userId) {
      throw new BadRequestException([
        'Вы не можете редактировать чужую запись',
      ]);
    }

    article.status = 'completed';
    await article.save();

    const completedArticle = {
      _id: article._id,
      _idAuthor: article.owner,
      title: article.title,
      description: article.description,
      imageId: article.imageId,
      status: article.status,
      createdAt: article.createdAt,
    };
    return completedArticle;
  }

  async editArticle(
    userId: string,
    id: string,
    article: ArticleEditRequestDto,
  ): Promise<ArticleResponseDto> {
    const articleToEdit = await this.ArticleModel.findById(id);
    if (!articleToEdit) {
      throw new BadRequestException(['Запись не найдена']);
    }

    if (articleToEdit.owner.toString() !== userId) {
      throw new BadRequestException([
        'Вы не можете редактировать чужую запись',
      ]);
    }

    if (article.title) articleToEdit.title = article.title;
    if (article.description) articleToEdit.description = article.description;
    if (article.imageId) articleToEdit.imageId = article.imageId;

    await articleToEdit.save();

    const completedArticle = {
      _id: articleToEdit._id,
      _idAuthor: articleToEdit.owner,
      title: articleToEdit.title,
      description: articleToEdit.description,
      imageId: articleToEdit.imageId,
      status: articleToEdit.status,
      createdAt: articleToEdit.createdAt,
    };
    return completedArticle;
  }

  async deleteArticle(userId: string, id: string) {
    const articleToDelete = await this.ArticleModel.findById(id);
    if (!articleToDelete) {
      throw new BadRequestException(['Запись не найдена']);
    }

    if (articleToDelete.owner.toString() !== userId) {
      throw new BadRequestException(['Вы не можете удалить чужую запись']);
    }

    await this.ArticleModel.findByIdAndDelete(id);
  }

  async getAllArticles(userId: string): Promise<ArticleResponseDto[]> {
    const articles = await this.ArticleModel.find({ owner: userId });
    const articlesObject = articles.map((article) => {
      return {
        _id: article._id,
        _idAuthor: article.owner,
        title: article.title,
        description: article.description,
        imageId: article.imageId,
        status: article.status,
        createdAt: article.createdAt,
      };
    });
    return articlesObject;
  }

  async getArticle(userId: string, id: string): Promise<ArticleResponseDto> {
    const article = await this.ArticleModel.findById(id);
    if (!article) {
      throw new BadRequestException(['Запись не найдена']);
    }

    if (article.owner.toString() !== userId) {
      throw new BadRequestException([
        'Вы не можете просматривать чужую запись',
      ]);
    }

    const articleObject = {
      _id: article._id,
      _idAuthor: article.owner,
      title: article.title,
      description: article.description,
      imageId: article.imageId,
      status: article.status,
      createdAt: article.createdAt,
    };
    return articleObject;
  }
}
