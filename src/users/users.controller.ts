import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  Body,
  NotFoundException,
  HttpCode,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  PaginationInputQueryModel,
  UserCreateModel,
  UserViewModel,
} from '../types and models/models';
import { PaginationType } from '../types and models/types';
import { Response } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAllUsers(
    @Query() query: PaginationInputQueryModel,
  ): Promise<PaginationType> {
    const {
      searchLoginTerm,
      searchEmailTerm,
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
    } = query;
    return this.usersService.findAllUsers(
      searchLoginTerm,
      searchEmailTerm,
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
    );
  }

  @Get(':id')
  async getUserByUserId(@Param('id') id: string): Promise<UserViewModel> {
    const user = await this.usersService.getUserByUserId(id);
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }
  @Post()
  async createUser(
    @Body() createUserDTO: UserCreateModel,
  ): Promise<UserViewModel> {
    const user = await this.usersService.createUser(
      createUserDTO.login,
      createUserDTO.email,
      createUserDTO.password,
    );
    return user;
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteUserByUserId(@Param('id') id: string): Promise<boolean> {
    console.log(typeof id);
    const isDeleted = await this.usersService.deleteUserByUserId(id);
    if (isDeleted) {
      return true;
    } else {
      throw new NotFoundException();
    }
  }
}
