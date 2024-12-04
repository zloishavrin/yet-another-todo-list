import { Body, Controller, HttpCode, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginRequestDto, LoginResponseDto } from './auth.types';

@ApiTags('Аутентификация')
@Controller('api/auth')
export class AuthController {

  constructor(
    private AuthService: AuthService
  ) {}

  @Put('registration')
  @ApiOperation({ summary: 'Регистрация пользователя' })
  @ApiResponse({
    status: 201,
    description: 'Успешная регистрация',
    type: LoginResponseDto
  })
  @UsePipes(new ValidationPipe())
  @HttpCode(201)
  async registration(
    @Body() body: LoginRequestDto
  ) : Promise<LoginResponseDto> {
    const newUser = await this.AuthService.registration(body);
    return newUser;
  }

  @Post('login')
  @ApiOperation({ summary: 'Логин пользователя' })
  @ApiResponse({
    status: 200, 
    description: 'Успешная аутентификация',
    type: LoginResponseDto
  })
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  async login(
    @Body() body: LoginRequestDto
  ) : Promise<LoginResponseDto> {
    const user = await this.AuthService.login(body);
    return user;
  }

}
