import { User } from '@db/user.schema';
import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from "bcryptjs";
import { LoginRequestDto } from './auth.types';

@Injectable()
export class AuthService {

  constructor(
    @InjectModel(User.name) private UserModel: Model<User>,
    private JwtService: JwtService
  ) {}

  async registration(user: LoginRequestDto) {
    const { login, password } = user;

    const candidate = await this.UserModel.findOne({ login });
    if(candidate) {
      throw new BadRequestException(['Пользователь с таким логином уже существует']);
    }

    const saltRounds = 3;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await this.UserModel.create({
      login,
      password: hashedPassword,
    });

    const payload = {
      sub: newUser._id
    }
    const token = this.JwtService.sign(payload);

    const userObject = {
      _id: newUser._id,
      login: newUser.login,
      token: token
    }
    return userObject;
  }

  async login(user: LoginRequestDto) {
    const { login, password } = user;
    const candidate = await this.UserModel.findOne({ login });
    if(!candidate) {
      throw new BadRequestException(['Пользователь с таким логином не найден']);
    }

    const isPasswordEqual = await bcrypt.compare(password, candidate.password);
    if(!isPasswordEqual) {
      throw new BadRequestException(['Неверный пароль']);
    }

    const payload = {
      sub: candidate._id
    }
    const token = this.JwtService.sign(payload);

    const userObject = {
      _id: candidate._id,
      login: candidate.login,
      token: token
    }
    return userObject;
  }

}