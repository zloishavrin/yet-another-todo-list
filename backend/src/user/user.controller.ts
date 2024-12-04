import {
  Controller,
  Get,
  Param,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserService } from './user.service';
import { UserResponseDto } from './user.types';
import { UserId } from 'src/auth/auth.decorator';

@ApiTags('Пользователи')
@Controller('/api/user')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private UserService: UserService) {}

  @Get('current/:id')
  @ApiOperation({
    summary:
      'Получение пользователя по ID (если нужен свой пользователь, то лучше метод user/me)',
  })
  @ApiResponse({
    status: 200,
    description: 'Объект пользователя',
    type: UserResponseDto,
  })
  @UsePipes(new ValidationPipe())
  async getCurrentUser(@Param('id') id: string): Promise<UserResponseDto> {
    const user = await this.UserService.getCurrentUser(id);
    return user;
  }

  @Get('me')
  @ApiOperation({ summary: 'Получение пользователя (определяется по токену)' })
  @ApiResponse({
    status: 200,
    description: 'Объект пользователя',
    type: UserResponseDto,
  })
  async getMeUser(@UserId() userId: string): Promise<UserResponseDto> {
    const user = await this.UserService.getCurrentUser(userId);
    return user;
  }

  @Get('all')
  @ApiOperation({ summary: 'Получение всех пользователей' })
  @ApiResponse({
    status: 200,
    description: 'Массив объектов пользователей',
    type: [UserResponseDto],
  })
  async getAllUsers(): Promise<UserResponseDto[]> {
    const users = await this.UserService.getAllUsers();
    return users;
  }
}
