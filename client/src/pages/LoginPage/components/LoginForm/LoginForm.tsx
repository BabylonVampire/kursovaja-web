import { useAuthStore } from '@/lib/store';
import { FC, useState } from 'react';
import styles from './LoginForm.module.scss';
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
import { EFormValues, PASSWORD_LENGTH } from './LoginForm.constants';

type TProps = {
  setAuthMode: (mode: string) => void;
};

const LoginForm: FC<TProps> = ({ setAuthMode }) => {
  const login = useAuthStore((state) => state.login);
  const setIsAuthorized = useAuthStore((state) => state.setIsAuthorized);

  const currentLanguage = useLanguageStore((state) => state.currentLanguage);
  const textLines = messages[currentLanguage];

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const formSchema = z.object({
    email: z.string().email({ message: textLines.AUTH_FORM_EMAIL_INVALID }),
    password: z.string().min(PASSWORD_LENGTH, {
      message: `${textLines.AUTH_FORM_PASSWORD_RULE} ${PASSWORD_LENGTH}`,
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleLogin = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await login(values);

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
    !form.watch('email') || form.watch('password').length < PASSWORD_LENGTH || isLoading;

  return (
    <div className={styles.container}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-8">
          <FormLabel className={styles.formTitle}>{textLines.AUTH_FORM_TITLE}</FormLabel>
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
          {errorMessage && <div className={styles.errorAuth}>{errorMessage}</div>}

          <Button type="submit" disabled={isButtonDisabled}>
            {isLoading ? (
              <>
                <Loader2 className="animate-spin mr-2" />
                {textLines.AUTH_FORM_LOADING}
              </>
            ) : (
              textLines.AUTHORIZATION_LOGIN
            )}
          </Button>
          <Button
            type="submit"
            onClick={() => setAuthMode('register')}
            className={styles.regButton}
          >
            Зарегистрироваться
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default LoginForm;
