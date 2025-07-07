import {
  Client,
  ClientConfig,
  FlexMessage,
  Message,
  RichMenu,
} from '@line/bot-sdk';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Record } from 'src/records/records.schema';
import { RecordsService } from 'src/records/records.service';
import { User } from 'src/users/users.schema';
import { UsersService } from 'src/users/users.service';
import { SystemConfigsService } from 'src/system-configs/system-configs.service';

type HealthRecord = {
  [key: string]: number | string;
  紀錄日期: string;
};

type ChartGroup = {
  title: string;
  fields: string[];
  colors: string[];
};
@Injectable()
export class LineService {
  private client: Client;

  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
    private recordsService: RecordsService,
    private systemConfigsService: SystemConfigsService,
  ) {
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
      // 從系統配置讀取綁定訊息設定
      const bindingConfig = await this.systemConfigsService.findByKey(
        'line_user_binding_message',
      );
      let bindingMessage = {
        title: '用戶綁定',
        text: '點擊下方按鈕綁定',
        buttonLabel: '填寫資訊',
        formUrl: `https://docs.google.com/forms/d/e/1FAIpQLSd4YqNRCmTUNrU5AO3vtUszrDm4TKRtta4nXSuhJ5GGOLyGrA/viewform?usp=pp_url&entry.505692859=${user.lineId}`,
      };

      if (bindingConfig && bindingConfig.type === 'json') {
        try {
          const configData = JSON.parse(bindingConfig.value);
          bindingMessage = { ...bindingMessage, ...configData };
        } catch (error) {
          console.error('解析用戶綁定訊息配置失敗:', error);
        }
      }

      const initialSettingMessage = {
        type: 'template' as const,
        altText: bindingMessage.title,
        template: {
          type: 'buttons' as const,
          title: bindingMessage.title,
          text: bindingMessage.text,
          actions: [
            {
              type: 'uri' as const,
              label: bindingMessage.buttonLabel,
              uri: bindingMessage.formUrl.replace('{lineId}', user.lineId),
            },
          ],
        },
      };
      return initialSettingMessage;
    }
    return null;
  }

  async getShortChartUrl(chartConfig: any): Promise<string> {
    const res = await axios.post('https://quickchart.io/chart/create', {
      chart: chartConfig,
      backgroundColor: 'white',
      width: 500,
      height: 325,
      format: 'png',
      devicePixelRatio: 2,
    });

    return res.data?.url || '';
  }

  async generateHealthChartFlexGrouped(records: HealthRecord[]) {
    // 檢查是否有數據
    if (!records || records.length === 0) {
      return {
        type: 'text',
        text: '目前沒有健康紀錄數據，請先上傳一些紀錄。',
      };
    }

    const chartGroups: ChartGroup[] = [
      {
        title: '體重變化',
        fields: ['體重（公斤）'],
        colors: ['#FF6384'],
      },
      {
        title: '糖尿病指標',
        fields: ['糖化血色素（HbA1c）', '血糖（mg/dL）'],
        colors: ['#36A2EB', '#FFCE56'],
      },
      {
        title: '血壓變化',
        fields: ['收縮壓（mmHg）', '舒張壓（mmHg）'],
        colors: ['#4BC0C0', '#9966FF'],
      },
      {
        title: '血脂指標',
        fields: [
          '三酸甘油脂（TG）',
          '高密度膽固醇（HDL）',
          '低密度膽固醇（LDL）',
        ],
        colors: ['#FF9F40', '#7CB342', '#C94D7C'],
      },
    ];

    const createChartUrl = async (
      title: string,
      fields: string[],
      colors: string[],
    ): Promise<string> => {
      const labels = records.map((r) => r['紀錄日期']);
      const datasets = fields.map((field, i) => ({
        label: field,
        data: records.map((r) => Number(r[field] ?? 0)),
        borderColor: colors[i],
        fill: false,
      }));

      const chartConfig = {
        type: 'line',
        data: { labels, datasets },
        options: {
          title: { display: true, text: title },
          scales: { y: { beginAtZero: true } },
        },
      };

      try {
        const chartUrl = await this.getShortChartUrl(chartConfig);
        return chartUrl;
      } catch (error) {
        console.error('生成图表 URL 失败:', error);
        return null;
      }
    };

    const bubbles = await Promise.all(
      chartGroups.map(async (group) => {
        const chartUrl = await createChartUrl(
          group.title,
          group.fields,
          group.colors,
        );

        // 如果没有图表 URL，返回简单的文本 bubble
        if (!chartUrl) {
          return {
            type: 'bubble',
            body: {
              type: 'box',
              layout: 'vertical',
              contents: [
                {
                  type: 'text',
                  text: group.title,
                  weight: 'bold',
                  size: 'lg',
                  align: 'center',
                },
                {
                  type: 'text',
                  text: '無法生成圖表，請稍後再試',
                  size: 'sm',
                  color: '#AAAAAA',
                  align: 'center',
                  margin: 'md',
                },
              ],
            },
          };
        }

        return {
          type: 'bubble',
          hero: {
            type: 'image',
            url: chartUrl,
            size: 'full',
            aspectRatio: '20:13',
            aspectMode: 'cover',
          },
          body: {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'text',
                text: group.title,
                weight: 'bold',
                size: 'lg',
                align: 'center',
              },
              {
                type: 'text',
                text: '資料來源：原健通',
                size: 'xs',
                color: '#AAAAAA',
                align: 'center',
                margin: 'md',
              },
            ],
          },
        };
      }),
    );

    return {
      type: 'flex',
      altText: '健康指標趨勢圖表',
      contents: {
        type: 'carousel',
        contents: bubbles,
      },
    };
  }

  // 檢查本日是否已經填寫過紀錄
  async checkTodayRecord(userId: string) {
    const records = await this.recordsService.findByDateRange(
      userId,
      new Date(new Date().setHours(0, 0, 0, 0)),
      new Date(),
    );
    return records.length > 0 ? true : false;
  }

  // 建立填寫紀錄訊息
  async createHealthRecordsMessage(userId: string) {
    // 從系統配置讀取健康紀錄訊息設定
    const user = await this.findOrCreateUser(userId);
    const recordsConfig = await this.systemConfigsService.findByKey(
      'line_health_records_message',
    );
    let recordsData = {
      titleTemplate: '填寫{date}紀錄',
      text: '點擊下方按鈕紀錄',
      buttonLabel: '立即填寫',
      formConfig: {
        baseUrl:
          'https://docs.google.com/forms/d/e/1FAIpQLSfyayzwc6WBbalvmstSODxU8ujvWhUyXXvhzpL2Vwnv4gxFdA/viewform?usp=pp_url',
        lineIdParam: '&entry.1938784452={lineId}',
        chronicIllnessParam: '&entry.1793505048={chronicIllness}',
        dateParam: '&entry.1458797072={date}',
      },
    };

    if (recordsConfig && recordsConfig.type === 'json') {
      try {
        const configData = JSON.parse(recordsConfig.value);
        recordsData = { ...recordsData, ...configData };
      } catch (error) {
        console.error('解析健康紀錄訊息配置失敗:', error);
      }
    }

    // 生成表單連結
    const currentDate = new Date().toISOString().split('T')[0];
    const lineIdParam = recordsData.formConfig.lineIdParam.replace(
      '{lineId}',
      encodeURIComponent(user.lineId),
    );
    const chronicIllnessParams = user.chronicIllness
      .map((name) =>
        recordsData.formConfig.chronicIllnessParam.replace(
          '{chronicIllness}',
          encodeURIComponent(name),
        ),
      )
      .join('');
    const dateParam = recordsData.formConfig.dateParam.replace(
      '{date}',
      encodeURIComponent(currentDate),
    );

    const link =
      recordsData.formConfig.baseUrl +
      lineIdParam +
      chronicIllnessParams +
      dateParam;

    // 生成標題（支援日期模板）
    const title = recordsData.titleTemplate.replace('{date}', currentDate);

    const healthRecordsMessage = {
      type: 'template' as const,
      altText: '填寫紀錄',
      template: {
        type: 'buttons' as const,
        title: title,
        text: recordsData.text,
        actions: [
          {
            type: 'uri' as const,
            label: recordsData.buttonLabel,
            uri: link,
          },
        ],
      },
    };
    return healthRecordsMessage;
  }

  // 發送填寫紀錄訊息
  async sendHealthRecordsMessage(userId: string, replyToken: string) {
    const user = await this.findOrCreateUser(userId);
    const initialSettingMessage = await this.createInitialSettingMessage(user);
    if (initialSettingMessage) {
      return await this.client.pushMessage(userId, [initialSettingMessage]);
    }
    const healthRecordsMessage = await this.createHealthRecordsMessage(userId);
    return await this.client.replyMessage(replyToken, [healthRecordsMessage]);
  }

  convertHealthRecordToChinese(record: Record) {
    return {
      '體重（公斤）': record.weight,
      '糖化血色素（HbA1c）': record.hba1c,
      '血糖（mg/dL）': record.bloodSugar,
      '收縮壓（mmHg）': record.systolicPressure,
      '舒張壓（mmHg）': record.diastolicPressure,
      '低密度膽固醇（LDL）': record.ldl,
      '高密度膽固醇（HDL）': record.hdl,
      '三酸甘油脂（TG）': record.tg,
      紀錄日期: new Date(record.recordDate).toLocaleDateString('zh-TW'),
    };
  }

  // 發送歷史紀錄訊息
  async sendHealthHistoryMessage(userId: string, replyToken: string) {
    const user = await this.findOrCreateUser(userId);
    const initialSettingMessage = await this.createInitialSettingMessage(user);
    if (initialSettingMessage) {
      return await this.client.replyMessage(replyToken, [
        initialSettingMessage,
      ]);
    }
    const isTodayRecord = await this.checkTodayRecord(userId);
    if (!isTodayRecord) {
      return await this.sendHealthRecordsMessage(userId, replyToken);
    }
    const records = await this.recordsService.findByDateRange(
      userId,
      new Date(new Date().setDate(new Date().getDate() - 7)),
      new Date(),
    );
    const healthData = records.map((record) =>
      this.convertHealthRecordToChinese(record),
    );
    const message = (await this.generateHealthChartFlexGrouped(
      healthData,
    )) as FlexMessage;

    return await this.client.replyMessage(replyToken, [message]);
  }

  // 發送歡迎訊息（多個訊息）
  async sendWelcomeMessages(userId: string, replyToken: string) {
    // 從系統配置讀取歡迎訊息設定
    const welcomeConfig = await this.systemConfigsService.findByKey(
      'line_welcome_message',
    );
    let welcomeData = {
      initialMessage: {
        text: `您好！歡迎加入原健通，您的健康生活小幫手 🌿  
您可以透過我：

✅ 記錄每日健康數值
✅ 查詢歷史健康紀錄
✅ 觀看衛教資源，學習照顧自己  

請點選下方的選單開始使用吧 👇`,
      },
      menuMessage: {
        title: '選單',
        text: '選擇您想使用的功能',
        actions: [
          { label: '上傳紀錄', text: '上傳紀錄' },
          { label: '健康報告', text: '健康報告' },
          { label: '衛教資源', text: '衛教資源' },
        ],
      },
    };

    if (welcomeConfig && welcomeConfig.type === 'json') {
      try {
        const configData = JSON.parse(welcomeConfig.value);
        welcomeData = { ...welcomeData, ...configData };
      } catch (error) {
        console.error('解析歡迎訊息配置失敗:', error);
      }
    }

    const initialMessage = {
      type: 'text' as const,
      text: welcomeData.initialMessage.text,
    };

    const messages: Message[] = [initialMessage];

    const menuMessage = {
      type: 'template' as const,
      altText: welcomeData.menuMessage.title,
      template: {
        type: 'buttons' as const,
        title: welcomeData.menuMessage.title,
        text: welcomeData.menuMessage.text,
        actions: welcomeData.menuMessage.actions.map((action) => ({
          type: 'message' as const,
          label: action.label,
          text: action.text,
        })),
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

  // 發送衛教資源 Flex Message
  async sendHealthEducationResources(userId: string, replyToken: string) {
    try {
      // 從系統配置讀取衛教資源設定
      const messages: Message[] = [];
      const educationConfig = await this.systemConfigsService.findByKey(
        'line_health_education_resources',
      );
      let educationData = {
        chronicDiseaseMessage: {
          title: '慢性病',
          text: '選擇您想了解的慢性病資訊',
          actions: [
            {
              label: '糖尿病',
              uri: 'https://health99.hpa.gov.tw/search?keyword=%E7%B3%96%E5%B0%BF%E7%97%85',
            },
            {
              label: '高血壓',
              uri: 'https://health99.hpa.gov.tw/search?keyword=%E9%AB%98%E8%A1%80%E5%A3%93',
            },
            {
              label: '高血脂',
              uri: 'https://health99.hpa.gov.tw/search?keyword=%E9%AB%98%E8%A1%80%E8%84%82',
            },
          ],
        },
        otherDiseaseMessage: {
          title: '其他',
          text: '選擇您想了解的其他疾病資訊',
          actions: [
            {
              label: '癌症',
              uri: 'https://health99.hpa.gov.tw/search?keyword=%E7%99%8C%E7%97%87',
            },
            {
              label: '心臟病',
              uri: 'https://health99.hpa.gov.tw/search?keyword=%E5%BF%83%E8%87%9F%E7%97%85',
            },
            {
              label: '更多衛教資訊',
              uri: 'https://health99.hpa.gov.tw/material',
            },
          ],
        },
        fallbackMessage: {
          text: `🏥 衛教資源連結：

🩸 糖尿病：https://health99.hpa.gov.tw/search?keyword=糖尿病
💓 高血壓：https://health99.hpa.gov.tw/search?keyword=高血壓
🩺 高血脂：https://health99.hpa.gov.tw/search?keyword=高血脂
🦠 癌症：https://health99.hpa.gov.tw/search?keyword=癌症
❤️ 心臟病：https://health99.hpa.gov.tw/search?keyword=心臟病
📚 更多資訊：https://health99.hpa.gov.tw/material

資料來源：國民健康署`,
        },
      };

      if (educationConfig && educationConfig.type === 'json') {
        try {
          const configData = JSON.parse(educationConfig.value);
          educationData = { ...educationData, ...configData };
        } catch (error) {
          console.error('解析衛教資源配置失敗:', error);
        }
      }

      // 第一張：慢性病
      const chronicDiseaseMessage = {
        type: 'template' as const,
        altText: '慢性病衛教資源',
        template: {
          type: 'buttons' as const,
          title: educationData.chronicDiseaseMessage.title,
          text: educationData.chronicDiseaseMessage.text,
          actions: educationData.chronicDiseaseMessage.actions.map(
            (action) => ({
              type: 'uri' as const,
              label: action.label,
              uri: action.uri,
            }),
          ),
        },
      };

      messages.push(chronicDiseaseMessage);

      // 第二張：其他
      const otherDiseaseMessage = {
        type: 'template' as const,
        altText: '其他疾病衛教資源',
        template: {
          type: 'buttons' as const,
          title: educationData.otherDiseaseMessage.title,
          text: educationData.otherDiseaseMessage.text,
          actions: educationData.otherDiseaseMessage.actions.map((action) => ({
            type: 'uri' as const,
            label: action.label,
            uri: action.uri,
          })),
        },
      };

      messages.push(otherDiseaseMessage);

      const isTodayRecord = await this.checkTodayRecord(userId);
      if (!isTodayRecord) {
        const healthRecordsMessage = await this.createHealthRecordsMessage(
          userId,
        );
        messages.push(healthRecordsMessage);
      }

      // 發送兩個 template buttons 訊息
      return await this.client.replyMessage(replyToken, messages);
    } catch (error) {
      console.error('發送衛教資源 Template Message 時發生錯誤:', error);

      // 從配置讀取 fallback 訊息
      const educationConfig = await this.systemConfigsService.findByKey(
        'line_health_education_resources',
      );
      let fallbackText = `🏥 衛教資源連結：

🩸 糖尿病：https://health99.hpa.gov.tw/search?keyword=糖尿病
💓 高血壓：https://health99.hpa.gov.tw/search?keyword=高血壓
🩺 高血脂：https://health99.hpa.gov.tw/search?keyword=高血脂
🦠 癌症：https://health99.hpa.gov.tw/search?keyword=癌症
❤️ 心臟病：https://health99.hpa.gov.tw/search?keyword=心臟病
📚 更多資訊：https://health99.hpa.gov.tw/material

資料來源：國民健康署`;

      if (educationConfig && educationConfig.type === 'json') {
        try {
          const configData = JSON.parse(educationConfig.value);
          if (configData.fallbackMessage && configData.fallbackMessage.text) {
            fallbackText = configData.fallbackMessage.text;
          }
        } catch (error) {
          console.error('解析衛教資源 fallback 配置失敗:', error);
        }
      }

      const fallbackMessage = {
        type: 'text' as const,
        text: fallbackText,
      };

      return await this.client.replyMessage(replyToken, fallbackMessage);
    }
  }

  async replyMessage(replyToken: string, messages: Message[]) {
    return this.client.replyMessage(replyToken, messages);
  }
}
