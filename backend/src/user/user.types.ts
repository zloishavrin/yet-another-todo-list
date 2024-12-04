import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class UserResponseDto {
  @ApiProperty({
    example: '832198jdskfjsdf881238',
    description: 'ID пользователя',
  })
  @IsMongoId()
  _id: Types.ObjectId;

  @ApiProperty({
    example: 'login123',
    description: 'Логин пользователя',
  })
  @IsNotEmpty()
  login: string;
}
