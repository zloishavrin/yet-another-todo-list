import { Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { join } from 'path';
import * as uuid from 'uuid';

@ApiTags('Хранилище')
@Controller('storage')
export class StorageController {

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './storage',
      filename: (req, file, callback) => {
        const uniqueFileName = uuid.v4();
        callback(null, `${uniqueFileName}_${file.originalname}`);
      }
    })
  }))
  upload(
    @UploadedFile() file: Express.Multer.File
  ) {
    return {
      imageId: file.filename,
    }
  }

  @Get(':imageId')
  getImage(
    @Param('imageId') imageId: string,
    @Res() res
  ) {
    const filePath = join(process.cwd(), 'storage', imageId);
    res.sendFile(filePath);
  }

}
