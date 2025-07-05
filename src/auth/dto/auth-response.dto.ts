import { ApiProperty } from '@nestjs/swagger';

import { UserRole } from '../auth.schema';

export class AuthResponseDto {
  @ApiProperty({ description: '用戶ID', example: '660c1e2f1b2c3d4e5f6a7b8c' })
  _id: string;

  @ApiProperty({ description: '電子郵件', example: 'test@example.com' })
  email: string;

  @ApiProperty({ description: '姓名', example: '王小明' })
  name: string;

  @ApiProperty({ description: '角色', enum: UserRole, example: UserRole.USER })
  role: UserRole;

  @ApiProperty({ description: '最後登入時間', required: false })
  lastLoginAt?: Date;

  @ApiProperty({ description: '建立時間', required: false })
  createdAt?: Date;

  @ApiProperty({ description: '更新時間', required: false })
  updatedAt?: Date;
}
