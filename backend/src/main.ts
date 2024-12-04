import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const PORT = 3001;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Yet Another ToDo List')
    .setDescription('Описание API')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      description: 'Аутентификация по JWT-токену',
      name: 'authorization',
      in: 'header',
      bearerFormat: 'JWT',
    })
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, swaggerDocument);

  await app.listen(PORT);
}
bootstrap();
