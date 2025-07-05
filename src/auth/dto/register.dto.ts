import {
  IsEmail,
  IsString,
  MinLength,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { UserRole } from '../auth.schema';

export class RegisterDto {
  @ApiProperty({ example: 'test@example.com', description: '電子郵件' })
  @IsEmail({}, { message: '請輸入有效的電子郵件地址' })
  email: string;

  @ApiProperty({ example: 'yourpassword', description: '密碼' })
  @IsString({ message: '密碼必須是字串' })
  @MinLength(6, { message: '密碼至少需要6個字符' })
  password: string;

  @ApiProperty({ example: '王小明', description: '姓名' })
  @IsString({ message: '姓名必須是字串' })
  @MinLength(2, { message: '姓名至少需要2個字符' })
  name: string;

  @ApiProperty({
    example: UserRole.USER,
    enum: UserRole,
    required: false,
    description: '角色',
  })
  @IsOptional()
  @IsEnum(UserRole, { message: '角色必須是有效的值' })
  role?: UserRole;
}
