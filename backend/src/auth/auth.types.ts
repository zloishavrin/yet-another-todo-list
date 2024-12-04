import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsNotEmpty, MaxLength, MinLength } from "class-validator";
import { Types } from "mongoose";

export class LoginRequestDto {
  @ApiProperty({
    example: 'login123',
    description: 'Логин пользователя'
  })
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(64)
  login: string;

  @ApiProperty({
    example: 'password123',
    description: 'Пароль пользователя'
  })
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(64)
  password: string;
}

export class LoginResponseDto {
  @ApiProperty({
    example: '832198jdskfjsdf881238',
    description: 'ID пользователя'
  })
  @IsMongoId()
  _id: Types.ObjectId;

  @ApiProperty({
    example: 'login123',
    description: 'Логин пользователя'
  })
  @IsNotEmpty()
  login: string;

  @ApiProperty({
    example: 'jdskafjk32_dsjakdjas_421uiuis',
    description: 'JWT-токен'
  })
  @IsNotEmpty()
  token: string;
}