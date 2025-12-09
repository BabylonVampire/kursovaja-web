export type TTrackingItem = {
  encryptState: string;
  fileName: string | null;
  groupName: string;
  id: string;
  initiator: string;
  typeName: string;
};

export enum EMarkerStatus {
  NEW = 'NEW',
  CHANGED = 'CHANGED',
  DELETED = 'DELETED',
}

export type TEncryptState = {
  coordinates: { h: number; x: number; y: number };
  dateCreate: string;
  description: string;
  division: string;
  historyCoordinates: [];
  id: number;
  isAllies: boolean;
  isCovered: boolean;
  isDelivered: boolean;
  isDestroyed: boolean;
  isSendTelemetry: boolean;
  isShowHistory: boolean;
  knpId: number;
  layerName: string;
  name: string;
  nameDrone: string;
  rotation: number;
  technicTypeForFM: string;
  technicTypes: string;
  technicType?: string;
  telemetryGroup: string;
};

export type TMarkerItem = {
  encryptState: TEncryptState;
  fileName: string | null;
  groupName: string;
  id: string;
  initiator: string;
  typeName: string;
};

export type TTrackingResponseItem = {
  value: TTrackingItem;
};

export type TTrackingStore = {
  currentGroupName: string | null;
  generateNewSecret: () => Promise<string>;
  decodeTracking: (encrypt: string, secret: string) => string;
  encodeTracking: (encrypt: string, secret: string) => string;
  authInGroup: (groupName: string, password: string) => Promise<string>;
  getTracking: (groupName: string) => Promise<TTrackingResponseItem[]>;
};
