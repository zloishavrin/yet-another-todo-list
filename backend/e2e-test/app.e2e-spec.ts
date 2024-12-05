import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { closeInMongodConnection, rootMongooseTestModule } from './test-db.module';
import { User, UserSchema } from '@db/user.schema';
import { Article, ArticleSchema } from '@db/article.schema';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app/app.module';
import { LoginRequestDto } from 'src/auth/auth.types';

const twoMinutes = 2 * 60 * 1000;
jest.setTimeout(twoMinutes);

describe('E2E', () => {
  let app: INestApplication;
  let userId: string;
  let authToken: string;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          {
            name: User.name,
            schema: UserSchema,
          },
          {
            name: Article.name,
            schema: ArticleSchema,
          },
        ]),
        AppModule
      ],
      providers: [],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  it('/test (GET) - Hello World!', () => {
    return request(app.getHttpServer())
      .get('/api/test')
      .expect(200)
      .expect('Hello World!');
  });

  it('/auth/register (PUT) - должен зарегистрировать пользователя', async () => {
    const registerDto : LoginRequestDto = {
      login: 'testuser',
      password: 'testpassword',
    };

    const response = await request(app.getHttpServer())
      .put('/api/auth/registration')
      .send(registerDto)
      .expect(201);

    userId = response.body._id;
    authToken = response.body.token;

    expect(response.body).toHaveProperty('_id');
    expect(response.body).toHaveProperty('login', 'testuser');
    expect(response.body).toHaveProperty('token');
  });

  it('/auth/login (POST) - должен вернуть токен пользователя и id', async () => {
    const loginDto = {
      login: 'testuser',
      password: 'testpassword',
    };

    const response = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send(loginDto)
      .expect(200);

    expect(response.body).toHaveProperty('_id');
    expect(response.body).toHaveProperty('token');
    expect(response.body.token).toBeTruthy();
  });

  it('/user/current/:id (GET) - должен вернуть нужного пользователя', async () => {
    const response = await request(app.getHttpServer())
      .get(`/api/user/current/${userId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(response.body).toHaveProperty('_id');
    expect(response.body._id).toBe(userId);
    expect(response.body).toHaveProperty('login', 'testuser');
  });

  it('/user/me (GET) - должен вернуть нужного пользователя', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/user/me')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(response.body).toHaveProperty('_id');
    expect(response.body._id).toBe(userId);
    expect(response.body).toHaveProperty('login', 'testuser');
  });

  it('/article/new (PUT) - должен создать новую запись', async () => {
    const articleDto = {
      title: 'Test Article',
      description: 'Test article description',
      imageId: 'testimage.jpg'
    };

    const response = await request(app.getHttpServer())
      .put('/api/article/new')
      .set('Authorization', `Bearer ${authToken}`)
      .send(articleDto)
      .expect(201);

    expect(response.body).toHaveProperty('_id');
    expect(response.body.title).toBe('Test Article');
    expect(response.body.status).toBe('in-progress');
  });

  it('/article/all (GET) - должен вернуть все записи пользователя', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/article/all')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
  });

  it('/article/:id (GET) - должен вернуть конкретную запись', async () => {
    const articleDto = {
      title: 'Test Article 2',
      description: 'Description for test article 2',
      imageId: 'testimage2.jpg',
    };

    const articleResponse = await request(app.getHttpServer())
      .put('/api/article/new')
      .set('Authorization', `Bearer ${authToken}`)
      .send(articleDto)
      .expect(201);

    const articleId = articleResponse.body._id;

    const response = await request(app.getHttpServer())
      .get(`/api/article/${articleId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(response.body).toHaveProperty('_id', articleId);
    expect(response.body).toHaveProperty('title', 'Test Article 2');
  });

  it('/article/:id (PATCH) - должен изменить запись', async () => {
    const articleDto = {
      title: 'Test Article 2',
      description: 'Description for test article 2',
      imageId: 'testimage2.jpg',
    };

    const articleResponse = await request(app.getHttpServer())
      .put('/api/article/new')
      .set('Authorization', `Bearer ${authToken}`)
      .send(articleDto)
      .expect(201);

    const articleId = articleResponse.body._id;

    const articleEditDto = {
      title: 'Updated Test Article',
      description: 'Updated description for article',
    };

    const response = await request(app.getHttpServer())
      .patch(`/api/article/${articleId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(articleEditDto)
      .expect(200);

    expect(response.body).toHaveProperty('title', 'Updated Test Article');
  });

  it('/article/:id (DELETE) - должен удалить запись', async () => {
    const articleDto = {
      title: 'Test Article 2',
      description: 'Description for test article 2',
      imageId: 'testimage2.jpg',
    };

    const articleResponse = await request(app.getHttpServer())
      .put('/api/article/new')
      .set('Authorization', `Bearer ${authToken}`)
      .send(articleDto)
      .expect(201);

    const articleId = articleResponse.body._id;

    await request(app.getHttpServer())
      .delete(`/api/article/${articleId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });
});