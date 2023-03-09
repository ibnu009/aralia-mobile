import {connect} from 'remx';
import React, {Component} from 'react';
import HeaderLayout from '../HeaderLayout';
import {store as UserStore} from '../../remx/User/store';
import * as UserAction from '../../remx/User/actions';
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-community/async-storage';
import CardListItem from '../CardListItem';
import Icon from 'react-native-vector-icons/FontAwesome';

import style from '../../styles';
// import {Container, Card, CardItem, Left, Right, Icon, Toast} from 'native-base';
import {
  View,
  Alert,
  FlatList,
  TouchableOpacity,
  Image,
  Text,
  ImageBackground,
} from 'react-native';
import {REST_URL, HEADERS_CONFIG} from '../../AppConfig';
import {HeaderBackButton} from '@react-navigation/stack';
import HeaderLogo from '../HeaderLogo';
import HeaderBack from '../HeaderBack';
// import {Icon} from 'react-native-vector-icons/Icon';

const items = [
  {
    image: require('assets/menu/attendance2.png'),
    title: 'Daftar Kehadiran',
    route: 'AttendanceList',
  },
  {
    image: require('assets/menu/check-in.png'),
    title: 'Presensi',
    route: 'CheckInOut',
  },
  /* {
    image: require('assets/menu/overtime.png'),
    title: 'Permohonan Lembur',
    route: 'Overtime',
  }, */
  // {
  //   image: require('assets/menu/attendance2.png'),
  //   title: 'Dispensasi Absensi',
  //   route: 'Dispensation',
  // },
];

class Attendance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nip: '',
      showLoading: false,
    };
  }

  componentDidMount() {
    if ('' != UserStore.getUserData()) {
      var userData = UserStore.getUserData();
      this.setState({
        nip: userData['employee_id'],
        id_employee: userData['id_employee'],
      });
    }

    // UserAction.checkSession();
  }

  doClearFaces = () => {
    this.setState({showLoading: true});
    AsyncStorage.getItem('totalTraining', (err, res) => {
      if (res == '1') {
        this.setState({showLoading: false});
        setTimeout(() => {
          Alert.alert('Info', `Data wajah sudah terhapus!`);
        }, 100);
        return false;
      } else {
        var configData = UserStore.getConfigData();
        var urlFacerecognize = configData['facerecognize'];
        var urlKey = configData['key'];

        const formData = new FormData();
        formData.append('key', urlKey);
        formData.append('user_id', this.state.nip);

        // do login process
        fetch(`${urlFacerecognize}/api/v1/face_recognize/clear_model`, {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
            ...HEADERS_CONFIG.headers,
          },
          body: formData,
        })
          .then((response) => response.json())
          .then((res) => {
            this.setState({showLoading: false});
            if (res.status == 'ok') {
              AsyncStorage.setItem('totalTraining', '1').then(() => {
                Alert.alert('Info', 'Data model wajah telah terhapus');
              });
            } else {
              Alert.alert(
                'Info',
                'Server terjadi gangguan, coba ulangi sekali lagi',
              );
            }
          })
          .catch((err) => {
            this.setState({showLoading: false});
            Toast.show({
              text: `Error: ${err}`,
              type: 'danger',
            });
          });
      }
    });
  };

  clearFaces = () => {
    Alert.alert(
      `Peringatan`,
      'Apakah ingin menghapus data model wajah anda?',
      [
        {
          text: 'Tidak',
        },
        {
          text: 'Ya',
          onPress: () => {
            this.doClearFaces();
          },
        },
      ],
      {
        cancelable: false,
      },
    );
  };

  registerFace = () => {
    AsyncStorage.getItem('totalTraining').then((result) => {
      if (result > 3) {
        Alert.alert('Info', 'Anda sudah pernah mendaftarkan wajah', [
          {text: 'OK'},
        ]);
      } else {
        this.props.navigation.push('FaceRegister');
      }
    });
  };

  render() {
    return (
      <>
        <ImageBackground
          // resizeMode={'stretch'}
          // or cover
          style={{flex: 1}} // must be passed from the parent, the number may vary depending upon your screen size
          source={require('../../assets/bg-login.png')}>
          {/* <HeaderLayout navigation={this.props.navigation} title="Kehadiran" /> */}
          <HeaderBack title="Daftar Kehadiran" />
          <View>
            <Spinner
              visible={this.state.showLoading}
              overlayColor="rgba(0, 0, 0, 0.25)"
              size="large"
            />

            <View
              data={items}
              renderItem={(item) => (
                <View item={item} navigation={this.props.navigation} />
              )}
              keyExtractor={(item, index) => `q${index}`}
              showsVerticalScrollIndicator={false}
            />

            {/* Card */}
            <View
              style={[
                style.cardListItem,
                {
                  marginTop: 20,
                  backgroundColor: 'transparent',
                  margin: 0,
                  borderRadius: 50,
                },
              ]}>
              <View
                style={{
                  backgroundColor: '#587058',
                  borderRadius: 50,
                  padding: 5,
                  marginBottom: 10,
                }}>
                <TouchableOpacity
                  style={{flexDirection: 'row'}}
                  onPress={() =>
                    this.props.navigation.navigate('AttendanceList')
                  }>
                  <Image
                    source={require('assets/menu/attendance-list.png')}
                    style={style.cardListImageItem}
                  />
                  <View
                    style={{
                      flexGrow: 0,
                      flexShrink: 1,
                      flexBasis: 'auto',
                      alignSelf: 'center',
                    }}>
                    <Text
                      style={{color: 'white', fontSize: 18, marginLeft: 10}}>
                      Daftar Kehadiran
                    </Text>
                  </View>
                  <View
                    style={{
                      flexGrow: 1,
                      flexShrink: 0,
                      flexBasis: 100,
                      alignSelf: 'center',
                      alignItems: 'flex-end',
                      marginEnd: 20,
                    }}>
                    <Icon name="long-arrow-right" size={24} color="#ffff" />
                  </View>
                </TouchableOpacity>
              </View>

              <View
                style={{
                  backgroundColor: '#587058',
                  borderRadius: 50,
                  padding: 5,
                  marginBottom: 10,
                }}>
                <TouchableOpacity
                  style={{flexDirection: 'row'}}
                  onPress={() => this.props.navigation.navigate('CheckInOut')}>
                  <Image
                    source={require('assets/menu/check-in.png')}
                    style={style.cardListImageItem}
                  />
                  <View
                    style={{
                      flexGrow: 0,
                      flexShrink: 1,
                      flexBasis: 'auto',
                      alignSelf: 'center',
                    }}>
                    <Text
                      style={{color: 'white', fontSize: 18, marginLeft: 10}}>
                      Presensi
                    </Text>
                  </View>
                  <View
                    style={{
                      flexGrow: 1,
                      flexShrink: 0,
                      flexBasis: 100,
                      alignSelf: 'center',
                      alignItems: 'flex-end',
                      marginEnd: 20,
                    }}>
                    <Icon name="long-arrow-right" size={24} color="#ffff" />
                  </View>
                </TouchableOpacity>
              </View>

              <View
                style={{
                  backgroundColor: '#587058',
                  borderRadius: 50,
                  padding: 5,
                  marginBottom: 10,
                }}>
                <TouchableOpacity
                  style={{flexDirection: 'row'}}
                  onPress={() => this.registerFace()}>
                  <Image
                    source={require('assets/menu/facerecog.png')}
                    style={style.cardListImageItem}
                  />
                  <View
                    style={{
                      flexGrow: 0,
                      flexShrink: 1,
                      flexBasis: 'auto',
                      alignSelf: 'center',
                    }}>
                    <Text
                      style={{color: 'white', fontSize: 18, marginLeft: 10}}>
                      Pendaftaran wajah
                    </Text>
                  </View>
                  <View
                    style={{
                      flexGrow: 1,
                      flexShrink: 0,
                      flexBasis: 100,
                      alignSelf: 'center',
                      alignItems: 'flex-end',
                      marginEnd: 20,
                    }}>
                    <Icon name="long-arrow-right" size={24} color="#ffff" />
                  </View>
                </TouchableOpacity>
              </View>

              <View
                style={{
                  backgroundColor: '#587058',
                  borderRadius: 50,
                  padding: 5,
                  marginBottom: 10,
                }}>
                <TouchableOpacity
                  style={{flexDirection: 'row'}}
                  onPress={() => this.clearFaces()}>
                  <Image
                    source={require('assets/menu/clear-face.png')}
                    style={style.cardListImageItem}
                  />
                  <View
                    style={{
                      flexGrow: 0,
                      flexShrink: 1,
                      flexBasis: 'auto',
                      alignSelf: 'center',
                    }}>
                    <Text
                      style={{color: 'white', fontSize: 18, marginLeft: 10}}>
                      Hapus data wajah
                    </Text>
                  </View>
                  <View
                    style={{
                      flexGrow: 1,
                      flexShrink: 0,
                      flexBasis: 100,
                      alignSelf: 'center',
                      alignItems: 'flex-end',
                      marginEnd: 20,
                    }}>
                    <Icon name="long-arrow-right" size={24} color="#ffff" />
                  </View>
                </TouchableOpacity>
              </View>

              <View
                style={{
                  backgroundColor: '#587058',
                  borderRadius: 50,
                  padding: 5,
                }}>
                <TouchableOpacity
                  style={{flexDirection: 'row'}}
                  onPress={() => {
                    this.props.navigation.navigate('TableLeave');
                  }}>
                  <Image
                    source={require('assets/menu/clear-face.png')}
                    style={style.cardListImageItem}
                  />
                  <View
                    style={{
                      flexGrow: 0,
                      flexShrink: 1,
                      flexBasis: 'auto',
                      alignSelf: 'center',
                    }}>
                    <Text
                      style={{color: 'white', fontSize: 18, marginLeft: 10}}>
                      Pengajuan Cuti
                    </Text>
                  </View>
                  <View
                    style={{
                      flexGrow: 1,
                      flexShrink: 0,
                      flexBasis: 100,
                      alignSelf: 'center',
                      alignItems: 'flex-end',
                      marginEnd: 20,
                    }}>
                    <Icon name="long-arrow-right" size={24} color="#ffff" />
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            {/* <View
              style={
                (style.cardListItem,
                {backgroundColor: 'transparent', margin: 0, borderRadius: 50})
              }>
              <View style={{backgroundColor: '#587058', borderRadius: 50}}>
                <TouchableOpacity
                  style={{flexDirection: 'row'}}
                  onPress={() => this.clearFaces()}>
                  <Image
                    source={require('assets/menu/clear-face.png')}
                    style={style.cardListImageItem}
                  />
                </TouchableOpacity>
              </View>
            </View> */}
          </View>
        </ImageBackground>
      </>
    );
  }
}

function mapStateToProps() {
  return {
    user: UserStore.getUserData(),
  };
}

export default connect(mapStateToProps)(Attendance);
