import { X } from 'lucide-react';
import { FC, PropsWithChildren, useEffect, useRef, useState } from 'react';
import styles from './ModalWindow.module.scss';

type TModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
};

export const ModalWindow: FC<PropsWithChildren<TModalProps>> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  //   useEffect(() => {
  //     const handleClickOutside = (event: MouseEvent) => {
  //       if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
  //         onClose();
  //       }
  //     };

  //     if (isVisible) {
  //       document.addEventListener('mousedown', handleClickOutside);
  //     } else {
  //       document.removeEventListener('mousedown', handleClickOutside);
  //     }

  //     return () => {
  //       document.removeEventListener('mousedown', handleClickOutside);
  //     };
  //   }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      className={`${styles.modalContent} ${isOpen ? styles.contentVisible : ''}`}
      onClick={(e) => e.stopPropagation()}
      ref={wrapperRef}
    >
      {title && <div className={styles.modalTitle}>{title}</div>}
      <button className={styles.closeButton} onClick={onClose}>
        <X />
      </button>
      <div className={styles.contentWrapper}>{children}</div>
    </div>
  );
};
