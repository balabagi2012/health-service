import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Record, RecordDocument } from './records.schema';

@Injectable()
export class RecordsService {
  constructor(
    @InjectModel(Record.name) private recordModel: Model<RecordDocument>,
  ) {}

  async create(createRecordDto: Partial<Record>): Promise<Record> {
    const createdRecord = new this.recordModel(createRecordDto);
    return createdRecord.save();
  }

  async findAll(): Promise<Record[]> {
    return this.recordModel.find().exec();
  }

  async findOne(id: string): Promise<Record> {
    return this.recordModel.findById(id).exec();
  }

  async findByUserId(userId: string): Promise<Record[]> {
    return this.recordModel.find({ userId }).sort({ recordDate: -1 }).exec();
  }

  async findLatestByUserId(userId: string): Promise<Record> {
    return this.recordModel.findOne({ userId }).sort({ recordDate: -1 }).exec();
  }

  async update(id: string, updateRecordDto: Partial<Record>): Promise<Record> {
    return this.recordModel
      .findByIdAndUpdate(id, updateRecordDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Record> {
    return this.recordModel.findByIdAndDelete(id).exec();
  }

  async findByDateRange(userId: string, startDate: Date, endDate: Date): Promise<Record[]> {
    return this.recordModel.find({
      userId,
      recordDate: {
        $gte: startDate,
        $lte: endDate,
      },
    }).sort({ recordDate: -1 }).exec();
  }
} 