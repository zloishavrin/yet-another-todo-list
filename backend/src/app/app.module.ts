import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '../auth/auth.module';
import { ArticleModule } from '../article/article.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from '../user/user.module';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      `mongodb://${process.env.MONGO_ROOT_USER}:${process.env.MONGO_ROOT_PASSWORD}@mongodb:27017/yatl?authSource=admin`,
    ),
    AuthModule,
    ArticleModule,
    UserModule,
    StorageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
