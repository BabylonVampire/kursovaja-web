import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { User } from 'src/users/entities/user.entity';
import { UserRole } from 'src/users/entities/user-role.enum';
import { CreateTopicDto } from './dto/create-topic.dto';
import { Topic } from './entities/topic.entity';

@Injectable()
export class TopicsService {
  constructor(
    @InjectModel(Topic) private topicRepository: typeof Topic,
    @InjectModel(User) private userRepository: typeof User,
  ) {}

  async create(teacher: User, createTopicDto: CreateTopicDto) {
    if (teacher.role !== UserRole.TEACHER && teacher.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Только преподаватели и администраторы могут создавать темы');
    }

    return this.topicRepository.create({
      ...createTopicDto,
      teacherId: teacher.id,
    });
  }

  async getVisibleTopics(user: User) {
    if (user.role === UserRole.ADMIN) {
      return this.topicRepository.findAll({ order: [['createdAt', 'DESC']] });
    }

    if (user.role === UserRole.TEACHER) {
      return this.topicRepository.findAll({
        where: { teacherId: user.id },
        order: [['createdAt', 'DESC']],
      });
    }

    if (!user.group) {
      return [];
    }

    return this.topicRepository.findAll({
      where: {
        targetGroups: {
          [Op.contains]: [user.group],
        },
      },
      order: [['createdAt', 'DESC']],
    });
  }

  async getTeacherTopicsWithStudents(user: User) {
    if (user.role !== UserRole.TEACHER && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Только преподаватели и администраторы могут просматривать список тем');
    }

    const topics = await this.topicRepository.findAll({
      where: { teacherId: user.id },
      order: [['createdAt', 'DESC']],
    });

    const topicsWithStudents = await Promise.all(
      topics.map(async (topic) => {
        const students = await this.userRepository.findAll({
          where: {
            role: UserRole.STUDENT,
            group: {
              [Op.in]: topic.targetGroups,
            },
          },
          attributes: ['id', 'name', 'surname', 'email', 'group'],
          order: [
            ['group', 'ASC'],
            ['surname', 'ASC'],
            ['name', 'ASC'],
          ],
        });

        const studentsByGroup = topic.targetGroups.map((groupName) => ({
          group: groupName,
          students: students
            .filter((student) => student.group === groupName)
            .map((student) => ({
              id: student.id,
              name: student.name,
              surname: student.surname,
              email: student.email,
            })),
        }));

        return {
          ...topic.toJSON(),
          studentsByGroup,
        };
      }),
    );

    return topicsWithStudents;
  }
}
