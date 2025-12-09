import { FC, useEffect, useRef, useState } from 'react';
import styles from './ButtonGroup.module.scss';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

type TButtonGroupProps = {
  icon?: React.ReactNode;
  items: {
    icon?: React.ReactNode;
    label?: string;
    onClick?: () => void;
    tooltip?: string;
  }[];
};

export const ButtonGroup: FC<TButtonGroupProps> = ({ items, icon }) => {
  const [isGroupOpened, setIsGroupOpened] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const toggleButtonGroup = () => {
    setIsGroupOpened((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsGroupOpened(false);
      }
    };

    if (isGroupOpened) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isGroupOpened]);

  return (
    <div className={styles.buttonGroupWrapper} ref={wrapperRef}>
      <TooltipProvider>
        <button className={styles.openGroupButton} onClick={toggleButtonGroup}>
          {icon ? icon : isGroupOpened ? <ChevronDown /> : <ChevronUp />}
        </button>
        {isGroupOpened && (
          <div className={styles.buttonGroup}>
            {items.map((button, index) => (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={button.onClick}
                    className={styles.buttonItem}
                    key={`${button.label}_${index}`}
                  >
                    {button.icon}
                    {button.label && <p className={styles.label}>{button.label}</p>}
                  </button>
                </TooltipTrigger>
                {button.tooltip && (
                  <TooltipContent>
                    <p>{button.tooltip}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            ))}
          </div>
        )}
      </TooltipProvider>
    </div>
  );
};
