import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/users/entities/user.entity';
import { CreateGroupDto } from './dto/create-group.dto';
import { Group } from './entities/group.entity';

@Injectable()
export class GroupsService {
  constructor(
    @InjectModel(Group) private groupRepository: typeof Group,
    @InjectModel(User) private userRepository: typeof User,
  ) {}

  async create(createGroupDto: CreateGroupDto) {
    const normalizedName = createGroupDto.name.trim();
    const existing = await this.groupRepository.findOne({ where: { name: normalizedName } });
    if (existing) {
      throw new HttpException('Группа уже существует', HttpStatus.BAD_REQUEST);
    }
    return this.groupRepository.create({ name: normalizedName });
  }

  async findAll() {
    const groups = await this.groupRepository.findAll({ order: [['name', 'ASC']] });
    const groupsWithCount = await Promise.all(
      groups.map(async (group) => {
        const usersCount = await this.userRepository.count({
          where: { group: group.name },
        });
        return {
          id: group.id,
          name: group.name,
          usersCount,
        };
      }),
    );
    return groupsWithCount;
  }

  async existsByName(name: string) {
    const group = await this.groupRepository.findOne({ where: { name } });
    return Boolean(group);
  }
}
