import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RecordsService } from './records.service';
import { Record } from './records.schema';

@Controller('records')
export class RecordsController {
  constructor(private readonly recordsService: RecordsService) {}

  @Post()
  create(@Body() createRecordDto: Partial<Record>) {
    return this.recordsService.create(createRecordDto);
  }

  @Get()
  findAll() {
    return this.recordsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recordsService.findOne(id);
  }

  @Get('user/:userId')
  findByUserId(@Param('userId') userId: string) {
    return this.recordsService.findByUserId(userId);
  }

  @Get('user/:userId/latest')
  findLatestByUserId(@Param('userId') userId: string) {
    return this.recordsService.findLatestByUserId(userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRecordDto: Partial<Record>) {
    return this.recordsService.update(id, updateRecordDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.recordsService.remove(id);
  }
} 