// app config global
import {Alert, BackHandler} from 'react-native';
import {encode} from 'base-64';
import AsyncStorage from '@react-native-community/async-storage';

export const REST_PGD = 'https://larisa.pegadaian.co.id/webservices1';
export const REST_URL = 'https://aralia.pegadaian.co.id/webservice_api';
// export const REST_PGD = 'http://34.126.150.110/api-aralia';
// export const REST_URL = 'https://api-aralia.abera.id';
export const API_KEY = '';

export const HEADERS_CONFIG = {
  headers: {
    Authorization: `Basic ${encode('larisa:pgd')}`,
  },
};

export function handleBack() {
  Alert.alert(
    `Aralia`,
    'Apakah Anda ingin keluar Aplikasi?',
    [
      {
        text: 'Tidak',
      },
      {
        text: 'Ya',
        onPress: () => {
          BackHandler.exitApp();
          AsyncStorage.clear();
        },
      },
    ],
    {
      cancelable: false,
    },
  );
  return true;
}

export const IMAGE_STATUS_OBJ = {
  pending: require('assets/waiting-icon.png'),
  accepted: require('assets/approve-icon.png'),
  setuju: require('assets/approve-icon.png'),
  rejected: require('assets/cross-icon.png'),
  'tidak setuju': require('assets/cross-icon.png'),
  cancelled: require('assets/cross-icon.png'),
  canceled: require('assets/cross-icon.png'),
  batal: require('assets/cross-icon.png'),
};

export const MONTH_ITEMS_OPTION = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

export function yearOptionItem() {
  var arr = [];
  let currentYear = new Date().getFullYear();
  for (let i = 0; i < 5; i++) {
    arr.push(`${currentYear + i}`);
  }
  return arr;
}

export function formatJam(date?: Date) {
  if (date instanceof Date == false) date = new Date();
  let dateStr = '';

  if (date.getHours() < 10) dateStr += '0';
  dateStr += date.getHours() + ':';

  if (date.getMinutes() < 10) dateStr += '0';
  dateStr += date.getMinutes();

  return dateStr;
}

export function getDateToStringIndo(date?: Date) {
  if (date instanceof Date == false) date = new Date();

  let dateText = `${date.getDate()} ${
    MONTH_ITEMS_OPTION[date.getMonth()]
  } ${date.getFullYear()}`;
  return dateText;
}

export function getDateFromString(dateStr?: String) {
  if (!dateStr) dateStr = getIndoFormatDate();
  let dateArr = dateStr.split('/');

  let date = new Date(`${dateArr[2]}-${dateArr[1]}-${dateArr[0]}`);
  return date;
}

export function getIndoFormatDate(date?: Date) {
  if (date instanceof Date == false) date = new Date();

  let dateText = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
  return dateText;
}
