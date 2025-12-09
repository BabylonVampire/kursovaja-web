import proj4 from 'proj4';

proj4.defs(
  'EPSG:3857',
  '+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext +no_defs',
);

export const xyzToLatLng = (x: number, y: number): [number, number] => {
  // Преобразуем из EPSG:3857 в WGS84 (EPSG:4326)
  const [longitude, latitude] = proj4('EPSG:3857', 'EPSG:4326', [x, y]);
  return [latitude, longitude];
};
