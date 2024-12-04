import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDate,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  Max,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Types } from 'mongoose';

export class ArticleEditRequestDto {
  @ApiPropertyOptional({
    example: 'Какое-то название записи',
    description: 'Название записи',
  })
  @IsOptional()
  @MinLength(5)
  @MaxLength(64)
  title: string | null;

  @ApiPropertyOptional({
    example: 'Какое-то описание записи',
    description: 'Описание записи',
  })
  @IsOptional()
  @MinLength(5)
  @MaxLength(64)
  description: string | null;

  @ApiPropertyOptional({
    example: '43829482384.png',
    description: 'ID изображения',
  })
  @IsOptional()
  imageId: string | null;
}

export class ArticleRequestDto {
  @ApiProperty({
    example: 'Какое-то название записи',
    description: 'Название записи',
  })
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(64)
  title: string;

  @ApiProperty({
    example: 'Какое-то описание записи',
    description: 'Описание записи',
  })
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(64)
  description: string;

  @ApiPropertyOptional({
    example: '43829482384.png',
    description: 'ID изображения',
  })
  @IsOptional()
  imageId: string | null;
}

export class ArticleResponseDto {
  @ApiProperty({
    example: '832198jdskfjsdf881238',
    description: 'ID записи',
  })
  @IsMongoId()
  _id: Types.ObjectId;

  @ApiProperty({
    example: '832198jdskfjsdf881238',
    description: 'ID пользователя',
  })
  @IsMongoId()
  _idAuthor: Types.ObjectId;

  @ApiProperty({
    example: 'Какое-то название записи',
    description: 'Название записи',
  })
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(64)
  title: string;

  @ApiProperty({
    example: 'Какое-то описание записи',
    description: 'Описание записи',
  })
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(64)
  description: string;

  @ApiPropertyOptional({
    example: '43829482384.png',
    description: 'ID изображения',
  })
  @IsOptional()
  imageId: string | null;

  @ApiProperty({
    example: 'in-progress',
    description: 'Статус записи',
  })
  status: string;

  @ApiProperty({
    example: '2023-12-03T10:15:30Z',
    description: 'Дата создания',
  })
  @IsDate()
  createdAt: Date;
}
