import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema()
export class Article {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ default: 'in-progress' })
  status: 'in-progress' | 'completed';

  @Prop({ required: false })
  imageId: string;

  @Prop({ required: true })
  owner: Types.ObjectId;

  @Prop({ required: false, default: Date.now })
  createdAt: Date;
}

export type ArticleDocument = HydratedDocument<Article>;
export const ArticleSchema = SchemaFactory.createForClass(Article);