import { Injectable } from '@nestjs/common';
import { Client, ClientConfig, Message, RichMenu } from '@line/bot-sdk';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/users.schema';
import { RecordsService } from 'src/records/records.service';

@Injectable()
export class LineService {
  private client: Client;

  constructor(private configService: ConfigService, private usersService: UsersService, private recordsService: RecordsService) {
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

  async findOrCreateUser(userId: string) {
    let user = await this.usersService.findOne(userId);
    if (!user) {
      user = await this.usersService.create({ lineId: userId });
    }
    return user;
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
              uri: `https://docs.google.com/forms/d/e/1FAIpQLSd4YqNRCmTUNrU5AO3vtUszrDm4TKRtta4nXSuhJ5GGOLyGrA/viewform?usp=pp_url&entry.505692859=${user.lineId}`,
            },
          ],
        },
      };
      return initialSettingMessage;
    }
    return null;
  }

  // 發送填寫紀錄訊息
  async sendHealthRecordsMessage(userId: string, replyToken: string) {
    const user = await this.findOrCreateUser(userId);
    const initialSettingMessage = await this.createInitialSettingMessage(user);
    if (initialSettingMessage) {
      return await this.client.pushMessage(userId, [initialSettingMessage]);
    }
    
    // 修復 URL 中的錯誤字符並正確編碼參數
    const baseUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSfyayzwc6WBbalvmstSODxU8ujvWhUyXXvhzpL2Vwnv4gxFdA/viewform?usp=pp_url';
    const lineIdParam = `&entry.1938784452=${encodeURIComponent(user.lineId)}`;
    const chronicIllnessParams = user.chronicIllness.map(name => 
      `&entry.1793505048=${encodeURIComponent(name)}`
    ).join('');
    const dateParam = `&entry.1458797072=${encodeURIComponent(new Date().toISOString().split('T')[0])}`;
    
    const link = baseUrl + lineIdParam + chronicIllnessParams + dateParam;
    
    const healthRecordsMessage = {
      type: 'template' as const,
      altText: '填寫紀錄',
      template: {
        type: 'buttons' as const,
        title: `填寫${new Date().toISOString().split('T')[0]}紀錄`,
        text: '點擊下方按鈕紀錄',
        actions: [
          {
            type: 'uri' as const,
            label: `立即填寫`,
            uri: link, // 移除 encodeURIComponent，因為我們已經正確編碼了各個參數
          },
        ],
      },
    };
    return await this.client.replyMessage(replyToken, [healthRecordsMessage]);
  }

  // 發送歷史紀錄訊息
  async sendHealthHistoryMessage(userId: string, replyToken: string) {
    const user = await this.findOrCreateUser(userId);
    const initialSettingMessage = await this.createInitialSettingMessage(user);
    if (initialSettingMessage) {
      return await this.client.replyMessage(replyToken, [initialSettingMessage]);
    }
    const record = await this.recordsService.findLatestByUserId(userId);
    const healthHistoryMessage = {
      type: 'text' as const,
      text: JSON.stringify(record),
    };
    return await this.client.replyMessage(replyToken, [healthHistoryMessage]);
  }

  // 發送歡迎訊息（多個訊息）
  async sendWelcomeMessages(userId: string, replyToken: string) {
    const initialMessage = {
      type: 'text' as const,
      text: `您好！歡迎加入原健通，您的健康生活小幫手 🌿  
您可以透過我：

✅ 記錄每日健康數值
✅ 查詢歷史健康紀錄
✅ 觀看衛教資源，學習照顧自己  

請點選下方的選單開始使用吧 👇`,
    };

    const messages: Message[] = [
      initialMessage,
    ];

    const menuMessage = {
      type: 'template' as const,
      altText: '選單',
      template: {
        type: 'buttons' as const,
        title: '選單',
        text: '選擇您想使用的功能',
        actions: [
          {
            type: 'message' as const,
            label: '上傳紀錄',
            text: '上傳紀錄',
          },
          {
            type: 'message' as const,
            label: '健康報告',
            text: '健康報告',
          },
          {
            type: 'message' as const,
            label: '衛教資源',
            text: '衛教資源',
          },
        ],
      },
    };
    messages.push(menuMessage);
    const user = await this.findOrCreateUser(userId);
    const initialSettingMessage = await this.createInitialSettingMessage(user);
    if (initialSettingMessage) {
      messages.push(initialSettingMessage);
    }
    return this.client.replyMessage(replyToken, messages);
  }

  // 發送衛教資源模板消息
  async sendHealthEducationResources(replyToken: string) {
    const templateMessage = {
      type: 'template' as const,
      altText: '衛教資源',
      template: {
        type: 'buttons' as const,
        title: '衛教資源',
        text: '選擇您想了解的疾病衛教資訊',
        actions: [
          {
            type: 'uri' as const,
            label: '糖尿病',
            uri: 'https://health99.hpa.gov.tw/search?tab=0&keyword=糖尿病&range=2000-01-01+%7E+2025-07-03&materialType=&releaseAgency=&releaseType=&sort=&startDate=2000-01-01&endDate=2025-07-03',
          },
          {
            type: 'uri' as const,
            label: '高血脂',
            uri: 'https://health99.hpa.gov.tw/search?tab=0&keyword=高血脂&range=2000-01-01+%7E+2025-07-03&materialType=&releaseAgency=&releaseType=&sort=&startDate=2000-01-01&endDate=2025-07-03',
          },
          {
            type: 'uri' as const,
            label: '高血壓',
            uri: 'https://health99.hpa.gov.tw/search?tab=0&keyword=高血壓&range=2000-01-01+%7E+2025-07-03&materialType=&releaseAgency=&releaseType=&sort=&startDate=2000-01-01&endDate=2025-07-03',
          },
          {
            type: 'uri' as const,
            label: '癌症',
            uri: 'https://health99.hpa.gov.tw/search?tab=0&keyword=癌症&range=2000-01-01+%7E+2025-07-03&materialType=&releaseAgency=&releaseType=&sort=&startDate=2000-01-01&endDate=2025-07-03',
          },
          {
            type: 'uri' as const,
            label: '心臟病',
            uri: 'https://health99.hpa.gov.tw/search?tab=0&keyword=心臟病&range=2000-01-01+%7E+2025-07-03&materialType=&releaseAgency=&releaseType=&sort=&startDate=2000-01-01&endDate=2025-07-03',
          },
          {
            type: 'uri' as const,
            label: '查詢其他健康資訊',
            uri: 'https://health99.hpa.gov.tw/material',
          },
        ],
      },
    };

    return this.client.replyMessage(replyToken, templateMessage);
  }

  async replyMessage(replyToken: string, messages: Message[]) {
    return this.client.replyMessage(replyToken, messages);
  }
}
