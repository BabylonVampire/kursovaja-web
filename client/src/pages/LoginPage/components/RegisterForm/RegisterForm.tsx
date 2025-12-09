import { useAuthStore } from '@/lib/store';
import { FC, useState } from 'react';
import styles from './RegisterForm.module.scss';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/lib/components/ui/button';
import { Loader2 } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/lib/components/ui/form';
import { Input } from '@/lib/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { useLanguageStore } from '@/lib/store/useLanguageStore';
import { messages } from '@/i18n';
import { EFormValues, PASSWORD_LENGTH } from './RegisterForm.constants';

type TProps = {
  setAuthMode: (mode: string) => void;
};

const RegisterForm: FC<TProps> = ({ setAuthMode }) => {
  const register = useAuthStore((state) => state.register);
  const setIsAuthorized = useAuthStore((state) => state.setIsAuthorized);

  const currentLanguage = useLanguageStore((state) => state.currentLanguage);
  const textLines = messages[currentLanguage];

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const formSchema = z.object({
    [EFormValues.EMAIL]: z.string().email({ message: textLines.AUTH_FORM_EMAIL_INVALID }),
    [EFormValues.PASSWORD]: z.string().min(PASSWORD_LENGTH, {
      message: `${textLines.AUTH_FORM_PASSWORD_RULE} ${PASSWORD_LENGTH}`,
    }),
    [EFormValues.REPEAT_PASSWORD]: z.string().min(PASSWORD_LENGTH, {
      message: `${textLines.AUTH_FORM_PASSWORD_RULE} ${PASSWORD_LENGTH}`,
    }),
    [EFormValues.NAME]: z.string(),
    [EFormValues.SURNAME]: z.string(),
    [EFormValues.FATHER_NAME]: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      [EFormValues.EMAIL]: '',
      [EFormValues.PASSWORD]: '',
      [EFormValues.REPEAT_PASSWORD]: '',
      [EFormValues.NAME]: '',
      [EFormValues.SURNAME]: '',
      [EFormValues.FATHER_NAME]: '',
    },
  });

  const handleReg = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await register({ password: values.password, email: values.email });

      if (response) {
        setIsAuthorized(true);
        navigate('/');
      } else {
        setErrorMessage(textLines.AUTH_FORM_ERROR_MESSAGE);
      }
    } catch (error) {
      setErrorMessage(textLines.AUTH_FORM_ERROR_MESSAGE);
    } finally {
      setIsLoading(false);
    }
  };

  const isButtonDisabled =
    !form.watch(EFormValues.EMAIL) ||
    form.watch(EFormValues.PASSWORD).length < PASSWORD_LENGTH ||
    isLoading ||
    form.watch(EFormValues.PASSWORD) !== form.watch(EFormValues.REPEAT_PASSWORD);

  return (
    <div className={styles.container}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleReg)} className="space-y-8">
          <FormLabel className={styles.formTitle}>Зарегистрироваться</FormLabel>
          <FormField
            control={form.control}
            name={EFormValues.EMAIL}
            render={({ field }) => (
              <FormItem className={styles.formItem}>
                <FormLabel>{textLines.AUTH_FORM_EMAIL}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={textLines.AUTH_FORM_EMAIL_PLACEHOLDER}
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={EFormValues.NAME}
            render={({ field }) => (
              <FormItem className={styles.formItem}>
                <FormLabel>{textLines.AUTH_FORM_NAME}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={textLines.AUTH_FORM_NAME_PLACEHOLDER}
                    type="name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={EFormValues.SURNAME}
            render={({ field }) => (
              <FormItem className={styles.formItem}>
                <FormLabel>{textLines.AUTH_FORM_SURNAME}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={textLines.AUTH_FORM_SURNAME_PLACEHOLDER}
                    type="name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={EFormValues.FATHER_NAME}
            render={({ field }) => (
              <FormItem className={styles.formItem}>
                <FormLabel>{textLines.AUTH_FORM_FATHER_NAME}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={textLines.AUTH_FORM_FATHER_NAME_PLACEHOLDER}
                    type="name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={EFormValues.PASSWORD}
            render={({ field }) => (
              <FormItem className={styles.formItem}>
                <FormLabel>{textLines.AUTH_FORM_PASSWORD}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={textLines.AUTH_FORM_PASSWORD_PLACEHOLDER}
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={EFormValues.REPEAT_PASSWORD}
            render={({ field }) => (
              <FormItem className={styles.formItem}>
                <FormLabel>{textLines.AUTH_FORM_PASSWORD}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={textLines.AUTH_FORM_PASSWORD_PLACEHOLDER}
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {errorMessage && <div className={styles.errorAuth}>{errorMessage}</div>}

          <Button type="submit" disabled={isButtonDisabled} className={styles.regButton}>
            {isLoading ? (
              <>
                <Loader2 className="animate-spin mr-2" />
                {textLines.AUTH_FORM_LOADING}
              </>
            ) : (
              'Зарегистрироваться'
            )}
          </Button>
          <Button type="submit" onClick={() => setAuthMode('login')}>
            Войти
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default RegisterForm;
