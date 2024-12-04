import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { HydratedDocument } from 'mongoose';

@Schema()
export class User {
  @Prop({ required: true, unique: true, minlength: 5, maxlength: 64 })
  login: string;

  @Prop({ required: true, minlength: 5, maxlength: 64 })
  password: string;

  @Prop({ required: false, default: Date.now })
  createdAt: Date;
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);