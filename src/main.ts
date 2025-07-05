import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 啟用全域驗證管道
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors(); // 允許所有來源跨域

  // Swagger 配置
  const config = new DocumentBuilder()
    .setTitle('健康服務 API')
    .setDescription('健康服務系統的完整 API 文檔')
    .setVersion('1.0')
    .addTag('users', '使用者管理')
    .addTag('records', '記錄管理')
    .addTag('line', 'Line 機器人')
    .addTag('system-configs', '系統配置管理')
    .addTag('auth', '認證管理')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
