import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';

import { Auth, AuthDocument, UserRole } from './auth.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(@InjectModel(Auth.name) private authModel: Model<AuthDocument>) {}

  async register(registerDto: RegisterDto) {
    const { email, password, name, role = UserRole.USER } = registerDto;

    // 檢查郵箱是否已存在
    const existingUser = await this.authModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException('此電子郵件地址已被註冊');
    }

    // 加密密碼
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // 創建新用戶
    const newUser = new this.authModel({
      email,
      password: hashedPassword,
      name,
      role,
    });

    const savedUser = await newUser.save();
    const { password: _, ...userWithoutPassword } = savedUser.toObject();
    return userWithoutPassword;
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.authModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('電子郵件或密碼錯誤');
    }
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('電子郵件或密碼錯誤');
    }
    user.lastLoginAt = new Date();
    await user.save();
    const { password: _, ...userWithoutPassword } = user.toObject();
    return userWithoutPassword;
  }

  async findById(id: string) {
    const user = await this.authModel.findById(id).select('-password');
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.authModel.findOne({ email }).select('-password');
    return user;
  }

  async updateProfile(id: string, updateData: Partial<Auth>) {
    if (updateData.password) {
      const salt = bcrypt.genSaltSync(10);
      updateData.password = bcrypt.hashSync(updateData.password, salt);
    }
    const updatedUser = await this.authModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .select('-password');
    return updatedUser;
  }

  async changePassword(id: string, oldPassword: string, newPassword: string) {
    const user = await this.authModel.findById(id);
    if (!user) {
      throw new UnauthorizedException('用戶不存在');
    }
    const isOldPasswordValid = bcrypt.compareSync(oldPassword, user.password);
    if (!isOldPasswordValid) {
      throw new UnauthorizedException('舊密碼錯誤');
    }
    const salt = bcrypt.genSaltSync(10);
    const hashedNewPassword = bcrypt.hashSync(newPassword, salt);
    user.password = hashedNewPassword;
    await user.save();
    return { message: '密碼更新成功' };
  }

  async updateProfileByEmail(email: string, updateData: Partial<Auth>) {
    if (updateData.password) {
      const salt = bcrypt.genSaltSync(10);
      updateData.password = bcrypt.hashSync(updateData.password, salt);
    }
    const updatedUser = await this.authModel
      .findOneAndUpdate({ email }, updateData, { new: true })
      .select('-password');
    return updatedUser;
  }

  async changePasswordByEmail(
    email: string,
    oldPassword: string,
    newPassword: string,
  ) {
    const user = await this.authModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('用戶不存在');
    }
    const isOldPasswordValid = bcrypt.compareSync(oldPassword, user.password);
    if (!isOldPasswordValid) {
      throw new UnauthorizedException('舊密碼錯誤');
    }
    const salt = bcrypt.genSaltSync(10);
    const hashedNewPassword = bcrypt.hashSync(newPassword, salt);
    user.password = hashedNewPassword;
    await user.save();
    return { message: '密碼更新成功' };
  }
}
