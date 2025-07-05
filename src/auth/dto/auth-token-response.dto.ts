import { ApiProperty } from '@nestjs/swagger';

import { AuthResponseDto } from './auth-response.dto';

export class AuthTokenResponseDto {
  @ApiProperty({ type: AuthResponseDto })
  user: AuthResponseDto;

  @ApiProperty({
    description: 'JWT Token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  token: string;
}
