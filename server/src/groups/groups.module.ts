import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { GroupsController } from './groups.controller';
import { Group } from './entities/group.entity';
import { GroupsService } from './groups.service';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [SequelizeModule.forFeature([Group, User])],
  controllers: [GroupsController],
  providers: [GroupsService],
  exports: [GroupsService],
})
export class GroupsModule {}
