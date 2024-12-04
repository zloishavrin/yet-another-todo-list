import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { join } from 'path';
import * as uuid from 'uuid';
import { StorageResponseDto } from './storage.types';

@ApiTags('Хранилище')
@Controller('storage')
export class StorageController {
  @Post('upload')
  @ApiOperation({
    summary: 'Загрузка файла на сервер (Файл передается в form-data file)',
  })
  @ApiResponse({
    status: 200,
    description: 'Файл загружен',
    type: StorageResponseDto,
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './storage',
        filename: (req, file, callback) => {
          const uniqueFileName = uuid.v4();
          callback(null, `${uniqueFileName}_${file.originalname}`);
        },
      }),
    }),
  )
  upload(@UploadedFile() file: Express.Multer.File): StorageResponseDto {
    return {
      imageId: file.filename,
    };
  }

  @Get(':imageId')
  @ApiOperation({
    summary: 'Получение изображения статикой (можно вставить ссылкой в img)',
  })
  @ApiResponse({
    status: 200,
    description: 'Отдает файл статикой',
  })
  getImage(@Param('imageId') imageId: string, @Res() res) {
    const filePath = join(process.cwd(), 'storage', imageId);
    res.sendFile(filePath);
  }
}
