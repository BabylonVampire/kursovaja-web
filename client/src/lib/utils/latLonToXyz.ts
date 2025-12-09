import proj4 from 'proj4';

// Определяем пользовательскую проекцию (примерные параметры)
// Вам нужно уточнить точные параметры вашей системы координат
proj4.defs(
  'EPSG:28407',
  '+proj=tmerc +lat_0=0 +lon_0=39 +k=1 +x_0=7500000 +y_0=0 +ellps=krass +towgs84=23.57,-140.95,-79.8,0,-0.35,-0.79,-0.22 +units=m +no_defs +type=crs',
);

/**
 * Преобразует широту/долготу (WGS84) в пользовательскую систему координат Москвы.
 * @param latitude - Широта в градусах (WGS84).
 * @param longitude - Долгота в градусах (WGS84).
 * @returns [x, y] в пользовательской системе координат.
 */
export const latLngToXyz = (latitude: number, longitude: number): [number, number] => {
  // Преобразуем из WGS84 (EPSG:4326) в нашу пользовательскую CRS
  const [y, x] = proj4('EPSG:4326', 'EPSG:28407', [longitude, latitude]);
  return [x, y];
};

export const fromSK42ToWGS84 = (x: number, y: number): [number, number] => {
  // Преобразуем из CK-42 (EPSG:28407) в WGS84
  const [lng, lat] = proj4('EPSG:28407', 'EPSG:4326', [y, x]);
  return [lat, lng];
};

export const fromWGS84BLToSK42xy = (b84_grad = 0, l84_grad = 0, nz = 0, h = 0) => {
  const reuseSK42Point = {
    x: 0,
    y: 0,
    n: 0,
    h: 0,
  };
  let x42;
  let y42;
  try {
    const alfa84 = 1.0 / 298.257223563;
    const alfa42 = 1.0 / 298.3;
    const a1 = 6378137.0;
    const a2 = 6378245.0;
    const e1_2 = 2 * alfa84 - alfa84 * alfa84;
    const e2_2 = 2 * alfa42 - alfa42 * alfa42;
    const H = 100.0;
    const DX = -23.9;
    const DY = 141.3;
    const DZ = 80.9;
    const OMx = 0.0;
    const OMy = 0.35;
    const OMz = 0.86;
    const m = 0.12 / 1000000.0;
    const B84_rad = (b84_grad * Math.PI) / 180.0;
    const L84_rad = (l84_grad * Math.PI) / 180.0;
    const a = 0.5 * (a1 + a2);
    const a_2 = a * a;
    const e_2 = 0.5 * (e1_2 + e2_2);
    const da = a2 - a1;
    const de_2 = e2_2 - e1_2;
    const ro = 206264.8062;
    let B;
    let L;
    let B_grad;
    let L_grad;
    let B42_grad = 0.0;
    let L42_grad = 0.0;
    for (let i = 0; i <= 1; i++) {
      if (i === 0) {
        B = B84_rad;
        L = L84_rad;
      } else {
        B_grad = 0.5 * (B42_grad + b84_grad);
        L_grad = 0.5 * (L42_grad + l84_grad);
        B = (B_grad * Math.PI) / 180.0;
        L = (L_grad * Math.PI) / 180.0;
      }
      const sin_B = Math.sin(B);
      const sin_B_2 = sin_B * sin_B;
      const cos_B = Math.cos(B);
      const cos2B = Math.cos(B * 2.0);
      const tg_B = sin_B / cos_B;
      const sin_L = Math.sin(L);
      const cos_L = Math.cos(L);
      const M = a * (1.0 - e_2) * Math.pow(1 - e_2 * sin_B_2, -1.5);
      const N = a * Math.pow(1 - e_2 * sin_B_2, -0.5);
      const N_2 = N * N;
      let dB =
        (ro / (M + H)) *
          ((N / a) * e_2 * sin_B * cos_B * da +
            (N_2 / a_2 + 1.0) * N * sin_B * cos_B * (de_2 / 2.0) -
            (DX * cos_L + DY * sin_L) * sin_B +
            DZ * cos_B) -
        OMx * sin_L * (1.0 + e_2 * cos2B) +
        OMy * cos_L * (1.0 + e_2 * cos2B) -
        ro * m * e_2 * sin_B * cos_B;
      let dL =
        (ro / ((N + H) * cos_B)) * (-DX * sin_L + DY * cos_L) +
        tg_B * (1 - e_2) * (OMx * cos_L + OMy * sin_L) -
        OMz;
      dB /= 3600.0;
      dL /= 3600.0;
      B42_grad = b84_grad + dB;
      L42_grad = l84_grad + dL;
    }
    const B42_rad = (B42_grad * Math.PI) / 180.0;
    let n = Math.floor((6.0 + L42_grad) / 6.0);
    if (nz !== 0 && Math.abs(n - nz) < 3) n = nz;
    const l = (L42_grad - (3.0 + 6.0 * (n - 1))) / (180.0 / Math.PI);
    const l_2 = l * l;
    const sin_2B = Math.sin(2.0 * B42_rad);
    const sinB = Math.sin(B42_rad);
    const sinB_2 = sinB * sinB;
    const sinB_4 = sinB_2 * sinB_2;
    const sinB_6 = sinB_2 * sinB_2 * sinB_2;
    const cosB = Math.cos(B42_rad);
    x42 =
      6367558.4968 * B42_rad -
      sin_2B *
        (16002.89 +
          66.9607 * sinB_2 +
          0.3515 * sinB_4 -
          l_2 *
            (1594561.25 +
              5336.535 * sinB_2 +
              26.79 * sinB_4 +
              0.149 * sinB_6 +
              l_2 *
                (672483.4 -
                  811219.9 * sinB_2 +
                  5420.0 * sinB_4 -
                  10.6 * sinB_6 +
                  l_2 *
                    (278194.0 -
                      830174.0 * sinB_2 +
                      572434.0 * sinB_4 -
                      16010.0 * sinB_6 +
                      l_2 *
                        (109500.0 - 574700.0 * sinB_2 + 863700.0 * sinB_4 - 398600.0 * sinB_6)))));
    y42 =
      (5 + 10 * n) * 100000 +
      l *
        cosB *
        (6378245.0 +
          21346.1415 * sinB_2 +
          107.159 * sinB_4 +
          0.5977 * sinB_6 +
          l_2 *
            (1070204.16 -
              2136826.66 * sinB_2 +
              17.98 * sinB_4 -
              11.99 * sinB_6 +
              l_2 *
                (270806.0 -
                  1523417.0 * sinB_2 +
                  1327645.0 * sinB_4 -
                  21701.0 * sinB_6 +
                  l_2 * (79690.0 - 866190.0 * sinB_2 + 1730360.0 * sinB_4 - 945460.0 * sinB_6))));
    reuseSK42Point.x = x42;
    reuseSK42Point.y = y42;
    reuseSK42Point.n = n;
    reuseSK42Point.h = h;
    return reuseSK42Point;
  } catch (e) {
    console.error(e);
    return reuseSK42Point;
  }
};

export const fromSK42xyToWGS84BL = (x42 = 0, y42 = 0, h = 0.0) => {
  let b84_grad = 0.0;
  let l84_grad = 0.0;
  try {
    let B42;
    let B042;
    let dB42;
    let L42;
    let z0;
    let l;
    let n = Math.trunc(y42 * 0.000001);
    let Betta = x42 / 6367558.4968;
    let SIN2_Betta = Math.sin(Betta) * Math.sin(Betta);
    let SIN4_Betta = SIN2_Betta * SIN2_Betta;
    B042 =
      Betta +
      Math.sin(2 * Betta) *
        (0.00252588685 - 0.0000149186 * SIN2_Betta + 0.00000011904 * SIN4_Betta);
    z0 = (y42 - (10.0 * n + 5.0) * 100000.0) / (6378245.0 * Math.cos(B042));
    let SIN2_B042 = Math.sin(B042) * Math.sin(B042);
    let SIN4_B042 = SIN2_B042 * SIN2_B042;
    let SIN6_B042 = SIN2_B042 * SIN2_B042 * SIN2_B042;
    let z0z0 = z0 * z0;
    dB42 =
      -z0z0 *
      Math.sin(2 * B042) *
      (0.251684631 -
        0.003369263 * SIN2_B042 +
        0.000011276 * SIN4_B042 -
        z0z0 *
          (0.10500614 -
            0.04559916 * SIN2_B042 +
            0.00228901 * SIN4_B042 -
            0.00002987 * SIN6_B042 -
            z0z0 *
              (0.042858 -
                0.025318 * SIN2_B042 +
                0.014346 * SIN4_B042 -
                0.001264 * SIN6_B042 -
                z0z0 *
                  (0.01672 - 0.0063 * SIN2_B042 + 0.01188 * SIN4_B042 - 0.00328 * SIN6_B042))));
    l =
      z0 *
      (1.0 -
        0.0033467108 * SIN2_B042 -
        0.0000056002 * SIN4_B042 -
        0.0000000187 * SIN6_B042 -
        z0z0 *
          (0.16778975 +
            0.16273586 * SIN2_B042 -
            0.0005249 * SIN4_B042 -
            0.00000846 * SIN6_B042 -
            z0z0 *
              (0.0420025 +
                0.1487407 * SIN2_B042 +
                0.005942 * SIN4_B042 -
                0.000015 * SIN6_B042 -
                z0z0 *
                  (0.01225 +
                    0.09477 * SIN2_B042 +
                    0.03282 * SIN4_B042 -
                    0.00034 * SIN6_B042 -
                    z0z0 *
                      (0.0038 + 0.0524 * SIN2_B042 + 0.0482 * SIN4_B042 + 0.0032 * SIN6_B042)))));
    B42 = B042 + dB42;
    L42 = (6.0 * (n - 0.5)) / 57.29577951 + l;
    const B42_grad = (B42 * 180.0) / Math.PI;
    const L42_grad = (L42 * 180.0) / Math.PI;

    const alfa84 = 1.0 / 298.257223563;
    const alfa42 = 1.0 / 298.3;
    const a2 = 6378137.0;
    const a1 = 6378245.0;
    const e2_2 = 2.0 * alfa84 - alfa84 * alfa84;
    const e1_2 = 2.0 * alfa42 - alfa42 * alfa42;
    const H = 100.0;
    const DX = 23.9;
    const DY = -141.3;
    const DZ = -80.9;
    const OMx = 0.0;
    const OMy = -0.35;
    const OMz = -0.86;
    const m = -0.12 / 1000000.0;
    const a = 0.5 * (a1 + a2);
    const a_2 = a * a;
    const e_2 = 0.5 * (e1_2 + e2_2);
    const da = a2 - a1;
    const de_2 = e2_2 - e1_2;
    const ro = 206264.8062;
    let B;
    let L;
    let B_grad;
    let L_grad;
    for (let i = 0; i <= 1; i++) {
      if (i === 0) {
        B = B42;
        L = L42;
        B_grad = B42_grad;
        L_grad = L42_grad;
      } else {
        B_grad = 0.5 * (B42_grad + b84_grad);
        L_grad = 0.5 * (L42_grad + l84_grad);
        B = (B_grad * Math.PI) / 180.0;
        L = (L_grad * Math.PI) / 180.0;
      }
      let sin_B = Math.sin(B);
      let sin_B_2 = sin_B * sin_B;
      let cos_B = Math.cos(B);
      let cos2B = Math.cos(B * 2.0);
      let tg_B = sin_B / cos_B;
      let sin_L = Math.sin(L);
      let cos_L = Math.cos(L);
      let M = a * (1.0 - e_2) * Math.pow(1 - e_2 * sin_B_2, -1.5);
      let N = a * Math.pow(1 - e_2 * sin_B_2, -0.5);
      let N_2 = N * N;
      let dB =
        (ro / (M + H)) *
          ((N / a) * e_2 * sin_B * cos_B * da +
            (N_2 / a_2 + 1.0) * N * sin_B * cos_B * (de_2 / 2.0) -
            (DX * cos_L + DY * sin_L) * sin_B +
            DZ * cos_B) -
        OMx * sin_L * (1.0 + e_2 * cos2B) +
        OMy * cos_L * (1.0 + e_2 * cos2B) -
        ro * m * e_2 * sin_B * cos_B;
      let dL =
        (ro / ((N + H) * cos_B)) * (-DX * sin_L + DY * cos_L) +
        tg_B * (1 - e_2) * (OMx * cos_L + OMy * sin_L) -
        OMz;
      dB /= 3600.0;
      dL /= 3600.0;
      b84_grad = B42_grad + dB + 0.0000001;
      l84_grad = L42_grad + dL + 0.0000001;
    }
    return [b84_grad, l84_grad, h];
  } catch (e) {
    console.error(e);
    return [b84_grad, l84_grad, h];
  }
};
