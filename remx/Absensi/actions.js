/* @flow */

import {store} from './store';
import Toast from 'react-native-simple-toast';
import {REST_URL, HEADERS_CONFIG} from '../../AppConfig';

export async function getAbsensiData(
  nip?: String,
  year?: String,
  month?: String,
) {
  // let m = store.getMonth();
  // let tgl = store.getYear() + m;

  let uri = `${REST_URL}/attendance/employee2?id_employee=${nip}&year=${year}&month=${month}`;
  fetch(uri, {
    method: 'POST',
    headers: {
      ...HEADERS_CONFIG.headers,
    },
  })
    .then(response => response.json())
    .then(res => {
      store.setLoading(false);
      if (res.status == 'success') {
        if (Array.isArray(res.values) && res.values.length > 0) {
          store.setData(res.values);
        }
      } else {
        Toast.show(
          `Data absensi belum ada. Silahkan ulangi beberapa saat lagi.`,
          Toast.SHORT,
        );
      }
    })
    .catch(err => {
      store.setLoading(false);
      Toast.show(`Error when doing getting attendance :\n ${err}`, Toast.SHORT);
    });
}

export async function setMonth(m?: Number) {
  store.setMonth(m.toString().length == 1 ? `0${m}` : m);
}

export async function setYear(y?: Number) {
  store.setYear(y);
}
