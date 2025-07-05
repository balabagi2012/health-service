import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'test@example.com', description: '電子郵件' })
  @IsEmail({}, { message: '請輸入有效的電子郵件地址' })
  email: string;

  @ApiProperty({ example: 'yourpassword', description: '密碼' })
  @IsString({ message: '密碼必須是字串' })
  password: string;
}
