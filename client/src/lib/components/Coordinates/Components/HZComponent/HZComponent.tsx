import { copyToClipboard } from '@/lib/utils';
import styles from '../../Coordinates.module.scss';
import { FC } from 'react';
import { useLanguageStore } from '@/lib/store/useLanguageStore';
import { messages } from '@/i18n';

type TProps = {
  map: maplibregl.Map | null;
};

export const HZComponent: FC<TProps> = ({ map }) => {
  const currentLanguage = useLanguageStore((state) => state.currentLanguage);
  const textLines = messages[currentLanguage];

  return (
    <div
      className={styles.infoText}
      onClick={() => copyToClipboard(String(Math.round(+(map?.getZoom() || 0))))}
    >
      <strong>{textLines.MAP_COORDINATES_WINDOW_H}</strong> : {0};
      <strong style={{ marginLeft: 5 }}>{textLines.MAP_COORDINATES_WINDOW_Z}</strong> :{' '}
      {Math.round(+(map?.getZoom() || 0))};
    </div>
  );
};
