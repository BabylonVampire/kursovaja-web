import { api } from '@/lib/api';
import { Button } from '@/lib/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/lib/components/ui/card';
import { Input } from '@/lib/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/lib/components/ui/table';
import { useAuthStore } from '@/lib/store';
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'sonner';
import styles from './AdminGroupsPage.module.scss';

type TGroup = {
  id: string;
  name: string;
  usersCount: number;
};

const AdminGroupsPage = () => {
  const userData = useAuthStore((state) => state.userData);
  const [groups, setGroups] = useState<TGroup[]>([]);
  const [groupName, setGroupName] = useState('');

  const PREFIX = import.meta.env.PREFIX ?? 'apiv1';

  const loadGroups = async () => {
    const response = await api.get(`/${PREFIX}/groups`).catch(() => null);
    if (!response?.data) {
      return;
    }
    setGroups(response.data);
  };

  useEffect(() => {
    loadGroups();
  }, []);

  if (userData?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const onCreateGroup = async () => {
    const normalized = groupName.trim();
    if (!normalized) {
      toast.error('Введите название группы');
      return;
    }

    const response = await api.post(`/${PREFIX}/groups`, { name: normalized }).catch(() => null);
    if (!response?.data) {
      toast.error('Не удалось создать группу');
      return;
    }

    toast.success('Группа добавлена');
    setGroupName('');
    loadGroups();
  };

  return (
    <div className={styles.wrapper}>
      <Card className={styles.card}>
        <CardHeader>
          <CardTitle>Управление группами</CardTitle>
        </CardHeader>
        <CardContent className={styles.content}>
          <div className={styles.createGroupRow}>
            <Input
              value={groupName}
              onChange={(event) => setGroupName(event.target.value)}
              placeholder="Название группы"
            />
            <Button onClick={onCreateGroup}>Добавить</Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Группа</TableHead>
                <TableHead>Количество пользователей</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groups.map((group) => (
                <TableRow key={group.id}>
                  <TableCell>{group.name}</TableCell>
                  <TableCell>{group.usersCount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminGroupsPage;
