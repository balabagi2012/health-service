import { Injectable } from '@nestjs/common';
import { Client, ClientConfig, Message, RichMenu } from '@line/bot-sdk';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/users.schema';

@Injectable()
export class LineService {
  private client: Client;

  constructor(private configService: ConfigService, private usersService: UsersService) {
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

  // 建立用戶綁定訊息
  async createInitialSettingMessage(user: User) {
    if (!user.name || !user.birthday || !user.gender || !user.height) {
      const initialSettingMessage = {
        type: 'template' as const,
        altText: '用戶綁定',
        template: {
          type: 'buttons' as const,
          title: '用戶綁定',
          text: '點擊下方按鈕綁定',
          actions: [
            {
              type: 'uri' as const,
              label: '填寫資訊',
              uri: 'https://line.me/R/ti/p/@900qzqyj',
            },
          ],
        },
      };
      return initialSettingMessage;
    }
    return null;
  }

  // 發送歡迎訊息（多個訊息）
  async sendWelcomeMessages(userId: string) {
    const initialMessage = {
      type: 'text' as const,
      text: `您好！歡迎加入原健通，您的健康生活小幫手 🌿  
您可以透過我：

✅ 記錄每日健康數值
✅ 查詢歷史健康紀錄
✅ 觀看衛教資源，學習照顧自己  
✅ 設定提醒，提醒您每日紀錄  

請點選下方的選單開始使用吧 👇`,
    };

    const messages: Message[] = [
      initialMessage,
    ];

    let user = await this.usersService.findOne(userId);
    if (!user) {
      user = await this.usersService.create({ lineId: userId });
    }
    const initialSettingMessage = await this.createInitialSettingMessage(user);
    if (initialSettingMessage) {
      messages.push(initialSettingMessage);
    }
    return this.client.pushMessage(userId, messages);
  }
}
