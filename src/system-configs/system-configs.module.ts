import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SystemConfig, SystemConfigSchema } from './system-configs.schema';
import { SystemConfigsService } from './system-configs.service';
import { SystemConfigsController } from './system-configs.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: SystemConfig.name, schema: SystemConfigSchema }]),
  ],
  controllers: [SystemConfigsController],
  providers: [SystemConfigsService],
  exports: [SystemConfigsService],
})
export class SystemConfigsModule {} 