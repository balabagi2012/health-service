import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './users.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: Partial<User>): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(lineId: string): Promise<User> {
    return this.userModel.findOne({ lineId }).exec();
  }

  async findByLineId(lineId: string): Promise<User> {
    return this.userModel.findOne({ lineId }).exec();
  }

  async update(lineId: string, updateUserDto: Partial<User>): Promise<User> {
    const result = await this.userModel
      .findOneAndUpdate({ lineId }, updateUserDto, { new: true })
      .exec();
    return result;
  }

  async remove(lineId: string): Promise<User> {
    return this.userModel.findOneAndDelete({ lineId }).exec();
  }
} 