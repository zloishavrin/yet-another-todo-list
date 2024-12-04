import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  ArticleEditRequestDto,
  ArticleRequestDto,
  ArticleResponseDto,
} from './article.types';
import { UserId } from 'src/auth/auth.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { ArticleService } from './article.service';

@ApiTags('Записи')
@Controller('api/article')
@UseGuards(AuthGuard)
export class ArticleController {
  constructor(private ArticleService: ArticleService) {}

  @Put('new')
  @ApiOperation({ summary: 'Новая запись' })
  @ApiResponse({
    status: 201,
    description: 'Запись успешно создана',
    type: ArticleResponseDto,
  })
  @UsePipes(new ValidationPipe())
  @HttpCode(201)
  async newArticle(
    @Body() article: ArticleRequestDto,
    @UserId() userId: string,
  ): Promise<ArticleResponseDto> {
    const newArticle = this.ArticleService.newArticle(article, userId);
    return newArticle;
  }

  @Patch('complete/:id')
  @ApiOperation({ summary: 'Изменить статус задачи на завершенную' })
  @ApiResponse({
    status: 200,
    description: 'Статус задачи успешно изменен',
    type: ArticleResponseDto,
  })
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  async completeArticle(
    @Param('id') id: string,
    @UserId() userId: string,
  ): Promise<ArticleResponseDto> {
    const completeArticle = this.ArticleService.completeArticle(id, userId);
    return completeArticle;
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'Редактирование задачи' })
  @ApiResponse({
    status: 200,
    description: 'Запись успешно изменена',
    type: ArticleResponseDto,
  })
  @UsePipes(new ValidationPipe())
  async editArticle(
    @Param('id') id: string,
    @Body() body: ArticleEditRequestDto,
    @UserId() userId: string,
  ): Promise<ArticleResponseDto> {
    const editArticle = this.ArticleService.editArticle(userId, id, body);
    return editArticle;
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Удаление записи' })
  @ApiResponse({
    status: 200,
    description: 'Запись успешно удалена',
    type: 'Запись успешно удалена',
  })
  @UsePipes(new ValidationPipe())
  async deleteArticle(
    @Param('id') id: string,
    @UserId() userId: string,
  ): Promise<string> {
    await this.ArticleService.deleteArticle(userId, id);
    return 'Запись успешно удалена';
  }

  @Get('/all')
  @ApiOperation({ summary: 'Получение всех записей пользователя' })
  @ApiResponse({
    status: 200,
    description: 'Записи успешно получены',
    type: [ArticleResponseDto],
  })
  @UsePipes(new ValidationPipe())
  async getAllArticles(
    @UserId() userId: string,
  ): Promise<ArticleResponseDto[]> {
    const articles = await this.ArticleService.getAllArticles(userId);
    return articles;
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Получение записи' })
  @ApiResponse({
    status: 200,
    description: 'Запись успешно получена',
    type: ArticleResponseDto,
  })
  @UsePipes(new ValidationPipe())
  async getArticle(
    @Param('id') id: string,
    @UserId() userId: string,
  ): Promise<ArticleResponseDto> {
    const article = await this.ArticleService.getArticle(userId, id);
    return article;
  }
}
