export enum EUserRole {
  STUDENT = 'student',
  TEACHER = 'teacher',
  ADMIN = 'admin',
}

export const ROLES_LABELS = {
  [EUserRole.STUDENT]: 'Студент',
  [EUserRole.TEACHER]: 'Преподаватель',
  [EUserRole.ADMIN]: 'Администратор',
};