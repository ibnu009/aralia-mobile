import {connect} from 'remx';
import {store as UserStore} from '../../remx/User/store';
import React, {Component, useState} from 'react';
import * as RNLocalize from 'react-native-localize';
import {RNCamera} from 'react-native-camera';
import Spinner from 'react-native-loading-spinner-overlay';
// import Geolocation from '@react-native-community/geolocation';
import Geolocation from 'react-native-geolocation-service';
import packageJson from '../../package.json';
import {REST_URL, REST_PGD, HEADERS_CONFIG} from '../../AppConfig';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {
  StyleSheet,
  TouchableOpacity,
  View,
  Platform,
  Dimensions,
  Alert,
  PermissionsAndroid,
  Modal,
  TouchableHighlight,
  FlatList,
  Image,
} from 'react-native';

import {Icon, Text} from 'native-base';
import Toast from 'react-native-simple-toast';
import Moment from 'moment';
import DropDownPicker from 'react-native-dropdown-picker';

const ButtonMenu = (props) => {
  return (
    <View>
      <Text
        style={{
          width: '100%',
          backgroundColor: 'red',
          padding: 10,
          color: 'white',
          borderRadius: 5,
          textAlign: 'center',
          marginBottom: 16,
          marginTop: 16,
        }}>
        {props.name}
      </Text>
    </View>
  );
};

const ButtonMenuSuccess = (props) => {
  return (
    <View>
      <Text
        style={{
          width: '100%',
          backgroundColor: 'green',
          padding: 10,
          color: 'white',
          borderRadius: 5,
          textAlign: 'center',
          marginBottom: 16,
          marginTop: 16,
        }}>
        {props.name}
      </Text>
    </View>
  );
};

function formatError(errorMessage) {
  if (errorMessage.toString().includes("Network request")) {
    return `Terjadi kesalahan jaringan \n Harap check kembali koneksi internet Anda.`;
  }

  return `Error : ${errorMessage}`;
}

class CheckInOut extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showLoading: false,
      lat: '',
      long: '',
      location: null,
      is_location: false,
      isCameraReady: false,
      nip: '',
      id_employee: '',
      level: '',
      modalShow: false,
      modalFailedShow: false,
      modalFailedMessage: '',
      modalSuccessShow: false,
      modalSuccessMessage: '',
      attendance_type: '',
      attendance_flag: '',
      id_geo: '',
      objCheck: null,
      itemShift: null,
      id_tr_shift: '',
      displayShift: 'none',
      A_IN: true,
      A_OUT: true,
      BU_IN: true,
      BU_OUT: true,
      BU_DISPLAY: 'none',
      allow_absen: '',
    };
  }

  componentDidMount() {
    var userData = UserStore.getUserData();
    var quesionerData = UserStore.getQuesionerData();
    this.loadData(userData, quesionerData);
    
    if (
      quesionerData['checkQuesioner'] < 1 &&
      quesionerData['isQuesioner'] == '1'
    ) {
      // this.props.navigation.navigate('HealthSurvey');
      this.loadData(userData, quesionerData);
    } else {
      this.loadData(userData, quesionerData);
    }
  }

  loadData = (userData, quesionerData) => {
    this.setState({
      nip: userData['employee_id'],
      id_employee: userData['id_employee'],
      level: userData['level'],
    });

    this.getLocationName();

    // jika security
    if (this.checkAttendanceModal(userData['level'])) {
      // check absensi
      let check_atd_uri = `${REST_URL}/attendance/check4?id_employee=${userData['id_employee']}&date=${Moment(new Date()).format('YYYY-MM-DD HH:mm:ss')}`;
      console.log(check_atd_uri);
      this.setState({showLoading: true});
      fetch(check_atd_uri, {
        method: 'POST',
        headers: {
          ...HEADERS_CONFIG.headers,
        },
      })
        .then((response) => response.json())
        .then((res) => {
          console.log('Berhasil check');

          this.setState({showLoading: false});
          var userData = UserStore.getUserData();
          if (this.checkAttendanceModal(userData['level'])) {
            if (res.count_shift < 1) {
              Alert.alert('Info', res.message);
              this.props.navigation.goBack();
            } else {
              if (Array.isArray(res.shift)) {
                if (res.shift.length > 0) {
                  if (res.status == 'error') {
                    console.log('confirm4');
                    Alert.alert(
                      'Info',
                      `${res.message}`,
                      [
                        {
                          text: 'Tidak',
                          onPress: () => {
                            this.props.navigation.goBack();
                          },
                          style: 'cancel',
                        },
                        {
                          text: 'Ya',
                          onPress: () => {
                            var shift_data = [];
                            var i = 0;
                            var value_selected = '';

                            res.shift.forEach(function (data) {
                              if (i < 1) {
                                value_selected = data.id_tr_shift;
                              }
                              shift_data.push({
                                label: `${data.shift} - ${data.time_in} s/d ${data.time_out} `,
                                value: data.id_tr_shift,
                              });
                              i++;
                            });

                            this.setState(
                              {
                                allow_absen: 'Y',
                                itemShift: shift_data,
                                id_tr_shift: value_selected,
                                objCheck: res,
                                BU_DISPLAY: 'flex',
                                displayShift:
                                  res.shift.length > 1 ? 'flex' : 'none',
                              },
                              () => {
                                if (
                                  (res.type_attendance == 'A' &&
                                    res.flag == 'in') ||
                                  res.flag == 'in'
                                ) {
                                  this.setState({
                                    A_IN: false,
                                  });
                                }
                                if (
                                  res.type_attendance == 'A' &&
                                  res.flag == 'out'
                                ) {
                                  this.setState({
                                    A_OUT: false,
                                  });
                                }
                                if (
                                  (res.type_attendance == 'BU' &&
                                    res.flag == 'in') ||
                                  res.flag == 'in'
                                ) {
                                  this.setState({
                                    BU_IN: false,
                                  });
                                }
                                if (
                                  res.type_attendance == 'BU' &&
                                  res.flag == 'out'
                                ) {
                                  this.setState({
                                    BU_OUT: false,
                                  });
                                }
                                this.setState({modalShow: true});
                              },
                            );
                          },
                        },
                      ],
                      {cancelable: false},
                    );
                  }

                  if (res.status == 'success') {
                    var shift_data = [];
                    var i = 0;
                    var value_selected = '';

                    res.shift.forEach(function (data) {
                      if (i < 1) {
                        value_selected = data.id_tr_shift;
                      }
                      shift_data.push({
                        label: `${data.shift} - ${data.time_in} s/d ${data.time_out} `,
                        value: data.id_tr_shift,
                      });
                      i++;
                    });

                    this.setState(
                      {
                        itemShift: shift_data,
                        id_tr_shift: value_selected,
                        objCheck: res,
                        BU_DISPLAY: 'flex',
                        displayShift: res.shift.length > 1 ? 'flex' : 'none',
                      },
                      () => {
                        if (
                          (res.type_attendance == 'A' && res.flag == 'in') ||
                          res.flag == 'in'
                        ) {
                          this.setState({
                            A_IN: false,
                          });
                        }
                        if (res.type_attendance == 'A' && res.flag == 'out') {
                          this.setState({
                            A_OUT: false,
                          });
                        }
                        if (
                          (res.type_attendance == 'BU' && res.flag == 'in') ||
                          res.flag == 'in'
                        ) {
                          this.setState({
                            BU_IN: false,
                          });
                        }
                        if (res.type_attendance == 'BU' && res.flag == 'out') {
                          this.setState({
                            BU_OUT: false,
                          });
                        }
                        this.setState({modalShow: true});
                      },
                    );
                  }
                }
              } else {
                if (res.status == 'error') {
                  console.log('confirm5');
                  Alert.alert(
                    'Info',
                    `${res.message}`,
                    [
                      {
                        text: 'Tidak',
                        onPress: () => {
                          this.props.navigation.goBack();
                        },
                        style: 'cancel',
                      },
                      {
                        text: 'Ya',
                        onPress: () => {
                          var shift_data = [];
                          this.setState(
                            {
                              itemShift: shift_data,
                              id_tr_shift: '',
                              BU_DISPLAY: 'flex',
                              objCheck: res,
                              displayShift: 'none',
                            },
                            () => {
                              if (
                                (res.type_attendance == 'A' &&
                                  res.flag == 'in') ||
                                res.flag == 'in'
                              ) {
                                this.setState({
                                  A_IN: false,
                                });
                              }
                              if (
                                res.type_attendance == 'A' &&
                                res.flag == 'out'
                              ) {
                                this.setState({
                                  A_OUT: false,
                                });
                              }
                              if (
                                (res.type_attendance == 'BU' &&
                                  res.flag == 'in') ||
                                res.flag == 'in'
                              ) {
                                this.setState({
                                  BU_IN: false,
                                });
                              }
                              if (
                                res.type_attendance == 'BU' &&
                                res.flag == 'out'
                              ) {
                                this.setState({
                                  BU_OUT: false,
                                });
                              }
                              this.setState({modalShow: true});
                            },
                          );
                        },
                      },
                    ],
                    {cancelable: false},
                  );
                } else {
                  var shift_data = [];
                  this.setState(
                    {
                      itemShift: shift_data,
                      id_tr_shift: '',
                      BU_DISPLAY: 'flex',
                      objCheck: res,
                      displayShift: 'none',
                    },
                    () => {
                      if (
                        (res.type_attendance == 'A' && res.flag == 'in') ||
                        res.flag == 'in'
                      ) {
                        this.setState({
                          A_IN: false,
                        });
                      }
                      if (res.type_attendance == 'A' && res.flag == 'out') {
                        this.setState({
                          A_OUT: false,
                        });
                      }
                      if (
                        (res.type_attendance == 'BU' && res.flag == 'in') ||
                        res.flag == 'in'
                      ) {
                        this.setState({
                          BU_IN: false,
                        });
                      }
                      if (res.type_attendance == 'BU' && res.flag == 'out') {
                        this.setState({
                          BU_OUT: false,
                        });
                      }
                      this.setState({modalShow: true});
                    },
                  );
                }
              }
            }
          } else {
            if (res.status == 'error') {
              console.log('confirm2');
              Alert.alert(
                'Info',
                `${res.message}`,
                [
                  {
                    text: 'Tidak',
                    onPress: () => {
                      this.props.navigation.goBack();
                    },
                    style: 'cancel',
                  },
                  {
                    text: 'Ya',
                    onPress: () => {
                      this.setState({
                        allow_absen: 'Y',
                        itemShift: [],
                        id_tr_shift: '',
                        objCheck: res,
                        displayShift: 'none',
                      });
                    },
                  },
                ],
                {cancelable: false},
              );
            } else {
              this.setState({
                itemShift: [],
                id_tr_shift: '',
                objCheck: res,
                displayShift: 'none',
              });
            }
          }
        })
        .catch((err) => {
          // Toast.show(`Error when doing getting check attendance :\n ${err}`, Toast.SHORT);
          // Alert.alert('Error', 'Cek absensi gagal!');
          this.setState({showLoading: false});
          this.setState({modalFailedShow: true});
          this.setState({modalFailedMessage: 'Cek absensi gagal!'});

          console.log('gagal karena');
          console.log(err);

          // this.props.navigation.goBack();
        });
    } else {
      console.log('Adalah non security');

      // jika non security
      let check_atd_uri = `${REST_URL}/attendance/check4?id_employee=${
        userData['id_employee']
      }&date=${Moment(new Date()).format('YYYY-MM-DD HH:mm:ss')}`;
      console.log(check_atd_uri);
      fetch(check_atd_uri, {
        method: 'POST',
        headers: {
          ...HEADERS_CONFIG.headers,
        },
      })
        .then((response) => response.json())
        .then((res) => {
          if (res.status == 'error') {
            console.log('confirm1');
            this.setState({showLoading: false});
            Alert.alert(
              'Info',
              `${res.message}`,
              [
                {
                  text: 'Tidak',
                  onPress: () => {
                    this.props.navigation.goBack();
                  },
                  style: 'cancel',
                },
                {
                  text: 'Ya',
                  onPress: () => {
                    this.setState({
                      allow_absen: 'Y',
                      itemShift: [],
                      id_tr_shift: '',
                      objCheck: res,
                      displayShift: 'none',
                    });
                  },
                },
              ],
              {cancelable: false},
            );
          } else {
            if (res.status == 'success') {
              if (Array.isArray(res.shift)) {
                if (res.shift.length > 0) {
                  var shift_data = [];
                  var i = 0;
                  var value_selected = '';

                  res.shift.forEach(function (data) {
                    if (i < 1) {
                      value_selected = data.id_tr_shift;
                    }
                    shift_data.push({
                      label: `${data.shift} - ${data.time_in} s/d ${data.time_out}`,
                      value: data.id_tr_shift,
                    });
                    i++;
                  });

                  this.setState(
                    {
                      itemShift: shift_data,
                      id_tr_shift: value_selected,
                      objCheck: res,
                      displayShift: res.shift.length > 1 ? 'flex' : 'none',
                    },
                    () => {
                      if (
                        (res.type_attendance == 'A' && res.flag == 'in') ||
                        res.flag == 'in'
                      ) {
                        this.setState({
                          A_IN: false,
                        });
                      }
                      if (res.type_attendance == 'A' && res.flag == 'out') {
                        this.setState({
                          A_OUT: false,
                        });
                      }
                      if (
                        (res.type_attendance == 'BU' && res.flag == 'in') ||
                        res.flag == 'in'
                      ) {
                        this.setState({
                          BU_IN: false,
                        });
                      }
                      if (res.type_attendance == 'BU' && res.flag == 'out') {
                        this.setState({
                          BU_OUT: false,
                        });
                      }
                      this.setState({modalShow: true});
                    },
                  );
                }
              } else {
                this.setState({
                  itemShift: [],
                  id_tr_shift: '',
                  objCheck: res,
                  displayShift: 'none',
                });
              }

              this.setState({showLoading: false});
            }
          }
        })
        .catch((err) => {
          this.setState({showLoading: false});
        });
    }
  };

  checkAttendanceModal = (level) => {
    var result = false;
    var listSecurity = ['fa_200624111635_25259'];
    if (listSecurity.indexOf(level) != -1) {
      result = true;
    }

    return result;
  };

  getLatLongPosition = new Promise((resolve, reject) => {
    // request permission
    if (Platform.OS == 'android') {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ).then((re) => {
        if (re != PermissionsAndroid.RESULTS.GRANTED)
          this.props.navigation.navigate('Attendance', this.props);
      });
    } else {
      Geolocation.requestAuthorization();
    }

    // this.setState({location: 'Sedang mendapatkan lokasi...'});
    Geolocation.getCurrentPosition(
      (result) => {
        console.log('Getting location...');
        let {coords, mocked} = result;
        if (Platform.OS == 'android' && mocked) {
          this.props.navigation.navigate('Attendance', this.props);
          reject({
            alert: `Harap matikan penetapan lokasi palsu Anda untuk melanjutkan!`,
          });
        }
        this.setState({lat: coords.latitude, long: coords.longitude});
        resolve();
      },
      (err) => {
        console.log('Gagal location...');
        this.setState({location: `Gagal Mendapatkan Lokasi`});
        reject({toast: err});
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  });

  getLocationName = () => {
    this.getLatLongPosition
      .then(() => {
        // do get config data from remx
        var configData = UserStore.getConfigData();
        var urlGeofences = configData['geofences'];
        var urlKey = configData['key'];

        let mockLat = '-5.151394469431761';
        let mockLng = '119.43210699999997';
        // var urlGeoFormat = `${urlGeofences}/api/v1/geofences/check_area?longitude=${mockLng}&latitude=${mockLat}&key=${urlKey}`;
        var urlGeoFormat = `${urlGeofences}/api/v1/geofences/check_area?longitude=${this.state.long}&latitude=${this.state.lat}&key=${urlKey}`;
        console.log('URL GEO FORMAT');
        console.log(urlGeoFormat);
        // do get area
        fetch(urlGeoFormat, {
          method: 'GET',
        })
          .then((res) => res.json())
          .then((res) => {
            console.log('Berhasil');
            if (res['data']) {
              console.log(' di lokasi');
              this.setState({
                id_geo: res['data']['id'],
                is_location: true,
                location: `Anda berada di ${res['data']['area_name']}`,
              });
            } else {
              console.log('Tidak di lokasi');
              this.setState({
                is_location: false,
                location: `Anda tidak berada didalam area.`,
              });
            }
          })
          .catch((err) => {
            // console.log(err);
            console.log('Gagal deteksi');

            this.setState({
              is_location: false,
              location: `Gagal mendeteksi area.`,
            });
          });
      })
      .catch((err) => {
        if (err.alert) {
          Alert.alert('Info', err.alert);
        } else {
          Toast.show(`Error: ${err.toast.message}`);
        }
      });
  };

  takePicture = async () => {
    // do get user data from remx
    var userData = UserStore.getUserData();
    if (
      (this.state.attendance_type == '' &&
        this.checkAttendanceModal(userData['level'])) ||
      (this.state.attendance_type == '' && this.state.objCheck.shift != '')
    ) {
      this.setState({modalShow: true});
    } else {
      var isGeofence = userData['is_geofence'];
      if (this.state.is_location == true || isGeofence == '0') {
        if (this.camera) {
          this.setState({showLoading: true});
          const options = {
            quality: 0.1,
            // base64: true,
            pauseAfterCapture: true,
            orientation: 'portrait',
            fixOrientation: true,
            width: 640,
            height: 640,
          };
          let data = await this.camera.takePictureAsync(options);
          this.doRecognize(data);
        }
      } else {
        this.setState({modalFailedShow: true});
        this.setState({modalFailedMessage: 'Tidak bisa melakukan absen, anda harus berada di sekitar area kantor.'});
        // Alert.alert(
        //   'Info',
        //   'Tidak bisa melakukan absen, anda harus berada di sekitar area kantor.',
        // );
      }
    }
  };

  doAttendance = () => {
    console.log('Masuk ke do attendance');
    if (this.state.objCheck != null) {
      const formData = new FormData();
      // console.log(this.state.objCheck);
      // var date_in = this.state.objCheck.date_in;
      // var created_date = this.state.objCheck.created_date;
      var id_tr_attendance = this.state.objCheck.id_tr_attendance;
      var flag = this.state.objCheck.flag;
      var messages = this.state.objCheck.message;

      if (this.state.id_tr_shift != '') {
        formData.append('id_tr_shift', this.state.id_tr_shift);
      }

      var attendance_tp = 'A';
      if (this.state.attendance_type != '') {
        attendance_tp = this.state.attendance_type;
      }

      formData.append('type_attendance', attendance_tp);

      // override flag
      if (this.checkAttendanceModal(this.state.level)) {
        flag = this.state.attendance_flag;
      }

      // set flag submit form attendance
      var is_submit_attendance = true;

      var type_date = '';
      if (flag == 'in') {
        type_date = 'date_in';
      }

      if (flag == 'out') {
        type_date = 'date_out';
      }
      if (flag == '') {
        is_submit_attendance = false;
      }

      if (is_submit_attendance) {
        formData.append('id_employee', this.props.user.id_employee);
        formData.append('flag', flag);
        formData.append(
          type_date,
          Moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        );
        formData.append('lat', this.state.lat);
        formData.append('long', this.state.long);
        formData.append('id_geo', this.state.id_geo);
        formData.append('lat', this.state.lat);
        formData.append('long', this.state.long);
        formData.append('id_tr_attendance', id_tr_attendance);
        formData.append('allow_absen', 'Y');

        console.log(formData);

        const uri = `${REST_URL}/attendance/save4`;



        fetch(uri, {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
            ...HEADERS_CONFIG.headers,
          },
          body: formData,
        })
          .then((response) => response.json())
          .then((response) => {
            this.setState({showLoading: false});
            this.setState({modalSuccessShow: true});
            this.setState({modalSuccessMessage: 'Absensi berhasil'});

            // navigation.navigate('AttendanceSuccess');
            // Toast.show(`Absensi berhasil`, Toast.SHORT);
            // this.props.navigation.replace('AttendanceList');
          })
          .catch((err) => {
            console.log(err);
            Toast.show(
              `Error when doing saving attendance :\n ${err}`,
              Toast.SHORT,
            );
            this.setState({showLoading: false});

            this.setState({modalFailedShow: true});
            this.setState({
              modalFailedMessage: `Error when doing saving attendance :\n ${err}`,
            });

            // this.props.navigation.goBack();
          });
      } else {
        Alert.alert('Info', messages);
        this.setState({showLoading: false});
        this.props.navigation.navigate('Attendance', this.props);
      }
    } else {
      Alert.alert('Info', 'Cek absensi gagal, ulangi lagi!');
      this.props.navigation.goBack();
    }
  };

  doRecognize = async (photo) => {
    // debug
    // this.doAttendance();

    let uri =
      Platform.OS === 'android' ? photo.uri : photo.uri.replace('file://', '');
    let name = uri.split('/');
    name = name[name.length - 1];
    let contentType = 'image/jpeg';

    // do get config data from remx
    var configData = UserStore.getConfigData();
    var urlFacerecognize = configData['facerecognize'];
    var urlKey = configData['key'];

    let formData = new FormData();
    formData.append('user_id', this.state.nip);
    formData.append('lat', this.state.lat);
    formData.append('lon', this.state.long);
    formData.append('location', this.state.location);
    formData.append('version', packageJson.version);
    formData.append('timezone', RNLocalize.getTimeZone());
    formData.append('key', urlKey);

    formData.append('file', {
      name: name,
      type: contentType,
      uri: uri,
    });

    let url = `${urlFacerecognize}/api/v1/face_recognize/upload_and_recognize`;

    console.log('faceRecog');
    console.log(url);

    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
        ...HEADERS_CONFIG.headers,
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((res) => {
        this.setState({showLoading: false});
        console.log('res wajah');
        console.log(res);
        // this.doAttendance();

        if (res.recognize == 'False') {
          Toast.show(`Wajah tidak dikenali`, Toast.SHORT);
          this.setState({modalFailedShow: true});
          this.setState({modalFailedMessage: `Wajah tidak dikenali \n Pastikan Anda sudah mendaftarkan wajah anda di pendaftaran wajah`});
          this.camera.resumePreview();
        } else {
          this.doAttendance();
        }
      })
      .catch((err) => {
        this.setState({showLoading: false});
        this.camera.resumePreview();
        // Toast.show(`Error: ${err}`);
        this.setState({modalFailedShow: true});
        this.setState({modalFailedMessage: formatError(err)});
      });
  };

  render() {
    return (
      <View style={style.container}>
        <Spinner
          visible={this.state.showLoading}
          overlayColor="rgba(0, 0, 0, 0.25)"
          size="large"
        />

        <RNCamera
          ref={(ref) => {
            this.camera = ref;
          }}
          type="front"
          style={style.preview}
          captureAudio={false}
          flashMode="off"
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
        />

        <TouchableOpacity
          style={[style.mapLocationBox, {width: '90%'}]}
          onPress={() => {
            this.getLocationName();
          }}>
          <Icon name="map-marker" type="FontAwesome" />
          <View
            style={{
              flexDirection: 'column',
              position: 'absolute',
              left: 45,
              top: '25%',
              width: '100%',
            }}>
            <Text
              style={{
                fontWeight: '100',
                fontSize: Dimensions.get('window').width * 0.04,
                width: '90%',
                color: '#000',
                top: new RegExp('sedang|gagal mendapatkan', 'i').exec(
                  this.state.location,
                )
                  ? 10
                  : 0,
              }}>
              {this.state.location ?? 'Sedang mendapatkan lokasi...'}
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.captureWrapper}></View>

        <View
          style={{
            position: 'absolute',
            bottom: 50,
            left: Dimensions.get('screen').width * 0.45 - 20,
            right: 0,
            flexDirection: 'row',
          }}>
          <TouchableOpacity
            onPress={this.takePicture.bind(this)}
            style={style.capture}
            disabled={
              new RegExp('gagal mendapatkan', 'i').exec(this.state.location) ||
              this.state.location == null
                ? true
                : false
            }>
            <FontAwesome name="camera" size={16} color="black" />
            {/* <Icon name="camera" type="MaterialIcons" /> */}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate('Attendance', this.props)
            }
            style={style.cancelButton}>
              {/* <FontAwesomeIcon icon="fa-solid fa-aperture" /> */}
              {/* <FontAwesome name='close' type="Feather" size={16} color='white' /> */}
            <Icon name="camera-off" type="Feather" style={{color: 'white'}} />
          </TouchableOpacity>
        </View>
        <View style={styles.centeredView}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.modalShow}
            onRequestClose={() => {
              this.setState({modalShow: false});
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                {(() => {
                  if (
                    this.state.objCheck != null &&
                    this.state.itemShift.length > 0
                  ) {
                    return (
                      <View
                        style={{
                          width: 160,
                          top: 0,
                          marginBottom: 30,
                          display: this.state.displayShift,
                        }}>
                        <DropDownPicker
                          placeholder="Pilih shift"
                          defaultValue={this.state.id_tr_shift}
                          items={this.state.itemShift}
                          containerStyle={{height: 50}}
                          onChangeItem={(item) => {
                            this.setState({id_tr_shift: item.value});
                            console.log(item.value);
                          }}
                        />
                      </View>
                    );
                  }
                })()}

                <View style={styleLegend.fieldSet}>
                  <Text style={styleLegend.legend}> ABSEN </Text>
                  <TouchableHighlight
                    disabled={this.state.A_IN}
                    style={{
                      ...styles.openButton,
                      marginTop: 20,
                      backgroundColor: this.state.A_IN ? '#f1f1f1' : '#008000',
                      width: 60,
                      right: 0,
                      margin: 4,
                    }}
                    onPress={() => {
                      this.setState({
                        modalShow: false,
                        attendance_type: 'A',
                        attendance_flag: 'in',
                      });
                    }}>
                    <Text style={styles.textStyle}>IN</Text>
                  </TouchableHighlight>

                  <TouchableHighlight
                    disabled={this.state.A_OUT}
                    style={{
                      ...styles.openButton,
                      marginTop: 20,
                      backgroundColor: this.state.A_OUT ? '#f1f1f1' : '#008000',
                      width: 60,
                      left: 0,
                      margin: 4,
                    }}
                    onPress={() => {
                      this.setState({
                        modalShow: false,
                        attendance_type: 'A',
                        attendance_flag: 'out',
                      });
                    }}>
                    <Text style={styles.textStyle}>OUT</Text>
                  </TouchableHighlight>
                </View>
                <View
                  style={{
                    borderBottomColor: 'black',
                    borderBottomWidth: 1,
                    marginTop: 10,
                    marginBottom: 10,
                  }}
                />
                <View
                  style={{
                    ...styleLegend.fieldSet,
                    ...{display: this.state.BU_DISPLAY},
                  }}>
                  <Text style={styleLegend.legend}> BACKUP </Text>
                  <TouchableHighlight
                    disabled={this.state.BU_IN}
                    style={{
                      ...styles.openButton,
                      marginTop: 20,
                      backgroundColor: this.state.BU_IN ? '#f1f1f1' : '#008000',
                      width: 60,
                      left: 0,
                      margin: 4,
                    }}
                    onPress={() => {
                      this.setState({
                        modalShow: false,
                        attendance_type: 'BU',
                        attendance_flag: 'in',
                      });
                    }}>
                    <Text style={styles.textStyle}>IN</Text>
                  </TouchableHighlight>

                  <TouchableHighlight
                    disabled={this.state.BU_OUT}
                    style={{
                      ...styles.openButton,
                      marginTop: 20,
                      backgroundColor: this.state.BU_OUT
                        ? '#f1f1f1'
                        : '#008000',
                      width: 60,
                      right: 0,
                      margin: 4,
                    }}
                    onPress={() => {
                      this.setState({
                        modalShow: false,
                        attendance_type: 'BU',
                        attendance_flag: 'out',
                      });
                    }}>
                    <Text style={styles.textStyle}>OUT</Text>
                  </TouchableHighlight>
                </View>
              </View>
            </View>
          </Modal>
        </View>

        {/* Modal gagal */}
        <View style={styles.centeredView}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.modalFailedShow}
            onRequestClose={() => {
              this.setState({modalFailedShow: false});
            }}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'white',
                marginHorizontal: 20,
                marginVertical: 20,
                marginTop: 200,
                borderRadius: 20,
              }}>
              <Image
                source={require('assets/failed.png')}
                style={styles.logo}
              />

              <Text style={{fontSize: 18, color: 'black', marginTop: 16, textAlign: 'center'}}>{this.state.modalFailedMessage}</Text>

              <TouchableOpacity
                onPress={() => {
                  this.setState({modalFailedShow: false});
                  this.props.navigation.goBack();
                }}
                style={{width: '85%'}}>
                <ButtonMenu name="Kembali" />
              </TouchableOpacity>
            </View>
          </Modal>
        </View>

        {/* Modal Berhasil */}
        <View style={styles.centeredView}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.modalSuccessShow}
            onRequestClose={() => {
              this.setState({modalSuccessShow: false});
            }}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'white',
                marginHorizontal: 20,
                marginVertical: 20,
                marginTop: 200,
                borderRadius: 20,
              }}>
              <Image
                source={require('assets/success.png')}
                style={styles.logo}
              />

              <Text style={{fontSize: 18, color: 'black', marginTop: 16}}>
                {this.state.modalSuccessMessage}
              </Text>

              <TouchableOpacity
                onPress={() => {
                  this.setState({modalSuccessShow: false});
                  this.props.navigation.goBack();
                }}
                style={{width: '85%'}}>
                <ButtonMenuSuccess name="Kembali" />
              </TouchableOpacity>
            </View>
          </Modal>
        </View>
      </View>
    );
  }
}

const styleLegend = StyleSheet.create({
  fieldSet: {
    paddingHorizontal: 10,
    paddingBottom: 10,
    borderRadius: 5,
    borderWidth: 1,
    alignItems: 'center',
    borderColor: '#000',
    flexDirection: 'row',
  },
  legend: {
    position: 'absolute',
    top: -10,
    left: 45,
    fontWeight: 'bold',
    backgroundColor: '#FFFFFF',
    marginLeft: 'auto',
    marginRight: 'auto',
    textAlign: 'center',
    flex: 1,
    textAlign: 'center',
  },
});

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
    position: 'absolute',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  logo: {
    aspectRatio: 2,
    resizeMode: 'contain',
    marginBottom: 30,
    marginTop: 16,
    width: 100,
    height: 100,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 23,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 5,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

const styleList = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
});

const style = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'flex-end',
  },
  cancelButton: {
    width: 50,
    height: 50,
    padding: 8,
    borderRadius: 25,
    backgroundColor: 'red',
    left: 20,
    top: 0,
    alignSelf: 'center',
    borderColor: 'white',
    borderWidth: 2,
  },
  capture: {
    // flex: 1,
    backgroundColor: '#fff',
    borderRadius: 100,
    padding: Dimensions.get('screen').width * 0.05,
    // paddingHorizontal: Dimensions.get('screen').width*(8/100),
    alignSelf: 'center',
  },
  captureWrapper: {
    flex: 0,
    alignSelf: 'center',
    position: 'absolute',
    marginTop: Dimensions.get('window').height * 0.85,
  },
  mapLocationBox: {
    position: 'absolute',
    marginTop: Dimensions.get('screen').height * 0.05,
    backgroundColor: '#fff',
    padding: 15,
    alignSelf: 'center',
    borderRadius: 50,
    flexDirection: 'column',
  },
});

function mapStateToProps() {
  return {
    user: UserStore.getUserData(),
  };
}

export default connect(mapStateToProps)(CheckInOut);
