import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { LineService } from './line.service';

@Controller('webhook')
export class LineController {
  constructor(private readonly lineService: LineService) {}

  @Post()
  async handleWebhook(@Req() req: Request, @Res() res: Response) {
    const events = req.body.events;

    for (const event of events) {
      if (event.type === 'join') {
        // 用戶加入群組或聊天室
        await this.lineService.sendWelcomeMessages(event.source.userId);
      } else if (event.type === 'follow') {
        // 用戶加好友
        await this.lineService.sendWelcomeMessages(event.source.userId);
      } else if (event.type === 'message' && event.message.type === 'text') {
        await this.lineService.replyText(
          event.replyToken,
          `你說了: ${event.message.text}`,
        );
      }
    }

    return res.status(200).send('OK');
  }

  @Post('rich-menu')
  async createRichMenu() {
    const richMenuId = await this.lineService.createRichMenu();
    return { richMenuId };
  }

  @Post('rich-menu/upload')
  @UseInterceptors(FileInterceptor('image'))
  async uploadRichMenuImage(
    @Body('richMenuId') richMenuId: string,
    @UploadedFile() file: any,
  ) {
    await this.lineService.uploadRichMenuImage(richMenuId, file.buffer);
    return { message: 'Rich menu image uploaded' };
  }

  @Post('rich-menu/default')
  async setDefaultRichMenu(@Body('richMenuId') richMenuId: string) {
    await this.lineService.setDefaultRichMenu(richMenuId);
    return { message: 'Default rich menu set' };
  }
}
