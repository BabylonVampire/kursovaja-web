import { create } from 'zustand';
import { TTrackingStore } from '../types/TTrackingStore';
import { api } from '../api';
import { ACCESS_TOKEN_KEY, SESSION_ID_KEY } from '../constants';
import * as CryptoJS from 'crypto-js';

export const useTrackingStore = create<TTrackingStore>()((set) => ({
  currentGroupName: null,
  generateNewSecret: async () => {
    const { data: newSecret } = await api.post(
      '/apiv1/tracking/generateSecret',
      {},
      {
        headers: {
          accessToken: localStorage.getItem(ACCESS_TOKEN_KEY),
          sessionId: sessionStorage.getItem(SESSION_ID_KEY),
        },
      },
    );
    return newSecret;
  },
  decodeTracking: (encryptedTracking: string, secret: string) => {
    const bytes = CryptoJS.AES.decrypt(encryptedTracking, secret);
    const jsonString = bytes.toString(CryptoJS.enc.Utf8);
    return jsonString;
  },
  encodeTracking: (trackingString: string, secret: string) => {
    const encrypted = CryptoJS.AES.encrypt(trackingString, secret).toString();
    return encrypted;
  },
  getTracking: async (groupName: string) => {
    const trackingResponse = await api.post(
      `/apiv1/tracking/getTracking`,
      {
        groupName: groupName,
      },
      {
        headers: {
          accessToken: localStorage.getItem(ACCESS_TOKEN_KEY),
          sessionId: sessionStorage.getItem(SESSION_ID_KEY),
        },
      },
    );
    return trackingResponse.data;
  },
  authInGroup: async (groupName: string, password: string) => {
    const trackingResponse = await api
      .post(
        `/apiv1/tracking/joinRoom`,
        {
          groupName: groupName,
          password: password,
        },
        {
          headers: {
            accessToken: localStorage.getItem(ACCESS_TOKEN_KEY),
            sessionId: sessionStorage.getItem(SESSION_ID_KEY),
          },
        },
      )
      .catch(() => null);

    if (trackingResponse?.data) {
      set({ currentGroupName: groupName });
    }
    return trackingResponse?.data;
  },
}));
