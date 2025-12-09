import { Button } from '@/lib/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/lib/components/ui/dropdown-menu';
import { ELocales } from '@/i18n';
import { useLanguageStore } from '@/lib/store/useLanguageStore';
import { Languages } from 'lucide-react';
import { LanguagesLabels } from '@/lib/constants/Language.constants';

export const LanguageSelect = () => {
  const setLanguage = useLanguageStore((state) => state.setLanguage);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Languages />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.values(ELocales).map((language) => (
          <DropdownMenuItem onClick={() => setLanguage(language)} key={language}>
            {LanguagesLabels[language]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
