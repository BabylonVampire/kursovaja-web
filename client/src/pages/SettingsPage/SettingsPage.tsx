import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '@/lib/api';
import { Button } from '@/lib/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/lib/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/lib/components/ui/form';
import { Input } from '@/lib/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/lib/components/ui/select';
import { useAuthStore } from '@/lib/store';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import styles from './SettingsPage.module.scss';

const profileSchema = z.object({
  email: z.string().email('Введите корректный email'),
  name: z.string().optional(),
  surname: z.string().optional(),
  group: z.string().optional(),
});

type TProfileForm = z.infer<typeof profileSchema>;

const SettingsPage = () => {
  const userData = useAuthStore((state) => state.userData);
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const [groups, setGroups] = useState<string[]>([]);
  const [groupSearch, setGroupSearch] = useState('');

  const form = useForm<TProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      email: '',
      name: '',
      surname: '',
      group: '',
    },
  });

  const filteredGroups = useMemo(
    () => groups.filter((group) => group.toLowerCase().includes(groupSearch.toLowerCase())),
    [groupSearch, groups],
  );
  const selectedGroupValue = form.watch('group') || '';

  useEffect(() => {
    if (!userData) {
      return;
    }
    form.reset({
      email: userData.email,
      name: userData.name ?? '',
      surname: userData.surname ?? '',
      group: userData.group ?? '',
    });
  }, [userData, form]);

  useEffect(() => {
    const PREFIX = import.meta.env.PREFIX ?? 'apiv1';
    api
      .get(`/${PREFIX}/groups`)
      .then((response) => {
        const data = Array.isArray(response.data) ? response.data : [];
        setGroups(data.map((item: { name: string }) => item.name));
      })
      .catch(() => setGroups([]));
  }, []);

  const onSubmit = async (values: TProfileForm) => {
    const payload = {
      email: values.email,
      name: values.name?.trim(),
      surname: values.surname?.trim(),
      group: userData?.role === 'student' ? values.group?.trim() || null : null,
    };
    const updatedUser = await updateProfile(payload);

    if (!updatedUser) {
      toast.error('Не удалось обновить профиль');
      return;
    }

    toast.success('Профиль обновлен');
  };

  return (
    <div className={styles.wrapper}>
      <Card className={styles.card}>
        <CardHeader>
          <CardTitle>Настройки профиля</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className={styles.form}>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="user@mail.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Имя</FormLabel>
                    <FormControl>
                      <Input placeholder="Иван" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="surname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Фамилия</FormLabel>
                    <FormControl>
                      <Input placeholder="Иванов" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {userData?.role === 'student' && (
                <FormField
                  control={form.control}
                  name="group"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Учебная группа</FormLabel>
                      <Input
                        value={groupSearch}
                        onChange={(event) => setGroupSearch(event.target.value)}
                        placeholder="Поиск группы"
                      />
                      <Select onValueChange={field.onChange} value={field.value || ''}>
                        <FormControl>
                          <SelectTrigger className={styles.selectTrigger}>
                            <SelectValue placeholder="Выберите группу" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {selectedGroupValue &&
                            !filteredGroups.includes(selectedGroupValue) &&
                            groups.includes(selectedGroupValue) && (
                              <SelectItem value={selectedGroupValue}>{selectedGroupValue}</SelectItem>
                            )}
                          {filteredGroups.map((group) => (
                            <SelectItem key={group} value={group}>
                              {group}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <Button type="submit">Сохранить</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
