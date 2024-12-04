import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsMongoId,
  IsNotEmpty,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Date, Types } from 'mongoose';

export class StorageResponseDto {
  @ApiProperty({
    example: '43829482384.png',
    description: 'ID изображения',
  })
  imageId: string;
}
