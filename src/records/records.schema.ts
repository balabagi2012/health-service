import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type RecordDocument = Record & Document;

@Schema({ timestamps: true })
export class Record {
  @ApiProperty({ description: '使用者 ID', example: 'U1234567890abcdef' })
  @Prop({ required: true })
  userId: string; // 紀錄者id

  @ApiProperty({ description: '體重 (公斤)', example: 70.5, required: false })
  @Prop()
  weight?: number; // 體重

  @ApiProperty({ description: 'HbA1c 糖化血色素 (%)', example: 6.5, required: false })
  @Prop()
  hba1c?: number; // HbA1c 糖化血色素

  @ApiProperty({ description: '血糖 (mg/dL)', example: 120, required: false })
  @Prop()
  bloodSugar?: number; // 血糖

  @ApiProperty({ description: '收縮壓 (mmHg)', example: 120, required: false })
  @Prop()
  systolicPressure?: number; // 收縮壓

  @ApiProperty({ description: '舒張壓 (mmHg)', example: 80, required: false })
  @Prop()
  diastolicPressure?: number; // 舒張壓

  @ApiProperty({ description: 'LDL 低密度脂蛋白 (mg/dL)', example: 100, required: false })
  @Prop()
  ldl?: number; // LDL 低密度脂蛋白

  @ApiProperty({ description: 'HDL 高密度脂蛋白 (mg/dL)', example: 50, required: false })
  @Prop()
  hdl?: number; // HDL 高密度脂蛋白

  @ApiProperty({ description: 'TG 三酸甘油脂 (mg/dL)', example: 150, required: false })
  @Prop()
  tg?: number; // TG 三酸甘油脂

  @ApiProperty({ description: '記錄日期', example: '2024-01-15T00:00:00.000Z' })
  @Prop({ default: Date.now })
  recordDate: Date; // 紀錄日期

  @ApiProperty({ description: '建立時間' })
  createdAt?: Date;

  @ApiProperty({ description: '更新時間' })
  updatedAt?: Date;
}

export const RecordSchema = SchemaFactory.createForClass(Record); 