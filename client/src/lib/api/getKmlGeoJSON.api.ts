import { api } from '@/lib/api';
import { ACCESS_TOKEN_KEY, SESSION_ID_KEY } from '@/lib/constants';
import * as CryptoJS from 'crypto-js';

export const getKmlGeoJSON = async () => {
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

  const { data: response } = await api.get(`/apiv1/kml`, {
    headers: {
      'access-token': localStorage.accessToken,
      'sessionId': sessionStorage.getItem(SESSION_ID_KEY),
    },
  });

  const bytes = CryptoJS.AES.decrypt(response, newSecret);
  const jsonString = bytes.toString(CryptoJS.enc.Utf8);

  return JSON.parse(jsonString);
};
