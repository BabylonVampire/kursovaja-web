import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from 'src/users/users.module';
import { User } from 'src/users/entities/user.entity';
import { Topic } from './entities/topic.entity';
import { TopicsController } from './topics.controller';
import { TopicsService } from './topics.service';

@Module({
  imports: [SequelizeModule.forFeature([Topic, User]), UsersModule],
  controllers: [TopicsController],
  providers: [TopicsService],
})
export class TopicsModule {}
