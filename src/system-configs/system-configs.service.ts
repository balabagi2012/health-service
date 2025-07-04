import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SystemConfig, SystemConfigDocument } from './system-configs.schema';

@Injectable()
export class SystemConfigsService {
  constructor(
    @InjectModel(SystemConfig.name)
    private systemConfigModel: Model<SystemConfigDocument>,
  ) {}

  async findAll(): Promise<SystemConfig[]> {
    return this.systemConfigModel.find({ isActive: true }).exec();
  }

  async findByKey(key: string): Promise<SystemConfig | null> {
    return this.systemConfigModel.findOne({ key, isActive: true }).exec();
  }

  async create(createSystemConfigDto: Partial<SystemConfig>): Promise<SystemConfig> {
    const createdSystemConfig = new this.systemConfigModel(createSystemConfigDto);
    return createdSystemConfig.save();
  }

  async update(key: string, updateSystemConfigDto: Partial<SystemConfig>): Promise<SystemConfig | null> {
    return this.systemConfigModel
      .findOneAndUpdate({ key }, updateSystemConfigDto, { new: true })
      .exec();
  }

  async delete(key: string): Promise<boolean> {
    const result = await this.systemConfigModel
      .findOneAndUpdate({ key }, { isActive: false }, { new: true })
      .exec();
    return !!result;
  }
} 