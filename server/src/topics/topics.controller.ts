import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { GetCurrentUserId } from 'src/auth/decorators';
import { ATGuard } from 'src/auth/guards';
import { UsersService } from 'src/users/users.service';
import { CreateTopicDto } from './dto/create-topic.dto';
import { TopicsService } from './topics.service';

@UseGuards(ATGuard)
@Controller('topics')
export class TopicsController {
  constructor(
    private readonly topicsService: TopicsService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  async create(@GetCurrentUserId() userId: string, @Body() createTopicDto: CreateTopicDto) {
    const user = await this.usersService.findOne(userId);
    return this.topicsService.create(user, createTopicDto);
  }

  @Get('visible')
  async getVisible(@GetCurrentUserId() userId: string) {
    const user = await this.usersService.findOne(userId);
    return this.topicsService.getVisibleTopics(user);
  }

  @Get('teacher/mine')
  async getTeacherTopics(@GetCurrentUserId() userId: string) {
    const user = await this.usersService.findOne(userId);
    return this.topicsService.getTeacherTopicsWithStudents(user);
  }
}
