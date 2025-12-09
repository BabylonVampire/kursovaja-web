import { ELocales, messages } from '@/i18n';
import { AddLayerObject, SourceSpecification } from 'maplibre-gl';

export const DEFAULT_ZOOM = 13;
export const MINIMAL_ZOOM = 2;
export const MAXIMUM_ZOOM = 20;
export const DEFAULT_CENTER_COORDS: [number, number] = [37.617734, 55.752004];
export const DEFAULT_TILE_SIZE = 256;

export const LAST_BUILT_IN_MAP_LAYER = 'Continent labels';

export const DEFAULT_MAP_LAYER_KEY = 'defaultMapLayerKey';
export const ALLIES_ICONS_KEY = 'alliesIcons';
export const ENEMIES_ICONS_KEY = 'enemiesIcons';

export enum EMarkerTypes {
  TARGET = 'target',
  COPTER = 'copter',
  GAP = 'gap',
  POINT = 'point',
  FIRING_MEAN = 'firingMean',
}

export enum ELayers {
  YANDEX = 'yandex-layer',
  GOOGLE = 'google-layer',
  GOOGLE_HYBRID = 'google-hybrid-layer',
  GOOGLE_SAT = 'google-sat-layer',
  DEFAULT_LAYER = 'default-layer',
  HERE_HYBRID = 'here-hybrid-layer',
  HERE_SATELLITE = 'here-satellite-layer',
  ARCGIS_WORLD = 'arcgis-world-layer',
  //   YANDEX_SAT = 'yandex-sat-layer',
  //   YANDEX_ROAD = 'yandex-road-layer',
  GIS_TWO = 'gis-two-layer',
  TOPO_MAP = 'topo-map-layer',
  OPEN_TOPO_MAP = 'open-topo-map-layer',
}

export enum ESources {
  BASE = 'base-source',
  YANDEX = 'yandex-source',
  GOOGLE = 'google-source',
  GOOGLE_HYBRID = 'google-hybrid-source',
  GOOGLE_SAT = 'google-sat-source',
  HERE_HYBRID = 'here-hybrid-source',
  HERE_SATELLITE = 'here-satellite-source',
  ARCGIS_WORLD = 'arcgis-world-source',
  //   YANDEX_SAT = 'yandex-sat-source',
  //   YANDEX_ROAD = 'yandex-road-source',
  GIS_TWO = 'gis-two-source',
  TOPO_MAP = 'topo-map-source',
  OPEN_TOPO_MAP = 'open-topo-map-source',
}

export const MAP_LAYERS_SOURCES: Record<string, SourceSpecification> = {
  [ESources.BASE]: {
    type: 'raster',
    tiles: [import.meta.env.VITE_BASE_MAP_URL],
    tileSize: DEFAULT_TILE_SIZE,
  },
  [ESources.GOOGLE]: {
    type: 'raster',
    tiles: ['https://mt0.google.com//vt/lyrs=m&x={x}&y={y}&z={z}'],
    tileSize: DEFAULT_TILE_SIZE,
  },
  [ESources.GOOGLE_HYBRID]: {
    type: 'raster',
    tiles: ['https://mt0.google.com//vt/lyrs=y&x={x}&y={y}&z={z}'],
    tileSize: DEFAULT_TILE_SIZE,
  },
  [ESources.GOOGLE_SAT]: {
    type: 'raster',
    tiles: ['https://mt0.google.com//vt/lyrs=s&x={x}&y={y}&z={z}'],
    tileSize: DEFAULT_TILE_SIZE,
  },
  [ESources.YANDEX]: {
    type: 'raster',
    tiles: [
      'https://core-renderer-tiles.maps.yandex.net/tiles?l=map&v=3.1025.0&x={x}&y={y}&z={z}&scale=1&projection=web_mercator',
    ],
    tileSize: DEFAULT_TILE_SIZE,
  },
  [ESources.HERE_HYBRID]: {
    type: 'raster',
    tiles: [
      'https://2.aerial.maps.ls.hereapi.com/maptile/2.1/maptile/newest/hybrid.day/{z}/{x}/{y}/256/png8?app_id=eAdkWGYRoc4RfxVo0Z4B&app_code=TrLJuXVK62IQk0vuXFzaig&lg=rus',
    ],
    tileSize: DEFAULT_TILE_SIZE,
  },
  [ESources.HERE_SATELLITE]: {
    type: 'raster',
    tiles: [
      'https://2.aerial.maps.ls.hereapi.com/maptile/2.1/maptile/newest/satellite.day/{z}/{x}/{y}/256/png8?app_id=eAdkWGYRoc4RfxVo0Z4B&app_code=TrLJuXVK62IQk0vuXFzaig&lg=rus',
    ],
    tileSize: DEFAULT_TILE_SIZE,
  },
  [ESources.ARCGIS_WORLD]: {
    type: 'raster',
    tiles: [
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    ],
    tileSize: DEFAULT_TILE_SIZE,
  },
  //   [ESources.YANDEX_SAT]: {
  //     type: 'raster',
  //     tiles: ['https://core-sat.maps.yandex.net/tiles?l=sat&x={x}&y={y}&z={z}&scale=1&lang=ru_RU'],
  //     tileSize: DEFAULT_TILE_SIZE,
  //   },
  //   [ESources.YANDEX_ROAD]: {
  //     type: 'raster',
  //     tiles: [
  //       'https://core-renderer-tiles.maps.yandex.net/tiles?l=skl&x={x}&y={y}&z={z}&scale=1&lang=ru_RU',
  //     ],
  //     tileSize: DEFAULT_TILE_SIZE,
  //   },
  [ESources.GIS_TWO]: {
    type: 'raster',
    tiles: ['https://tile2.maps.2gis.com/tiles?x={x}&y={y}&z={z}'],
    tileSize: DEFAULT_TILE_SIZE,
  },
  [ESources.TOPO_MAP]: {
    type: 'raster',
    tiles: ['https://proxy.nakarte.me/http/88.99.52.155/tmg/{z}/{x}/{y}'],
    tileSize: DEFAULT_TILE_SIZE,
  },
  [ESources.OPEN_TOPO_MAP]: {
    type: 'raster',
    tiles: ['https://tile.opentopomap.org/{z}/{x}/{y}.png'],
    tileSize: DEFAULT_TILE_SIZE,
  },
};

export const LAYER_TO_SOURCE = {
  [ELayers.DEFAULT_LAYER]: ESources.BASE,
  [ELayers.YANDEX]: ESources.YANDEX,
  [ELayers.GOOGLE]: ESources.GOOGLE,
  [ELayers.GOOGLE_SAT]: ESources.GOOGLE_SAT,
  [ELayers.GOOGLE_HYBRID]: ESources.GOOGLE_HYBRID,
  [ELayers.HERE_HYBRID]: ESources.HERE_HYBRID,
  [ELayers.HERE_SATELLITE]: ESources.HERE_SATELLITE,
  [ELayers.ARCGIS_WORLD]: ESources.ARCGIS_WORLD,
  //   [ELayers.YANDEX_SAT]: ESources.YANDEX_SAT,
  //   [ELayers.YANDEX_ROAD]: ESources.YANDEX_ROAD,
  [ELayers.GIS_TWO]: ESources.GIS_TWO,
  [ELayers.TOPO_MAP]: ESources.TOPO_MAP,
  [ELayers.OPEN_TOPO_MAP]: ESources.OPEN_TOPO_MAP,
};

export const MAP_LAYERS_PARAMS: Record<ELayers, AddLayerObject> = {
  [ELayers.GOOGLE]: {
    id: ELayers.GOOGLE,
    type: 'raster',
    source: ESources.GOOGLE,
    minzoom: MINIMAL_ZOOM,
    maxzoom: MAXIMUM_ZOOM + 1,
  },
  [ELayers.GOOGLE_HYBRID]: {
    id: ELayers.GOOGLE_HYBRID,
    type: 'raster',
    source: ESources.GOOGLE_HYBRID,
    minzoom: MINIMAL_ZOOM,
    maxzoom: MAXIMUM_ZOOM + 1,
  },
  [ELayers.GOOGLE_SAT]: {
    id: ELayers.GOOGLE_SAT,
    type: 'raster',
    source: ESources.GOOGLE_SAT,
    minzoom: MINIMAL_ZOOM,
    maxzoom: MAXIMUM_ZOOM + 1,
  },
  [ELayers.YANDEX]: {
    id: ELayers.YANDEX,
    type: 'raster',
    source: ESources.YANDEX,
    minzoom: MINIMAL_ZOOM,
    maxzoom: MAXIMUM_ZOOM + 1,
  },
  [ELayers.DEFAULT_LAYER]: {
    id: ELayers.DEFAULT_LAYER,
    type: 'raster',
    source: ESources.BASE,
    minzoom: MINIMAL_ZOOM,
    maxzoom: MAXIMUM_ZOOM + 1,
  },
  [ELayers.HERE_HYBRID]: {
    id: ELayers.HERE_HYBRID,
    type: 'raster',
    source: ESources.HERE_HYBRID,
    minzoom: MINIMAL_ZOOM,
    maxzoom: MAXIMUM_ZOOM + 1,
  },
  [ELayers.HERE_SATELLITE]: {
    id: ELayers.HERE_SATELLITE,
    type: 'raster',
    source: ESources.HERE_SATELLITE,
    minzoom: MINIMAL_ZOOM,
    maxzoom: MAXIMUM_ZOOM + 1,
  },
  [ELayers.ARCGIS_WORLD]: {
    id: ELayers.ARCGIS_WORLD,
    type: 'raster',
    source: ESources.ARCGIS_WORLD,
    minzoom: MINIMAL_ZOOM,
    maxzoom: MAXIMUM_ZOOM + 1,
  },
  //   [ELayers.YANDEX_SAT]: {
  //     id: ELayers.YANDEX_SAT,
  //     type: 'raster',
  //     source: ESources.YANDEX_SAT,
  //     minzoom: MINIMAL_ZOOM,
  //     maxzoom: MAXIMUM_ZOOM + 1,
  //   },
  //   [ELayers.YANDEX_ROAD]: {
  //     id: ELayers.YANDEX_ROAD,
  //     type: 'raster',
  //     source: ESources.YANDEX_ROAD,
  //     minzoom: MINIMAL_ZOOM,
  //     maxzoom: MAXIMUM_ZOOM + 1,
  //   },
  [ELayers.GIS_TWO]: {
    id: ELayers.GIS_TWO,
    type: 'raster',
    source: ESources.GIS_TWO,
    minzoom: MINIMAL_ZOOM,
    maxzoom: MAXIMUM_ZOOM + 1,
  },
  [ELayers.TOPO_MAP]: {
    id: ELayers.TOPO_MAP,
    type: 'raster',
    source: ESources.TOPO_MAP,
    minzoom: MINIMAL_ZOOM,
    maxzoom: MAXIMUM_ZOOM + 1,
  },
  [ELayers.OPEN_TOPO_MAP]: {
    id: ELayers.OPEN_TOPO_MAP,
    type: 'raster',
    source: ESources.OPEN_TOPO_MAP,
    minzoom: MINIMAL_ZOOM,
    maxzoom: MAXIMUM_ZOOM + 1,
  },
};

export const MAP_LAYERS = (language: ELocales) => [
  {
    value: ELayers.DEFAULT_LAYER,
    label: messages[language].MAP_LAYERS_TYPES_DEFAULT,
  },
  {
    value: ELayers.GOOGLE_HYBRID,
    label: 'Google Hybrid',
  },
  {
    value: ELayers.HERE_HYBRID,
    label: 'Here Hybrid',
  },
  {
    value: ELayers.GOOGLE_SAT,
    label: 'Google Sat',
  },
  {
    value: ELayers.HERE_SATELLITE,
    label: 'Here Satellite',
  },
  {
    value: ELayers.ARCGIS_WORLD,
    label: 'ArcGIS World',
  },
  //   {
  //     value: ELayers.YANDEX_SAT,
  //     label: 'Yandex Satellite',
  //   },
  {
    value: ELayers.GOOGLE,
    label: 'Google',
  },
  {
    value: ELayers.YANDEX,
    label: 'Yandex',
  },
  //   {
  //     value: ELayers.YANDEX_ROAD,
  //     label: 'Yandex Roads',
  //   },
  {
    value: ELayers.GIS_TWO,
    label: '2GIS',
  },
  {
    value: ELayers.TOPO_MAP,
    label: 'Topo Map',
  },
  {
    value: ELayers.OPEN_TOPO_MAP,
    label: 'Open Topo Map',
  },
];

export enum EContentLayers {
  LBS = 'lbs-layer',
}

export enum EContentSources {
  LBS = 'lbs-source',
}

export const CONTENT_LAYERS = (
  language: ELocales,
  fileNames: Record<EFileTypes, string> | null,
) => [
  {
    value: EContentLayers.LBS,
    label: messages[language].MAP_CONTENT_LAYERS_TYPES_LBS,
    description: fileNames?.[EFileTypes.LBS],
  },
];

export const CONTENT_LAYERS_PARAMS: Record<EContentLayers, AddLayerObject> = {
  [EContentLayers.LBS]: {
    id: EContentLayers.LBS,
    source: EContentSources.LBS,
    type: 'line',
    paint: {
      'line-color': '#FF0000',
      'line-width': 2,
    },
  },
};

export const DEFAULT_CONTENT_LAYERS = [EContentLayers.LBS];

export enum EFileTypes {
  LBS = 'lbs',
}
