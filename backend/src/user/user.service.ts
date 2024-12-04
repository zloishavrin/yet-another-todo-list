import { User } from '@db/user.schema';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserResponseDto } from './user.types';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private UserModel: Model<User>) {}

  async getCurrentUser(id: string): Promise<UserResponseDto> {
    const candidate = await this.UserModel.findById(id);
    if (!candidate) {
      throw new BadRequestException(['Пользователя с таким ID не существует']);
    }
    const user = {
      _id: candidate._id,
      login: candidate.login,
    };
    return user;
  }

  async getAllUsers(): Promise<UserResponseDto[]> {
    const users = await this.UserModel.find();
    return users;
  }
}
