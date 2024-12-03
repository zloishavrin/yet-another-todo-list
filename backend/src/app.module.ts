import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ArticleModule } from './article/article.module';

@Module({
  imports: [AuthModule, ArticleModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
