import { messages } from '@/i18n';
import { Button } from '@/lib/components/ui/button';
import { Card, CardContent, CardFooter } from '@/lib/components/ui/card';
import { Tabs, TabsContent } from '@/lib/components/ui/tabs';
import { useLanguageStore } from '@/lib/store/useLanguageStore';
import { copyToClipboard, toDMS, fromWGS84BLToSK42xy } from '@/lib/utils';
import { ChevronsLeftRight, Copy } from 'lucide-react';
import { FC, useEffect, useState } from 'react';
import { ALatLonComponent } from './Components/ALatLonComponent/ALatLonComponent';
import { HZComponent } from './Components/HZComponent/HZComponent';
import { XYComponent } from './Components/XYComponent/XYComponent';
import { ECoordTabs } from './Coordinates.constants';
import styles from './Coordinates.module.scss';

type TCoordinatesProps = {
  map: maplibregl.Map | null;
  centerCoords: { lat: number; lng: number } | null;
};

export const Coordinates: FC<TCoordinatesProps> = ({ map, centerCoords }) => {
  const currentLanguage = useLanguageStore((state) => state.currentLanguage);
  const textLines = messages[currentLanguage];
  const [tabValue, setTabValue] = useState<string>(ECoordTabs.XYZ);

  const [latLng, setLatLng] = useState<number[]>([]);

  useEffect(() => {
    if (!centerCoords) return;

    const {x, y} = fromWGS84BLToSK42xy(centerCoords?.lat, centerCoords?.lng);

    setLatLng([x, y]);
  }, [centerCoords]);

  return (
    <Tabs className="w-[300px]" value={tabValue}>
      <TabsContent value={ECoordTabs.XYZ}>
        <Card>
          <CardContent className={styles.tabContent}>
            <div>
              <Button onClick={() => setTabValue(ECoordTabs.LAT_LNG)}>
                {textLines.MAP_COORDINATES_WINDOW_TITLE} <ChevronsLeftRight />
              </Button>
              <Button
                className={styles.copyButton}
                onClick={() =>
                  copyToClipboard(
                    `X: ${Math.round(latLng[0] || 0)}\nY: ${Math.round(latLng[1] || 0)}`,
                  )
                }
              >
                <Copy />
              </Button>
            </div>
            <XYComponent latLng={latLng} />
            <HZComponent map={map} />
          </CardContent>
          <CardFooter>
            <p className={styles.footerText}>{textLines.MAP_COORDINATES_WINDOW_FOOTER_TEXT}</p>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value={ECoordTabs.LAT_LNG}>
        <Card>
          <CardContent className={styles.tabContent}>
            <div>
              <Button onClick={() => setTabValue(ECoordTabs.XYZD)}>
                {textLines.MAP_COORDINATES_WINDOW_TITLE} <ChevronsLeftRight />
              </Button>
              <Button
                className={styles.copyButton}
                onClick={() =>
                  copyToClipboard(
                    `${textLines.MAP_COORDINATES_WINDOW_LAT}: ${centerCoords?.lat.toFixed(9)}\n${textLines.MAP_COORDINATES_WINDOW_LNG}: ${centerCoords?.lng.toFixed(9)}\nX: ${Math.round(latLng[0] || 0)}\nY: ${Math.round(latLng[1] || 0)}`,
                  )
                }
              >
                <Copy />
              </Button>
            </div>
            <ALatLonComponent map={map} centerCoords={centerCoords} />
            <XYComponent latLng={latLng} />
            <HZComponent map={map} />
          </CardContent>
          <CardFooter>
            <p className={styles.footerText}>{textLines.MAP_COORDINATES_WINDOW_FOOTER_TEXT}</p>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value={ECoordTabs.XYZD}>
        <Card>
          <CardContent className={styles.tabContent}>
            <div>
              <Button onClick={() => setTabValue(ECoordTabs.XYZ)}>
                {textLines.MAP_COORDINATES_WINDOW_TITLE} <ChevronsLeftRight />
              </Button>
              <Button
                className={styles.copyButton}
                onClick={() =>
                  copyToClipboard(
                    `${textLines.MAP_COORDINATES_WINDOW_LAT}: ${toDMS(centerCoords?.lat || 0)}\n${textLines.MAP_COORDINATES_WINDOW_LNG}: ${toDMS(centerCoords?.lng || 0)}\nX: ${Math.round(latLng[0] || 0)}\nY: ${Math.round(latLng[1] || 0)}`,
                  )
                }
              >
                <Copy />
              </Button>
            </div>
            <ALatLonComponent map={map} centerCoords={centerCoords} isDms />
            <XYComponent latLng={latLng} />
            <HZComponent map={map} />
          </CardContent>
          <CardFooter>
            <p className={styles.footerText}>{textLines.MAP_COORDINATES_WINDOW_FOOTER_TEXT}</p>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
