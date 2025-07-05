import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ description: '舊密碼', example: 'oldpassword' })
  @IsString()
  oldPassword: string;

  @ApiProperty({ description: '新密碼', example: 'newpassword' })
  @IsString()
  @MinLength(6)
  newPassword: string;
}
