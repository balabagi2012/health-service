import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { ApiTags, ApiBody, ApiResponse } from '@nestjs/swagger';

import { LineService } from './line.service';
import {
  CreateRichMenuResponseDto,
  GetRichMenuListResponseDto,
  UploadRichMenuImageRequestDto,
  UploadRichMenuImageResponseDto,
  SetDefaultRichMenuRequestDto,
  SetDefaultRichMenuResponseDto,
  DeleteRichMenuResponseDto,
} from './dto/rich-menu.dto';

@ApiTags('line')
@Controller('line')
export class LineController {
  constructor(private readonly lineService: LineService) {}

  @Post('/webhook')
  async handleWebhook(@Req() req: Request, @Res() res: Response) {
    const events = req.body.events;

    for (const event of events) {
      if (event.type === 'join') {
        // 用戶加入群組或聊天室
        await this.lineService.sendWelcomeMessages(
          event.source.userId,
          event.replyToken,
        );
      } else if (event.type === 'follow') {
        // 用戶加好友
        await this.lineService.sendWelcomeMessages(
          event.source.userId,
          event.replyToken,
        );
      } else if (event.type === 'message' && event.message.type === 'text') {
        const user = await this.lineService.findOrCreateUser(
          event.source.userId,
        );
        const initialSettingMessage =
          await this.lineService.createInitialSettingMessage(user);
        if (initialSettingMessage) {
          return await this.lineService.replyMessage(event.replyToken, [
            initialSettingMessage,
          ]);
        }
        // 檢查是否為衛教資源相關訊息
        if (
          event.message.text === '衛教資源' ||
          event.message.text.includes('衛教') ||
          event.message.text.includes('教育')
        ) {
          await this.lineService.sendHealthEducationResources(event.replyToken);
        } else if (event.message.text === '上傳紀錄') {
          await this.lineService.sendHealthRecordsMessage(
            event.source.userId,
            event.replyToken,
          );
        } else if (event.message.text === '健康報告') {
          await this.lineService.sendHealthHistoryMessage(
            event.source.userId,
            event.replyToken,
          );
        } else {
          await this.lineService.replyText(
            event.replyToken,
            `已收到您的訊息，請稍後`,
          );
        }
      }
    }

    return res.status(200).send('OK');
  }

  @Post('rich-menu')
  @ApiResponse({ status: 201, type: CreateRichMenuResponseDto })
  async createRichMenu(): Promise<CreateRichMenuResponseDto> {
    const richMenuId = await this.lineService.createRichMenu();
    return { richMenuId };
  }

  @Get('rich-menu')
  @ApiResponse({ status: 200, type: GetRichMenuListResponseDto })
  async getRichMenu(): Promise<GetRichMenuListResponseDto> {
    const richMenus = await this.lineService.getRichMenuList();
    return { richMenus } as any;
  }

  @Post('rich-menu/upload')
  @ApiBody({ type: UploadRichMenuImageRequestDto })
  @ApiResponse({ status: 201, type: UploadRichMenuImageResponseDto })
  @UseInterceptors(FileInterceptor('image'))
  async uploadRichMenuImage(
    @Body('richMenuId') richMenuId: string,
    @UploadedFile() file: any,
  ): Promise<UploadRichMenuImageResponseDto> {
    try {
      await this.lineService.uploadRichMenuImage(richMenuId, file.buffer);
      return { message: 'Rich menu image uploaded' };
    } catch (error) {
      console.error(error);
      return {
        message: 'Failed to upload rich menu image',
        error: error.message,
      };
    }
  }

  @Post('rich-menu/default')
  @ApiBody({ type: SetDefaultRichMenuRequestDto })
  @ApiResponse({ status: 201, type: SetDefaultRichMenuResponseDto })
  async setDefaultRichMenu(
    @Body('richMenuId') richMenuId: string,
  ): Promise<SetDefaultRichMenuResponseDto> {
    await this.lineService.setDefaultRichMenu(richMenuId);
    return { message: 'Default rich menu set' };
  }

  @Delete('rich-menu/:richMenuId')
  @ApiResponse({ status: 200, type: DeleteRichMenuResponseDto })
  async deleteRichMenu(
    @Param('richMenuId') richMenuId: string,
  ): Promise<DeleteRichMenuResponseDto> {
    await this.lineService.deleteRichMenu(richMenuId);
    return { message: 'Rich menu deleted' };
  }
}
