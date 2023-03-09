// @flow

import {store} from './store';
import {store as ServiceStore} from '../../remx/Service/store';
import Toast from 'react-native-simple-toast';
import DeviceInfo from 'react-native-device-info';
import {REST_URL, HEADERS_CONFIG} from '../../AppConfig';
import AsyncStorage from '@react-native-community/async-storage';

const PROFILE_URL = `${REST_URL}/profile`;

export function setQuesionerData(checkQuesioner = 0, isQuesioner = 0) {
  store.setQuesionerData({
    checkQuesioner: checkQuesioner,
    isQuesioner: isQuesioner,
  });
}

export async function getUserDetail(nip?: String) {
  const uri = `${REST_URL}/profile`;
  const formData = new FormData();
  formData.append('id_employee', nip);
  fetch(PROFILE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
      ...HEADERS_CONFIG.headers,
    },
    body: formData,
  })
    .then(response => response.json())
    .then(res => {
      if (res.status == 'success') {
        store.setUserData(res.values);
      } else {
        store.setUserData({});
      }
    })
    .catch(err => {
      store.setUserData({});
      Toast.show(`Error when doing login :\n ${err}`, Toast.SHORT);
    });
}

export function checkSession() {
  let user = store.getUserData();
  if (!user.employee_id) return false;

  // AsyncStorage.clear().then(() => {
  //   this.props.navigation.reset({
  //     index: 0,
  //     routes: [{name: 'Login'}],
  //   });

  //   Toast.show(res.response, Toast.LONG);
  //   ServiceStore.setTodoListData([]);
  //   ServiceStore.setMyRequestData([]);
  // });

  // let uri = `${REST_URL}/ImeiCheck.php?nip=${user.nip}&imei=${DeviceInfo.getUniqueId()}`;

  // fetch(uri, HEADERS_CONFIG)
  //   .then(response => response.json())
  //   .then(res => {
  //     if (res.status != 'true') {
  //       AsyncStorage.clear().then(() => {
  //         this.props.navigation.reset({
  //           index: 0,
  //           routes: [{ name: 'Login' }],
  //         });

  //         Toast.show(res.response, Toast.LONG)
  //         ServiceStore.setTodoListData([]);
  //         ServiceStore.setMyRequestData([]);

  //       });

  //     }
  //   }).catch(err => {
  //     Toast.show(`Error checkSession: ${err}`)
  //   })
}
