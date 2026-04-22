import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GetCurrentUserId } from 'src/auth/decorators';
import { ATGuard } from 'src/auth/guards';
import { GroupsService } from 'src/groups/groups.service';
import { UserRole } from './entities/user-role.enum';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@UseGuards(ATGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly groupsService: GroupsService,
  ) {}

  @Get('me')
  getCurrentUser(@GetCurrentUserId() userId: string) {
    return this.usersService.findOne(userId);
  }

  @Patch('me')
  async updateCurrentUser(@GetCurrentUserId() userId: string, @Body() updateUserDto: UpdateUserDto) {
    const actor = await this.usersService.findOne(userId);
    let payload: UpdateUserDto = { ...updateUserDto };

    if (actor.role !== UserRole.ADMIN) {
      const { role: _role, ...restPayload } = payload;
      payload = restPayload;
    }

    if (payload.group) {
      const groupExists = await this.groupsService.existsByName(payload.group);
      if (!groupExists) {
        throw new HttpException('Такой группы не существует', HttpStatus.BAD_REQUEST);
      }
    }

    return this.usersService.update(userId, payload);
  }

  @Get()
  async getAllUsers(@GetCurrentUserId() userId: string, @Query('search') search?: string) {
    const actor = await this.usersService.findOne(userId);
    if (actor.role !== UserRole.ADMIN) {
      throw new HttpException('Недостаточно прав', HttpStatus.FORBIDDEN);
    }
    return this.usersService.findAll(search);
  }

  @Patch(':id')
  async updateByAdmin(
    @GetCurrentUserId() userId: string,
    @Param('id') targetUserId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const actor = await this.usersService.findOne(userId);
    if (actor.role !== UserRole.ADMIN) {
      throw new HttpException('Недостаточно прав', HttpStatus.FORBIDDEN);
    }

    if (updateUserDto.group) {
      const groupExists = await this.groupsService.existsByName(updateUserDto.group);
      if (!groupExists) {
        throw new HttpException('Такой группы не существует', HttpStatus.BAD_REQUEST);
      }
    }

    return this.usersService.update(targetUserId, updateUserDto);
  }
}
