<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# Health Service 健康服務系統

## 繁體中文說明 / Traditional Chinese Description

### 系統概述
歡迎使用健康服務系統！這是一個基於 NestJS 框架開發的現代化健康管理平台，提供完整的健康數據管理、用戶健康追蹤和醫療服務整合功能。系統採用模組化架構設計，確保高可用性和可擴展性。

### 主要功能
- **用戶管理** (`/users`): 完整的用戶註冊、登入和個人資料管理
- **健康記錄** (`/records`): 健康數據的記錄、查詢和分析
- **LINE 整合** (`/line`): 與 LINE 平台的整合，提供即時健康諮詢和通知
- **系統配置** (`/system-configs`): 系統參數和配置管理

### 技術架構
- **後端框架**: NestJS (Node.js)
- **資料庫**: MongoDB (Mongoose ODM)
- **API 文檔**: Swagger/OpenAPI
- **第三方整合**: LINE Bot SDK
- **開發工具**: TypeScript, ESLint, Prettier

---

## English Description

### System Overview
Welcome to the Health Service System! This is a modern health management platform developed based on the NestJS framework, providing comprehensive health data management, user health tracking, and medical service integration. The system adopts a modular architecture design to ensure high availability and scalability.

### Core Features
- **User Management** (`/users`): Complete user registration, login, and profile management
- **Health Records** (`/records`): Health data recording, querying, and analysis
- **LINE Integration** (`/line`): Integration with LINE platform for real-time health consultation and notifications
- **System Configuration** (`/system-configs`): System parameters and configuration management

### Technical Architecture
- **Backend Framework**: NestJS (Node.js)
- **Database**: MongoDB (Mongoose ODM)
- **API Documentation**: Swagger/OpenAPI
- **Third-party Integration**: LINE Bot SDK
- **Development Tools**: TypeScript, ESLint, Prettier

---

## Installation

```bash
$ pnpm install
```

## Running the app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Test

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## API Documentation

啟動應用程式後，可透過以下網址查看 API 文檔：
After starting the application, you can view the API documentation at:

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
