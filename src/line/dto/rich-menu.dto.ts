import { ApiProperty } from '@nestjs/swagger';

export class CreateRichMenuResponseDto {
  @ApiProperty({ description: 'RichMenu ID', example: 'richmenu-1234567890' })
  richMenuId: string;
}

export class GetRichMenuListResponseDto {
  @ApiProperty({ description: 'RichMenu 列表', type: [String] })
  richMenus: string[];
}

export class UploadRichMenuImageRequestDto {
  @ApiProperty({ description: 'RichMenu ID', example: 'richmenu-1234567890' })
  richMenuId: string;
}

export class UploadRichMenuImageResponseDto {
  @ApiProperty({ description: '訊息', example: 'Rich menu image uploaded' })
  message: string;

  @ApiProperty({
    description: '錯誤訊息',
    example: 'Failed to upload rich menu image',
    required: false,
  })
  error?: string;
}

export class SetDefaultRichMenuRequestDto {
  @ApiProperty({ description: 'RichMenu ID', example: 'richmenu-1234567890' })
  richMenuId: string;
}

export class SetDefaultRichMenuResponseDto {
  @ApiProperty({ description: '訊息', example: 'Default rich menu set' })
  message: string;
}

export class DeleteRichMenuResponseDto {
  @ApiProperty({ description: '訊息', example: 'Rich menu deleted' })
  message: string;
}
