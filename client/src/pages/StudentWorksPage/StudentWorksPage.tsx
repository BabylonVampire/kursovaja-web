import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/lib/components/ui/card';
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
import styles from './StudentWorksPage.module.scss';

type TTopic = {
  id: string;
  title: string;
  description?: string | null;
  targetGroups: string[];
};

const StudentWorksPage = () => {
  const userData = useAuthStore((state) => state.userData);
  const [topics, setTopics] = useState<TTopic[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const PREFIX = import.meta.env.PREFIX ?? 'apiv1';
    setIsLoading(true);
    api
      .get(`/${PREFIX}/topics/visible`)
      .then((response) => {
        const data = Array.isArray(response.data) ? response.data : [];
        setTopics(data);
      })
      .catch(() => setTopics([]))
      .finally(() => setIsLoading(false));
  }, []);

  if (userData?.role !== 'student') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className={styles.wrapper}>
      <Card className={styles.card}>
        <CardHeader>
          <CardTitle>Мои работы</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && <div>Загрузка...</div>}
          {!isLoading && topics.length === 0 && <div>Пока нет доступных преподавательских тем</div>}
          {!isLoading && topics.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Тема</TableHead>
                  <TableHead>Описание</TableHead>
                  <TableHead>Группы</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topics.map((topic) => (
                  <TableRow key={topic.id}>
                    <TableCell>{topic.title}</TableCell>
                    <TableCell>{topic.description || '-'}</TableCell>
                    <TableCell>{topic.targetGroups.join(', ')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentWorksPage;
