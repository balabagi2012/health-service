import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsIn } from 'class-validator';

export class UpdateSystemConfigDto {
  @ApiProperty({ description: '設定值', example: '5', required: false })
  @IsOptional()
  @IsString()
  value?: string;

  @ApiProperty({
    description: '描述',
    example: '最大登入次數',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: '型別',
    example: 'string',
    required: false,
    enum: ['string', 'number', 'boolean', 'json'],
  })
  @IsOptional()
  @IsIn(['string', 'number', 'boolean', 'json'])
  type?: 'string' | 'number' | 'boolean' | 'json';

  @ApiProperty({ description: '是否啟用', example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
