import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SystemConfigDocument = SystemConfig & Document;

@Schema({ timestamps: true })
export class SystemConfig {
  @Prop({ required: true, unique: true })
  key: string;

  @Prop({ required: true })
  value: string;

  @Prop()
  description?: string;

  @Prop({ default: 'string' })
  type: 'string' | 'number' | 'boolean' | 'json';

  @Prop({ default: true })
  isActive: boolean;
}

export const SystemConfigSchema = SchemaFactory.createForClass(SystemConfig); 