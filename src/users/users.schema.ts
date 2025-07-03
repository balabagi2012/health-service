import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  lineId: string;

  @Prop()
  name: string;

  @Prop()
  birthday: Date;

  @Prop()
  gender?: string;

  @Prop()
  height: string;

  @Prop()
  chronicIllness: string[];
}

export const UserSchema = SchemaFactory.createForClass(User); 