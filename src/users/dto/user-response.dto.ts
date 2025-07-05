import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ description: 'LINE ID', example: 'U1234567890abcdef' })
  lineId: string;

  @ApiProperty({ description: '姓名', example: '王小明' })
  name: string;

  @ApiProperty({ description: '生日', example: '1990-01-01', required: false })
  birthday?: Date;

  @ApiProperty({ description: '性別', example: 'male', required: false })
  gender?: string;

  @ApiProperty({ description: '身高', example: '170', required: false })
  height?: string;

  @ApiProperty({
    description: '慢性病',
    example: ['高血壓', '糖尿病'],
    required: false,
    type: [String],
  })
  chronicIllness?: string[];

  @ApiProperty({ description: '建立時間', required: false })
  createdAt?: Date;

  @ApiProperty({ description: '更新時間', required: false })
  updatedAt?: Date;
}
