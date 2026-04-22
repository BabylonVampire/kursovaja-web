import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '@/lib/api';
import { Button } from '@/lib/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/lib/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/lib/components/ui/form';
import { Input } from '@/lib/components/ui/input';
import { Textarea } from '@/lib/components/ui/textarea';
import { useAuthStore } from '@/lib/store';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Navigate } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';
import styles from './TeacherTopicsPage.module.scss';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/lib/components/ui/table';

const topicSchema = z.object({
  title: z.string().min(2, 'Минимум 2 символа'),
  description: z.string().optional(),
  subject: z.string().min(2, 'Минимум 2 символа'),
  course: z.coerce.number().min(1, 'Минимум 1').max(6, 'Максимум 6'),
  targetGroups: z.array(z.string()).min(1, 'Укажите хотя бы одну группу'),
});

type TTopicForm = z.infer<typeof topicSchema>;

const TeacherTopicsPage = () => {
  const userData = useAuthStore((state) => state.userData);
  const [isCreateFormVisible, setIsCreateFormVisible] = useState(false);
  const [availableGroups, setAvailableGroups] = useState<string[]>([]);
  const [groupSearch, setGroupSearch] = useState('');
  const [createdTopics, setCreatedTopics] = useState<
    Array<{
      id: string;
      title: string;
      description?: string | null;
      subject: string;
      course: number;
      targetGroups: string[];
      studentsByGroup: Array<{
        group: string;
        students: Array<{ id: string; name?: string | null; surname?: string | null; email: string }>;
      }>;
    }>
  >([]);

  const isTeacherPageVisible = useMemo(() => userData?.role === 'teacher', [userData?.role]);

  const form = useForm<TTopicForm>({
    resolver: zodResolver(topicSchema),
    defaultValues: {
      title: '',
      description: '',
      subject: '',
      course: 1,
      targetGroups: [],
    },
  });

  const selectedGroups = form.watch('targetGroups');

  useEffect(() => {
    const PREFIX = import.meta.env.PREFIX ?? 'apiv1';
    api
      .get(`/${PREFIX}/groups`)
      .then((response) => {
        const groups = Array.isArray(response.data) ? response.data : [];
        setAvailableGroups(groups.map((item: { name: string }) => item.name));
      })
      .catch(() => setAvailableGroups([]));
  }, []);

  const loadTeacherTopics = () => {
    const PREFIX = import.meta.env.PREFIX ?? 'apiv1';
    api
      .get(`/${PREFIX}/topics/teacher/mine`)
      .then((response) => {
        const topics = Array.isArray(response.data) ? response.data : [];
        setCreatedTopics(topics);
      })
      .catch(() => setCreatedTopics([]));
  };

  useEffect(() => {
    loadTeacherTopics();
  }, []);

  if (!isTeacherPageVisible) {
    return <Navigate to="/" replace />;
  }

  const onSubmit = async (values: TTopicForm) => {
    const PREFIX = import.meta.env.PREFIX ?? 'apiv1';

    const response = await api
      .post(`/${PREFIX}/topics`, {
        title: values.title,
        description: values.description?.trim() || null,
        subject: values.subject.trim(),
        course: values.course,
        targetGroups: values.targetGroups,
      })
      .catch(() => null);

    if (!response?.data) {
      toast.error('Не удалось создать тему');
      return;
    }

    toast.success('Тема создана');
    form.reset();
    setGroupSearch('');
    loadTeacherTopics();
  };

  const filteredGroups = availableGroups.filter((group) =>
    group.toLowerCase().includes(groupSearch.toLowerCase()),
  );

  const toggleGroup = (groupName: string) => {
    if (selectedGroups.includes(groupName)) {
      form.setValue(
        'targetGroups',
        selectedGroups.filter((group) => group !== groupName),
        { shouldValidate: true },
      );
      return;
    }

    form.setValue('targetGroups', [...selectedGroups, groupName], { shouldValidate: true });
  };

  return (
    <div className={styles.wrapper}>
      <Card className={styles.card}>
        <CardHeader>
          <CardTitle>Темы преподавателя</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={styles.createTopicControls}>
            <Button type="button" onClick={() => setIsCreateFormVisible((prev) => !prev)}>
              {isCreateFormVisible ? 'Скрыть форму создания' : 'Создать новую тему'}
            </Button>
          </div>

          {isCreateFormVisible && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className={styles.form}>
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Название темы</FormLabel>
                      <FormControl>
                        <Input placeholder="Тема лекции" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Описание</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Краткое описание темы" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Предмет</FormLabel>
                      <FormControl>
                        <Input placeholder="Математика" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="course"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Курс</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          max={6}
                          value={field.value}
                          onChange={(event) => field.onChange(Number(event.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="targetGroups"
                  render={() => (
                    <FormItem>
                      <FormLabel>Группы</FormLabel>
                      <Input
                        value={groupSearch}
                        onChange={(event) => setGroupSearch(event.target.value)}
                        placeholder="Поиск группы"
                      />
                      <div className={styles.groupsList}>
                        {filteredGroups.map((group) => {
                          const isSelected = selectedGroups.includes(group);
                          return (
                            <Button
                              key={group}
                              type="button"
                              variant={isSelected ? 'default' : 'outline'}
                              onClick={() => toggleGroup(group)}
                            >
                              {group}
                            </Button>
                          );
                        })}
                      </div>
                      {selectedGroups.length > 0 && (
                        <div className={styles.selectedGroups}>
                          {selectedGroups.map((group) => (
                            <Button
                              key={group}
                              type="button"
                              size="sm"
                              variant="secondary"
                              onClick={() => toggleGroup(group)}
                            >
                              {group} x
                            </Button>
                          ))}
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit">Создать тему</Button>
              </form>
            </Form>
          )}

          <div className={styles.topicsSection}>
            <h3 className={styles.topicsTitle}>Существующие темы</h3>
            {createdTopics.length === 0 && <div>Пока нет созданных тем</div>}
            {createdTopics.map((topic) => (
              <Card key={topic.id} className={styles.topicCard}>
                <CardHeader>
                  <CardTitle>
                    {topic.title} ({topic.subject}, {topic.course} курс)
                  </CardTitle>
                </CardHeader>
                <CardContent className={styles.topicContent}>
                  <div>{topic.description || 'Без описания'}</div>
                  <div>Группы: {topic.targetGroups.join(', ')}</div>
                  {topic.studentsByGroup.map((groupItem) => (
                    <details key={`${topic.id}-${groupItem.group}`} className={styles.groupDetails}>
                      <summary className={styles.groupSummary}>
                        {groupItem.group} ({groupItem.students.length})
                      </summary>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>ФИО</TableHead>
                            <TableHead>Email</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {groupItem.students.length === 0 && (
                            <TableRow>
                              <TableCell>Нет студентов</TableCell>
                              <TableCell>-</TableCell>
                            </TableRow>
                          )}
                          {groupItem.students.map((student) => (
                            <TableRow key={student.id}>
                              <TableCell>
                                {`${student.surname || ''} ${student.name || ''}`.trim() || 'Без имени'}
                              </TableCell>
                              <TableCell>{student.email}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </details>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherTopicsPage;
