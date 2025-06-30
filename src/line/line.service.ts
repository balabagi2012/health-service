import { Injectable } from '@nestjs/common';
import { Client, ClientConfig, RichMenu } from '@line/bot-sdk';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LineService {
  private client: Client;

  constructor(private configService: ConfigService) {
    const config: ClientConfig = {
      channelAccessToken: this.configService.get('LINE_CHANNEL_ACCESS_TOKEN'),
      channelSecret: this.configService.get('LINE_CHANNEL_SECRET'),
    };
    this.client = new Client(config);
  }

  replyText(replyToken: string, text: string) {
    return this.client.replyMessage(replyToken, {
      type: 'text',
      text,
    });
  }

  // 建立 Rich Menu
  async createRichMenu() {
    const richMenuObject = {
      size: {
        width: 2500,
        height: 843,
      },
      selected: true,
      name: 'main-menu',
      chatBarText: '功能選單',
      areas: [
        {
          bounds: { x: 0, y: 0, width: 833, height: 843 },
          action: {
            type: 'message',
            text: '上傳紀錄',
          },
        },
        {
          bounds: { x: 834, y: 0, width: 833, height: 843 },
          action: {
            type: 'message',
            text: '健康報告',
          },
        },
        {
          bounds: { x: 1667, y: 0, width: 833, height: 843 },
          action: {
            type: 'message',
            text: '衛教資源',
          },
        },
      ],
    } as RichMenu;

    const richMenuId = await this.client.createRichMenu(richMenuObject);
    return richMenuId;
  }

  // 上傳 Rich Menu 圖片
  async uploadRichMenuImage(richMenuId: string, imageBuffer: Buffer) {
    return this.client.setRichMenuImage(richMenuId, imageBuffer);
  }

  // 設定預設 Rich Menu
  async setDefaultRichMenu(richMenuId: string) {
    return this.client.setDefaultRichMenu(richMenuId);
  }

  // 為特定用戶設定 Rich Menu
  async linkRichMenuToUser(userId: string, richMenuId: string) {
    return this.client.linkRichMenuToUser(userId, richMenuId);
  }

  // 取得 Rich Menu 列表
  async getRichMenuList() {
    return this.client.getRichMenuList();
  }

  // 刪除 Rich Menu
  async deleteRichMenu(richMenuId: string) {
    return this.client.deleteRichMenu(richMenuId);
  }

  // 發送歡迎訊息
  async sendWelcomeMessage(userId: string) {
    const welcomeMessage = {
      type: 'text' as const,
      text: '歡迎使用我們的 LINE Bot！\n\n請選擇以下功能：\n1. 查看服務\n2. 聯絡客服\n3. 設定選項',
    };

    return this.client.pushMessage(userId, welcomeMessage);
  }

  // 發送歡迎訊息（多個訊息）
  async sendWelcomeMessages(userId: string) {
    const messages = [
      {
        type: 'text' as const,
        text: `您好！歡迎加入原健通，您的健康生活小幫手 🌿  
您可以透過我：

✅ 記錄每日健康數值
✅ 查詢歷史健康紀錄
✅ 觀看衛教資源，學習照顧自己  
✅ 設定提醒，提醒您每日紀錄  

請點選下方的選單開始使用吧 👇`,
      },
      {
        type: 'template' as const,
        altText: '歡迎選單',
        template: {
          type: 'buttons' as const,
          title: '請選擇服務',
          text: '點擊下方按鈕開始使用',
          actions: [
            {
              type: 'postback' as const,
              label: '查詢資訊',
              data: 'action=query_info',
            },
            {
              type: 'postback' as const,
              label: '預約服務',
              data: 'action=book_service',
            },
            {
              type: 'uri' as const,
              label: '官方網站',
              uri: 'https://example.com',
            },
          ],
        },
      },
    ];

    return this.client.pushMessage(userId, messages);
  }
}
