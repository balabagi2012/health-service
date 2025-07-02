import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
  } from '@nestjs/common';
  import { UsersService } from './users.service';
  import { User } from './users.schema';
  
  @Controller('users')
  export class UsersController {
    constructor(private readonly usersService: UsersService) {}
  
    @Post()
    create(@Body() createUserDto: Partial<User>) {
      return this.usersService.create(createUserDto);
    }
  
    @Get()
    findAll() {
      return this.usersService.findAll();
    }
  
    @Get(':lineId')
    findOne(@Param('lineId') lineId: string) {
      return this.usersService.findOne(lineId);
    }
  
    @Patch(':lineId')
    update(@Param('lineId') lineId: string, @Body() updateUserDto: Partial<User>) {
      return this.usersService.update(lineId, updateUserDto);
    }
  
    @Delete(':lineId')
    remove(@Param('lineId') lineId: string) {
      return this.usersService.remove(lineId);
    }
  } 