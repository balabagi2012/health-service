import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum } from 'class-validator';

import { UserRole } from '../auth.schema';

export class UpdateProfileDto {
  @ApiProperty({ description: '姓名', example: '王小明', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: '角色', enum: UserRole, required: false })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
