/* @flow */

import {store} from './store';
import Toast from 'react-native-simple-toast';
import {REST_URL, HEADERS_CONFIG} from '../../AppConfig';



export async function getListLeave(
  year?: String,
  month?: String,
) {
  // let m = store.getMonth();
  // let tgl = store.getYear() + m;

  let uri = `${REST_URL}/leave_request/get_by_employee_id?page=1&limit=20&month=${month}&year=${year}`;
  console.log('url is');
  console.log(uri);


  console.log('token is');
  console.log(store.getToken());

  fetch(uri, {
    method: 'POST',
    headers: {
      // ...HEADERS_CONFIG.headers,
      Authorization: `Bearer ${store.getToken()}`,
    },
  })
    .then(response => response.json())
    .then(res => {
      store.setLoading(false);
      console.log('res is');
      console.log(res);
      store.setData(res);
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
