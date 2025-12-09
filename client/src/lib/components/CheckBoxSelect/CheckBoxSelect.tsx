import classNames from 'classnames';
import { FC, useEffect, useRef, useState } from 'react';
import styles from './CheckBoxSelect.module.scss';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/lib/components/ui/tooltip';

type TCheckBoxSelectProps = {
  defaultValue?: any[];
  icon: React.ReactNode;
  onChange?: (value: any) => void;
  items: {
    label?: string;
    description?: string;
    value: any;
  }[];
} & Partial<HTMLDivElement>;

export const CheckBoxSelect: FC<TCheckBoxSelectProps> = ({
  icon,
  items,
  onChange,
  defaultValue = [],
  ...props
}) => {
  const [isShowSelect, setIsShowSelect] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<any[]>(defaultValue);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const toggleSelect = () => {
    setIsShowSelect((prev) => !prev);
  };

  const handleSelect = (value: any) => {
    if (selectedItem.includes(value)) {
      setSelectedItem((prev) => prev.filter((item) => item !== value));
    } else {
      setSelectedItem((prev) => [...prev, value]);
    }
    onChange?.(value);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsShowSelect(false);
      }
    };

    if (isShowSelect) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isShowSelect]);

  return (
    <div className={classNames(styles.checkBoxWrapper, props.className)} ref={wrapperRef}>
      <button
        className={classNames(
          styles.checkBoxSelect,
          { [styles.checkBoxSelectActive]: isShowSelect },
          props.className,
        )}
        onClick={toggleSelect}
      >
        {icon}
      </button>
      <div className={classNames(styles.selectList, { [styles.selectListActive]: isShowSelect })}>
        <TooltipProvider>
          {items.map((selectItem) => (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  key={selectItem.value}
                  className={classNames(styles.selectButton, {
                    [styles.selectButtonActive]: selectedItem.includes(selectItem.value),
                  })}
                  onClick={() => handleSelect(selectItem.value)}
                >
                  {selectItem.label && <p className={styles.selectItemLabel}>{selectItem.label}</p>}
                </button>
              </TooltipTrigger>
              {selectItem.description && (
                <TooltipContent>
                  <p>{selectItem.description}</p>
                </TooltipContent>
              )}
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>
    </div>
  );
};
