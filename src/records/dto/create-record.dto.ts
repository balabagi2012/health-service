import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsDateString } from 'class-validator';

export class CreateRecordDto {
  @ApiProperty({ description: '使用者 ID', example: 'U1234567890abcdef' })
  @IsString()
  userId: string;

  @ApiProperty({ description: '體重 (公斤)', example: 70.5, required: false })
  @IsOptional()
  @IsNumber()
  weight?: number;

  @ApiProperty({
    description: 'HbA1c 糖化血色素 (%)',
    example: 6.5,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  hba1c?: number;

  @ApiProperty({ description: '血糖 (mg/dL)', example: 120, required: false })
  @IsOptional()
  @IsNumber()
  bloodSugar?: number;

  @ApiProperty({ description: '收縮壓 (mmHg)', example: 120, required: false })
  @IsOptional()
  @IsNumber()
  systolicPressure?: number;

  @ApiProperty({ description: '舒張壓 (mmHg)', example: 80, required: false })
  @IsOptional()
  @IsNumber()
  diastolicPressure?: number;

  @ApiProperty({
    description: 'LDL 低密度脂蛋白 (mg/dL)',
    example: 100,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  ldl?: number;

  @ApiProperty({
    description: 'HDL 高密度脂蛋白 (mg/dL)',
    example: 50,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  hdl?: number;

  @ApiProperty({
    description: 'TG 三酸甘油脂 (mg/dL)',
    example: 150,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  tg?: number;

  @ApiProperty({
    description: '記錄日期',
    example: '2024-01-15T00:00:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  recordDate?: Date;
}
