import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { RecordsModule } from 'src/records/records.module';
import { SystemConfigsModule } from 'src/system-configs/system-configs.module';

import { LineController } from './line.controller';
import { LineService } from './line.service';

@Module({
  imports: [UsersModule, RecordsModule, SystemConfigsModule],
  controllers: [LineController],
  providers: [LineService],
})
export class LineModule {}
