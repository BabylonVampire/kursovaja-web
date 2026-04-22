export type TUserRole = 'student' | 'teacher' | 'admin';

export type TUser = {
  id: string;
  password: string;
  email: string;
  name?: string | null;
  surname?: string | null;
  userName?: string;
  role: TUserRole;
  group?: string | null;
};
