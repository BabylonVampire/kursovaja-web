import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UsersController } from './users.controller';
import { GroupsModule } from 'src/groups/groups.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [SequelizeModule.forFeature([User]), forwardRef(() => AuthModule), GroupsModule],
  exports: [UsersService],
})
export class UsersModule {}
