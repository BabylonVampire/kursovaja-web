import { copyToClipboard } from '@/lib/utils';
import { FC } from 'react';
import styles from '../../Coordinates.module.scss';
import { useLanguageStore } from '@/lib/store/useLanguageStore';
import { messages } from '@/i18n';

type TProps = { latLng: number[] };

export const XYComponent: FC<TProps> = ({ latLng }) => {
  const currentLanguage = useLanguageStore((state) => state.currentLanguage);
  const textLines = messages[currentLanguage];

  return (
    <>
      <div
        className={styles.infoText}
        onClick={() => copyToClipboard(String(Math.round(latLng[0])))}
      >
        <strong>{textLines.MAP_COORDINATES_WINDOW_X}</strong> : {Math.round(latLng[0] || 0)};
      </div>
      <div
        className={styles.infoText}
        onClick={() => copyToClipboard(String(Math.round(latLng[1])))}
      >
        <strong>{textLines.MAP_COORDINATES_WINDOW_Y}</strong> : {Math.round(latLng[1] || 0)};
      </div>
    </>
  );
};
