import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBody, ApiResponse, ApiQuery } from '@nestjs/swagger';

import { RecordsService } from './records.service';
import { CreateRecordDto } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';
import { RecordResponseDto } from './dto/record-response.dto';

@ApiTags('records')
@Controller('records')
export class RecordsController {
  constructor(private readonly recordsService: RecordsService) {}

  @Post()
  @ApiBody({ type: CreateRecordDto })
  @ApiResponse({ status: 201, type: RecordResponseDto })
  async create(
    @Body() createRecordDto: CreateRecordDto,
  ): Promise<RecordResponseDto> {
    const record = await this.recordsService.create(createRecordDto);
    return record as any;
  }

  @Get()
  @ApiResponse({ status: 200, type: [RecordResponseDto] })
  async findAll(): Promise<RecordResponseDto[]> {
    const records = await this.recordsService.findAll();
    return records as any;
  }

  @Get(':id')
  @ApiResponse({ status: 200, type: RecordResponseDto })
  async findOne(@Param('id') id: string): Promise<RecordResponseDto> {
    const record = await this.recordsService.findOne(id);
    return record as any;
  }

  @Get('user/:userId')
  @ApiResponse({ status: 200, type: [RecordResponseDto] })
  async findByUserId(
    @Param('userId') userId: string,
  ): Promise<RecordResponseDto[]> {
    const records = await this.recordsService.findByUserId(userId);
    return records as any;
  }

  @Get('user/:userId/date-range')
  @ApiQuery({ name: 'startDate', required: true })
  @ApiQuery({ name: 'endDate', required: true })
  @ApiResponse({ status: 200, type: [RecordResponseDto] })
  async findByDateRange(
    @Param('userId') userId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<RecordResponseDto[]> {
    const records = await this.recordsService.findByDateRange(
      userId,
      new Date(startDate),
      new Date(endDate),
    );
    return records as any;
  }

  @Get('user/:userId/latest')
  @ApiResponse({ status: 200, type: RecordResponseDto })
  async findLatestByUserId(
    @Param('userId') userId: string,
  ): Promise<RecordResponseDto> {
    const record = await this.recordsService.findLatestByUserId(userId);
    return record as any;
  }

  @Patch(':id')
  @ApiBody({ type: UpdateRecordDto })
  @ApiResponse({ status: 200, type: RecordResponseDto })
  async update(
    @Param('id') id: string,
    @Body() updateRecordDto: UpdateRecordDto,
  ): Promise<RecordResponseDto> {
    const record = await this.recordsService.update(id, updateRecordDto);
    return record as any;
  }

  @Delete(':id')
  @ApiResponse({ status: 200, type: RecordResponseDto })
  async remove(@Param('id') id: string): Promise<RecordResponseDto> {
    const record = await this.recordsService.remove(id);
    return record as any;
  }
}
