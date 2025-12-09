import { ApiProperty } from '@nestjs/swagger';
import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';

interface UserCreationAttributes {
  email: string;
  password: string;
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
