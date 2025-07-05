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
import { ApiTags, ApiBody, ApiResponse } from '@nestjs/swagger';

import { SystemConfigsService } from './system-configs.service';
import { CreateSystemConfigDto } from './dto/create-system-config.dto';
import { UpdateSystemConfigDto } from './dto/update-system-config.dto';
import { SystemConfigResponseDto } from './dto/system-config-response.dto';

@ApiTags('system-configs')
@Controller('system-configs')
export class SystemConfigsController {
  constructor(private readonly systemConfigsService: SystemConfigsService) {}

  @Get()
  @ApiResponse({ status: 200, type: [SystemConfigResponseDto] })
  async findAll(): Promise<SystemConfigResponseDto[]> {
    const configs = await this.systemConfigsService.findAll();
    return configs as any;
  }

  @Get(':key')
  @ApiResponse({ status: 200, type: SystemConfigResponseDto })
  async findByKey(@Param('key') key: string): Promise<SystemConfigResponseDto> {
    const config = await this.systemConfigsService.findByKey(key);
    if (!config) {
      throw new HttpException('System config not found', HttpStatus.NOT_FOUND);
    }
    return config as any;
  }

  @Post()
  @ApiBody({ type: CreateSystemConfigDto })
  @ApiResponse({ status: 201, type: SystemConfigResponseDto })
  async create(
    @Body() createSystemConfigDto: CreateSystemConfigDto,
  ): Promise<SystemConfigResponseDto> {
    const config = await this.systemConfigsService.create(
      createSystemConfigDto,
    );
    return config as any;
  }

  @Put(':key')
  @ApiBody({ type: UpdateSystemConfigDto })
  @ApiResponse({ status: 200, type: SystemConfigResponseDto })
  async update(
    @Param('key') key: string,
    @Body() updateSystemConfigDto: UpdateSystemConfigDto,
  ): Promise<SystemConfigResponseDto> {
    const config = await this.systemConfigsService.update(
      key,
      updateSystemConfigDto,
    );
    if (!config) {
      throw new HttpException('System config not found', HttpStatus.NOT_FOUND);
    }
    return config as any;
  }

  @Delete(':key')
  @ApiResponse({
    status: 200,
    schema: { example: { message: 'System config deleted successfully' } },
  })
  async delete(@Param('key') key: string): Promise<{ message: string }> {
    const deleted = await this.systemConfigsService.delete(key);
    if (!deleted) {
      throw new HttpException('System config not found', HttpStatus.NOT_FOUND);
    }
    return { message: 'System config deleted successfully' };
  }
}
