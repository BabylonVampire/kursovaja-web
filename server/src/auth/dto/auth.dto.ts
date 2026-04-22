import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class AuthDto {
  @IsNotEmpty({ message: 'Не должно быть пустым' })
  @IsString({ message: 'Должно быть строкой' })
  @Length(6, 50)
  @ApiProperty({ description: 'Email пользователя', example: 'test@test.test' })
  readonly email: string;

  @IsNotEmpty({ message: 'Не должно быть пустым' })
  @IsString({ message: 'Должно быть строкой' })
  @Length(6, 50)
  @ApiProperty({ description: 'Пароль пользователя', example: 'test12' })
  readonly password: string;

  @ApiProperty({ description: 'Имя пользователя', example: 'Иван', required: false })
  readonly name?: string;

  @ApiProperty({ description: 'Фамилия пользователя', example: 'Иванов', required: false })
  readonly surname?: string;
}
