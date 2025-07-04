import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LineModule } from './line/line.module';
import { UsersModule } from './users/users.module';
import { RecordsModule } from './records/records.module';
import { SystemConfigsModule } from './system-configs/system-configs.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    LineModule,
    RecordsModule,
    SystemConfigsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
