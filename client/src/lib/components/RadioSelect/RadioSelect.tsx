import classNames from 'classnames';
import { FC, useEffect, useRef, useState } from 'react';
import styles from './RadioSelect.module.scss';

type TRadioSelectProps = {
  defaultValue?: any;
  icon: React.ReactNode;
  onChange?: (value: any) => void;
  items: {
    label?: string;
    icon?: React.ReactNode;
    value: any;
  }[];
} & Partial<HTMLDivElement>;

export const RadioSelect: FC<TRadioSelectProps> = ({
  defaultValue = null,
  icon,
  items,
  onChange,
  ...props
}) => {
  const [isShowSelect, setIsShowSelect] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<any>(defaultValue);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const toggleSelect = () => {
    setIsShowSelect((prev) => !prev);
  };

  const handleSelect = (value: any) => {
    if (selectedItem !== value) {
      onChange?.(value);
      setSelectedItem(value);
    }
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
        {items.map((selectItem) => (
          <button
            key={selectItem.value}
            className={classNames(styles.selectButton, {
              [styles.selectButtonActive]: selectItem.value === selectedItem,
            })}
            onClick={() => handleSelect(selectItem.value)}
          >
            {selectItem.icon && selectItem.icon}
            {selectItem.label && <p className={styles.selectItemLabel}>{selectItem.label}</p>}
          </button>
        ))}
      </div>
    </div>
  );
};
