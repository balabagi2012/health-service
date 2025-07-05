import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiBody, ApiResponse } from '@nestjs/swagger';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, type: UserResponseDto })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.usersService.create(createUserDto);
    return user as any;
  }

  @Get()
  @ApiResponse({ status: 200, type: [UserResponseDto] })
  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.usersService.findAll();
    return users as any;
  }

  @Get(':lineId')
  @ApiResponse({ status: 200, type: UserResponseDto })
  async findOne(@Param('lineId') lineId: string): Promise<UserResponseDto> {
    const user = await this.usersService.findOne(lineId);
    return user as any;
  }

  @Patch(':lineId')
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, type: UserResponseDto })
  async update(
    @Param('lineId') lineId: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.usersService.update(lineId, updateUserDto);
    return user as any;
  }

  @Delete(':lineId')
  @ApiResponse({ status: 200, type: UserResponseDto })
  async remove(@Param('lineId') lineId: string): Promise<UserResponseDto> {
    const user = await this.usersService.remove(lineId);
    return user as any;
  }
}
