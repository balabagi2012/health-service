import { ApiProperty } from '@nestjs/swagger';

export class SystemConfigResponseDto {
  @ApiProperty({ description: '設定鍵', example: 'maxLoginAttempts' })
  key: string;

  @ApiProperty({ description: '設定值', example: '5' })
  value: string;

  @ApiProperty({
    description: '描述',
    example: '最大登入次數',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: '型別',
    example: 'string',
    required: false,
    enum: ['string', 'number', 'boolean', 'json'],
  })
  type?: 'string' | 'number' | 'boolean' | 'json';

  @ApiProperty({ description: '是否啟用', example: true, required: false })
  isActive?: boolean;

  @ApiProperty({ description: '建立時間', required: false })
  createdAt?: Date;

  @ApiProperty({ description: '更新時間', required: false })
  updatedAt?: Date;
}
