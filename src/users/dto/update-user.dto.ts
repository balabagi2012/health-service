import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString, IsArray } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ description: '姓名', example: '王小明', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: '生日', example: '1990-01-01', required: false })
  @IsOptional()
  @IsDateString()
  birthday?: Date;

  @ApiProperty({ description: '性別', example: 'male', required: false })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiProperty({ description: '身高', example: '170', required: false })
  @IsOptional()
  @IsString()
  height?: string;

  @ApiProperty({
    description: '慢性病',
    example: ['高血壓', '糖尿病'],
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  chronicIllness?: string[];
}
