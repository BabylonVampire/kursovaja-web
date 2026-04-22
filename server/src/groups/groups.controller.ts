import { Body, Controller, Get, HttpException, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { GetCurrentUserId } from 'src/auth/decorators';
import { ATGuard } from 'src/auth/guards';
import { User } from 'src/users/entities/user.entity';
import { UserRole } from 'src/users/entities/user-role.enum';
import { CreateGroupDto } from './dto/create-group.dto';
import { GroupsService } from './groups.service';

@UseGuards(ATGuard)
@Controller('groups')
export class GroupsController {
  constructor(
    private readonly groupsService: GroupsService,
    @InjectModel(User) private userRepository: typeof User,
  ) {}

  @Get()
  findAll() {
    return this.groupsService.findAll();
  }

  @Post()
  async create(@GetCurrentUserId() userId: string, @Body() createGroupDto: CreateGroupDto) {
    const actor = await this.userRepository.findByPk(userId);
    if (!actor) {
      throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
    }
    if (actor.role !== UserRole.ADMIN) {
      throw new HttpException('Недостаточно прав', HttpStatus.FORBIDDEN);
    }
    return this.groupsService.create(createGroupDto);
  }
}
