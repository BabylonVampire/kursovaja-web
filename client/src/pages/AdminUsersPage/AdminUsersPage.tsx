import { api } from '@/lib/api';
import { Button } from '@/lib/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/lib/components/ui/card';
import { Input } from '@/lib/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/lib/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/lib/components/ui/table';
import { useAuthStore } from '@/lib/store';
import { TUserRole } from '@/lib/types';
import { useEffect, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'sonner';
import styles from './AdminUsersPage.module.scss';

type TAdminUserRow = {
  id: string;
  email: string;
  name?: string | null;
  surname?: string | null;
  role: TUserRole;
  group?: string | null;
};

const AdminUsersPage = () => {
  const userData = useAuthStore((state) => state.userData);
  const [users, setUsers] = useState<TAdminUserRow[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const PREFIX = import.meta.env.PREFIX ?? 'apiv1';

  const loadUsers = async (searchValue?: string) => {
    setLoading(true);
    const response = await api
      .get(`/${PREFIX}/users`, {
        params: searchValue ? { search: searchValue } : {},
      })
      .catch(() => null);
    setLoading(false);
    if (!response?.data) {
      return;
    }
    setUsers(response.data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const onSearch = () => loadUsers(search.trim());

  const usersSorted = useMemo(
    () => [...users].sort((a, b) => `${a.surname || ''}${a.name || ''}`.localeCompare(`${b.surname || ''}${b.name || ''}`)),
    [users],
  );

  if (userData?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const onRoleChange = async (targetUserId: string, role: TUserRole) => {
    const response = await api.patch(`/${PREFIX}/users/${targetUserId}`, { role }).catch(() => null);
    if (!response?.data) {
      toast.error('Не удалось изменить роль');
      return;
    }
    toast.success('Роль обновлена');
    loadUsers(search.trim());
  };

  return (
    <div className={styles.wrapper}>
      <Card className={styles.card}>
        <CardHeader>
          <CardTitle>Пользователи</CardTitle>
        </CardHeader>
        <CardContent className={styles.content}>
          <div className={styles.searchRow}>
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Поиск по имени или фамилии"
            />
            <Button onClick={onSearch}>Найти</Button>
          </div>

          {loading && <div>Загрузка...</div>}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Имя</TableHead>
                <TableHead>Фамилия</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Роль</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usersSorted.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name || '-'}</TableCell>
                  <TableCell>{user.surname || '-'}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Select value={user.role} onValueChange={(value: TUserRole) => onRoleChange(user.id, value)}>
                      <SelectTrigger className={styles.roleSelect}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">student</SelectItem>
                        <SelectItem value="teacher">teacher</SelectItem>
                        <SelectItem value="admin">admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsersPage;
