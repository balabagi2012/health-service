import { Module } from '@nestjs/common';
import { LineService } from './line.service';
import { LineController } from './line.controller';
import { UsersModule } from 'src/users/users.module';
import { RecordsModule } from 'src/records/records.module';

@Module({
  imports: [UsersModule, RecordsModule],
  controllers: [LineController],
  providers: [LineService],
})
export class LineModule {}
