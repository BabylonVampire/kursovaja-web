import React from 'react';
import { LoaderCircle } from 'lucide-react';
import styles from './Loader.module.scss';
import { DEFAULT_LOADER_SIZE } from './Loader.constants';

type LoaderProps = {
  size?: number;
};

export const Loader: React.FC<LoaderProps> = ({ size = DEFAULT_LOADER_SIZE }) => {
  return (
    <div className={styles.loader}>
      <LoaderCircle size={size} />
    </div>
  );
};
