import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RecordDocument = Record & Document;

@Schema({ timestamps: true })
export class Record {
  @Prop({ required: true })
  userId: string; // 紀錄者id

  @Prop()
  weight?: number; // 體重

  @Prop()
  hba1c?: number; // HbA1c 糖化血色素

  @Prop()
  bloodSugar?: number; // 血糖

  @Prop()
  systolicPressure?: number; // 收縮壓

  @Prop()
  diastolicPressure?: number; // 舒張壓

  @Prop()
  ldl?: number; // LDL 低密度脂蛋白

  @Prop()
  hdl?: number; // HDL 高密度脂蛋白

  @Prop()
  tg?: number; // TG 三酸甘油脂

  @Prop({ default: Date.now })
  recordDate: Date; // 紀錄日期
}

export const RecordSchema = SchemaFactory.createForClass(Record); 