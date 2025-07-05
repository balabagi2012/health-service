import { ApiProperty } from '@nestjs/swagger';

export class RecordResponseDto {
  @ApiProperty({ description: '紀錄 ID', example: '65e1c2f1b2c3d4e5f6a7b8c9' })
  _id: string;

  @ApiProperty({ description: '使用者 ID', example: 'U1234567890abcdef' })
  userId: string;

  @ApiProperty({ description: '體重 (公斤)', example: 70.5, required: false })
  weight?: number;

  @ApiProperty({
    description: 'HbA1c 糖化血色素 (%)',
    example: 6.5,
    required: false,
  })
  hba1c?: number;

  @ApiProperty({ description: '血糖 (mg/dL)', example: 120, required: false })
  bloodSugar?: number;

  @ApiProperty({ description: '收縮壓 (mmHg)', example: 120, required: false })
  systolicPressure?: number;

  @ApiProperty({ description: '舒張壓 (mmHg)', example: 80, required: false })
  diastolicPressure?: number;

  @ApiProperty({
    description: 'LDL 低密度脂蛋白 (mg/dL)',
    example: 100,
    required: false,
  })
  ldl?: number;

  @ApiProperty({
    description: 'HDL 高密度脂蛋白 (mg/dL)',
    example: 50,
    required: false,
  })
  hdl?: number;

  @ApiProperty({
    description: 'TG 三酸甘油脂 (mg/dL)',
    example: 150,
    required: false,
  })
  tg?: number;

  @ApiProperty({ description: '記錄日期', example: '2024-01-15T00:00:00.000Z' })
  recordDate: Date;

  @ApiProperty({ description: '建立時間', required: false })
  createdAt?: Date;

  @ApiProperty({ description: '更新時間', required: false })
  updatedAt?: Date;
}
