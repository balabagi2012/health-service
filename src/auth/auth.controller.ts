import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

class EmailDto {
  @ApiProperty({ example: 'test@example.com', description: '電子郵件' })
  @IsEmail()
  email: string;
}

class UpdateProfileWithEmailDto extends UpdateProfileDto {
  @ApiProperty({ example: 'test@example.com', description: '電子郵件' })
  @IsEmail()
  email: string;
}

class ChangePasswordWithEmailDto extends ChangePasswordDto {
  @ApiProperty({ example: 'test@example.com', description: '電子郵件' })
  @IsEmail()
  email: string;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: '註冊新用戶' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, type: AuthResponseDto, description: '註冊成功' })
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(registerDto) as any;
  }

  @Post('login')
  @ApiOperation({ summary: '用戶登入' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, type: AuthResponseDto, description: '登入成功' })
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto) as any;
  }

  @Get('profile')
  @ApiOperation({ summary: '取得個人資料' })
  @ApiQuery({ name: 'email', required: true, description: '電子郵件' })
  @ApiResponse({ status: 200, type: AuthResponseDto })
  async getProfile(@Query('email') email: string): Promise<AuthResponseDto> {
    const user = await this.authService.findByEmail(email);
    return user as any;
  }

  @Put('profile')
  @ApiOperation({ summary: '更新個人資料' })
  @ApiBody({ type: UpdateProfileWithEmailDto })
  @ApiResponse({ status: 200, type: AuthResponseDto })
  async updateProfile(
    @Body() updateData: UpdateProfileWithEmailDto,
  ): Promise<AuthResponseDto> {
    const user = await this.authService.updateProfileByEmail(
      updateData.email,
      updateData,
    );
    return user as any;
  }

  @Post('change-password')
  @ApiOperation({ summary: '變更密碼' })
  @ApiBody({ type: ChangePasswordWithEmailDto })
  @ApiResponse({
    status: 200,
    schema: { example: { message: '密碼更新成功' } },
  })
  async changePassword(
    @Body() body: ChangePasswordWithEmailDto,
  ): Promise<{ message: string }> {
    return this.authService.changePasswordByEmail(
      body.email,
      body.oldPassword,
      body.newPassword,
    );
  }
}
