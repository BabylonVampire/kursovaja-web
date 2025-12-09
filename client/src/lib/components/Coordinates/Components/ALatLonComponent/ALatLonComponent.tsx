import { copyToClipboard, toDMS } from '@/lib/utils';
import { FC } from 'react';
import styles from '../../Coordinates.module.scss';
import { useLanguageStore } from '@/lib/store/useLanguageStore';
import { messages } from '@/i18n';

type TProps = {
  map: maplibregl.Map | null;
  isDms?: boolean;
  centerCoords: { lat: number; lng: number } | null;
};

export const ALatLonComponent: FC<TProps> = ({ map, isDms = false, centerCoords }) => {
  const currentLanguage = useLanguageStore((state) => state.currentLanguage);
  const textLines = messages[currentLanguage];

  return (
    <>
      <div
        className={styles.infoText}
        onClick={() => copyToClipboard(String(Math.trunc(((map?.getBearing() || 0) + 360) % 360)))}
      >
        <strong>{textLines.MAP_COORDINATES_WINDOW_AZIMUTH}</strong> :{' '}
        {Math.trunc(((map?.getBearing() || 0) + 360) % 360)};
      </div>
      <div
        className={styles.infoText}
        onClick={() =>
          copyToClipboard(
            String(isDms ? toDMS(centerCoords?.lat || 0) : centerCoords?.lat.toFixed(9)),
          )
        }
      >
        <strong>{textLines.MAP_COORDINATES_WINDOW_LAT}</strong> :{' '}
        {isDms ? toDMS(centerCoords?.lat || 0) : centerCoords?.lat.toFixed(9)};
      </div>
      <div
        className={styles.infoText}
        onClick={() =>
          copyToClipboard(
            String(isDms ? toDMS(centerCoords?.lng || 0) : centerCoords?.lng.toFixed(9)),
          )
        }
      >
        <strong>{textLines.MAP_COORDINATES_WINDOW_LNG}</strong> :{' '}
        {isDms ? toDMS(centerCoords?.lng || 0) : centerCoords?.lng.toFixed(9)};
      </div>
    </>
  );
};
