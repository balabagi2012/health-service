import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return '歡迎使用健康服務系統！這是一個基於 NestJS 框架開發的現代化健康管理平台，提供完整的健康數據管理、用戶健康追蹤和醫療服務整合功能。系統採用模組化架構設計，確保高可用性和可擴展性。';
  }
}
