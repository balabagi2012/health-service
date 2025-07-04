import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { SystemConfigsService } from './system-configs.service';
import { SystemConfig } from './system-configs.schema';

@Controller('system-configs')
export class SystemConfigsController {
  constructor(private readonly systemConfigsService: SystemConfigsService) {}

  @Get()
  async findAll(): Promise<SystemConfig[]> {
    return this.systemConfigsService.findAll();
  }

  @Get(':key')
  async findByKey(@Param('key') key: string): Promise<SystemConfig> {
    const config = await this.systemConfigsService.findByKey(key);
    if (!config) {
      throw new HttpException('System config not found', HttpStatus.NOT_FOUND);
    }
    return config;
  }

  @Post()
  async create(@Body() createSystemConfigDto: Partial<SystemConfig>): Promise<SystemConfig> {
    return this.systemConfigsService.create(createSystemConfigDto);
  }

  @Put(':key')
  async update(
    @Param('key') key: string,
    @Body() updateSystemConfigDto: Partial<SystemConfig>,
  ): Promise<SystemConfig> {
    const config = await this.systemConfigsService.update(key, updateSystemConfigDto);
    if (!config) {
      throw new HttpException('System config not found', HttpStatus.NOT_FOUND);
    }
    return config;
  }

  @Delete(':key')
  async delete(@Param('key') key: string): Promise<{ message: string }> {
    const deleted = await this.systemConfigsService.delete(key);
    if (!deleted) {
      throw new HttpException('System config not found', HttpStatus.NOT_FOUND);
    }
    return { message: 'System config deleted successfully' };
  }
} 