import { ApiProperty } from '@nestjs/swagger';
import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { UserRole } from './user-role.enum';

interface UserCreationAttributes {
  email: string;
  password: string;
  role?: UserRole;
  group?: string | null;
  name?: string | null;
  surname?: string | null;
}

@Table({ tableName: 'users' })
export class User extends Model<User, UserCreationAttributes> {
  @ApiProperty({ description: 'ID пользователя', example: 'UUID' })
  @Column({
    type: DataType.UUID,
    unique: true,
    primaryKey: true,
    allowNull: false,
    defaultValue: () => uuidv4(),
  })
  id: string;

  @ApiProperty({ description: 'Email пользователя', example: 'user@mail.com' })
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  email: string;

  @ApiProperty({ description: 'Пароль пользователя', example: 'p4ssw0rd' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @ApiProperty({ description: 'Имя пользователя', example: 'Иван', required: false })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  name?: string | null;

  @ApiProperty({ description: 'Фамилия пользователя', example: 'Иванов', required: false })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  surname?: string | null;

  @ApiProperty({
    description: 'Роль пользователя',
    example: UserRole.STUDENT,
    enum: UserRole,
  })
  @Column({
    type: DataType.ENUM(...(Object.values(UserRole) as string[])),
    allowNull: false,
    defaultValue: UserRole.STUDENT,
  })
  role: UserRole;

  @ApiProperty({
    description: 'Учебная группа студента',
    example: 'ИВТ-21',
    required: false,
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  group?: string | null;

  @ApiProperty({ description: 'Статус пользователя', example: 'false' })
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isActivated: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  hashedRT?: string;
}
