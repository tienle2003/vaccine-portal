import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  ParseIntPipe,
  UseGuards,
  ForbiddenException,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enum/role.enum';
import { RolesGuard } from 'src/common/guards/role.guard';
import {
  Pagination,
  PaginationParams,
} from 'src/common/decorators/pagination-params.decorator';
import { UserParams } from 'src/common/decorators/user.decorator';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { User } from './entities/user.entity';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { ApiBearerAuth, ApiCreatedResponse } from '@nestjs/swagger';

@Controller('users')
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  findAll(@PaginationParams() paginationParams: Pagination) {
    return this.usersService.findAll(paginationParams);
  }

  @Get(':id')
  @ApiCreatedResponse({
    type: User,
  })
  findOne(@UserParams() user: User, @Param('id', ParseIntPipe) id: number) {
    const role: Role = user.role;
    if (role === Role.User && user.id !== id)
      throw new ForbiddenException('You are not allowed to access this user');
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  updateUser(
    @UserParams() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const role: Role = user.role;
    if (role === Role.User && user.id !== id)
      throw new ForbiddenException('You are not allowed to access this user');
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Put('change-password')
  @ResponseMessage('Update password successfully')
  async updatePassword(
    @Body() updatePasswordDto: UpdatePasswordDto,
    @UserParams() user,
  ) {
    await this.usersService.updatePassword(user.id, updatePasswordDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
