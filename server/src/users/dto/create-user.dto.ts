import { UserRole } from '../entities/user-role.enum';

export class CreateUserDto {
  readonly email: string;
  readonly password: string;
  readonly role?: UserRole;
  readonly group?: string;
  readonly name?: string;
  readonly surname?: string;
}
