import { toast } from 'sonner';
import { ELocales, messages } from '@/i18n';
import { PREFERRED_LANGUAGE_KEY } from '../constants';

export const copyToClipboard = (textForCopy: string, setCopySuccess?: (value: boolean) => void) => {
  navigator.clipboard
    .writeText(textForCopy)
    .then(() => {
      const currentLanguage = localStorage.getItem(PREFERRED_LANGUAGE_KEY);
      const textLines = messages[currentLanguage as ELocales];
      toast(textLines.ALERT_MESSAGE_SUCCESSFUL_COPYING);
      setCopySuccess?.(true);
    })
    .catch((err) => {
      console.error('Ошибка при копировании: ', err);
    });
};
