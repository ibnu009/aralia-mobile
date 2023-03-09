import React, {Component} from 'react';
import DeviceInfo from 'react-native-device-info';
import styles from '../styles';
import * as UserAction from '../remx/User/actions';
import {encode} from 'base-64';
import md5 from 'md5';
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-community/async-storage';
import Toast from 'react-native-simple-toast';
import packageJson from '../package.json';
import {store} from '../remx/User/store';

import {
  StyleSheet,
  View,
  StatusBar,
  Switch,
  ImageBackground,
  Image,
  Keyboard,
  Dimensions,
  BackHandler,
  Text,
  TouchableOpacity,
} from 'react-native';

// import {Button, Text, Item, Input, Card, Icon} from 'native-base';
import {Button, Input, Card} from 'native-base';
import {REST_URL, handleBack, HEADERS_CONFIG} from '../AppConfig';
import Icon from 'react-native-vector-icons/FontAwesome';

const saveData = async (key, val) => {
  try {
    await AsyncStorage.setItem(key, val);
    console.log('Data is saved with value');
    console.log(val);
  } catch (e) {
    console.log('Failed to save the data to the storage');
  }
};

const saveMultiData = async (key1, val1, key2, val2) => {
  const items = [
    [key1, val1],
    [key2, val2],
  ];
  try {
    AsyncStorage.multiSet(items, () => {
      console.log('Data is saved with value');
      console.log(items);
    });
  } catch (e) {
    console.log('Failed to save the data to the storage');
    console.log(e);
  }
};

const readDataTokenFCM = async () => {
  try {
    const value = await AsyncStorage.getItem('device_id_fcm');
    console.log('Token FCM ADALAH');
    console.log(value);
    if (value !== null) {
      return value;
    }
  } catch (e) {
    console.log(e);
    alert('Failed to fetch the input from storage');
  }
};
export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: 'PQ06042531',
      password: 'EMAS@4321',
      // username: '',
			// password: '',
      showLoading: false,
      showPassword: true,
    };
    this.toggleSwitch = this.toggleSwitch.bind(this);
  }

  componentDidMount() {
    // AsyncStorage.setItem('nip', 'P81190');
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBack,
    );

    this.props.navigation.addListener('willBlur', () =>
      this.backHandler.remove(),
    );
  }

  toggleSwitch() {
    this.setState({showPassword: !this.state.showPassword});
  }

  storeQuesioner = async (value) => {
    try {
      await AsyncStorage.setItem('@quesioner_count', value);
    } catch (e) {
      console.log(e);
    }
  };

  doLogin() {
    // do nothing when username and password is empty
    if (this.state.username == '' && this.state.password == '') return false;

    const LOGIN_URL = `${REST_URL}/login`;
    Keyboard.dismiss();

    this.setState({showLoading: true});
    const formData = new FormData();
    formData.append('username', this.state.username);
    formData.append('password', this.state.password);
    formData.append('imei', DeviceInfo.getUniqueId());

    // do login process
    fetch(LOGIN_URL, {
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
        readDataTokenFCM()
          .then((data) => {
            console.log('Token FCM dalam data ADALAH');
            console.log(data);

            const formDataTokenFcm = new FormData();
            formDataTokenFcm.append('device_token', data);
            let urlStoreToken = `${REST_URL}/device_token/upsert`;

            fetch(urlStoreToken, {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${res.token}`,
                // ...HEADERS_CONFIG.headers,
              },
              body: formDataTokenFcm,
            })
              .then((response) => {
                // response.json();
                console.log('response is');
                console.log(response);
              })
              .then((responseJSON) => {
                // console.log('response is');
                // console.log(responseJSON);
              });
          })
          .catch((err) => console.log(err));

        console.log('response is :');
        console.log(res);

        if (res.status == 'error') {
          this.setState({password: ''});
          Toast.show(res.message, Toast.LONG);
          store.setConfigData({});
        } else if (res.status == 'success') {
          // set config API
          store.setConfigData(res.mobileapi);

          console.log('message is :');
          console.log(res.message);

          AsyncStorage.setItem('pw', res.values.password).then(() => {
            console.log('token is :');
            console.log(res.token);
            console.log(typeof res.token);

            // AsyncStorage.setItem('tokk', res.token,).then(() => {});
            AsyncStorage.setItem('eid', res.values.id_employee).then(() => {});
            // this.props.navigation.navigate('MainApp');

            saveMultiData(
              'tokk',
              res.token,
              'nip',
              res.values.employee_id,
            ).then(() => {
              // get user detail, store to remx
              UserAction.getUserDetail(res.values.id_employee);
              UserAction.setQuesionerData(
                res.values.check_quesioner,
                res.values.is_quesioner,
              );

              if (res.values.is_office_update == '1') {
                this.props.navigation.navigate('OfficeUpdate');
                // }else if((res.values.is_office_update == '0') && (res.values.is_quesioner == '1') && (res.values.check_quesioner < 1)) {
                // 	this.props.navigation.navigate('HealthSurvey');
              } else {
                this.props.navigation.navigate('MainApp');
              }
            });
          });
        }
      })
      .catch((err) => {
        store.setConfigData({});
        this.setState({showLoading: false});
        console.log('err is :');
        console.log(err);
        Toast.show(`Error when doing login :\n ${err}`, Toast.SHORT);
      });
  }

  doLostPassword() {
    this.props.navigation.navigate('LostPassword');
  }

  render() {
    return (
      <ImageBackground
        source={require('assets/bg-login.png')}
        style={{
          width: Dimensions.get('screen').width,
          height: Dimensions.get('screen').height,
        }}>
        <Text
          style={{
            textAlign: 'right',
            paddingRight: 2,
            fontSize: 10,
            fontWeight: '100',
            color: '#fff',
          }}>
          {packageJson.version}
        </Text>

        <View style={style.container}>
          <StatusBar
            backgroundColor={styles.statusbarAccent.backgroundColor}
            barStyle="light-content"
          />

          <Spinner
            visible={this.state.showLoading}
            color={styles.statusbarAccent.backgroundColor}
            size="large"
          />

          <Image source={require('assets/logo.png')} style={style.logo} />

          <Card transparent style={style.loginBox}>
            <View regular style={[style.textInput, {flexDirection: 'row'}]}>
              {/* <Icon active name="user" type="AntDesign" /> */}
              <Icon
                name="user-o"
                size={28}
                color="#1c1e26"
                style={{
                  alignSelf: 'center',
                }}
              />
              <View style={{marginLeft: 10, width: '86%'}}>
                <Input
                  style={{
                    backgroundColor: 'transparent',
                  }}
                  placeholder="User ID"
                  onChangeText={(text) => this.setState({username: text})}
                />
              </View>
            </View>

            <View
              regular
              style={[
                style.textInput,
                {
                  flexDirection: 'row',
                },
              ]}>
              {/* <Icon active name="lock" type="AntDesign" /> */}
              <Icon
                name="unlock-alt"
                size={28}
                color="#1c1e26"
                style={{
                  alignSelf: 'center',
                }}
              />
              <View style={{marginLeft: 15, width: '86%'}}>
                <Input
                  style={{
                    backgroundColor: 'transparent',
                  }}
                  placeholder="Password"
                  secureTextEntry={this.state.showPassword}
                  onChangeText={(password) => this.setState({password})}
                />
              </View>
            </View>
            <View
              regular
              style={[style.securePassword, {flexDirection: 'row'}]}>
              <Switch
                onValueChange={this.toggleSwitch}
                value={!this.state.showPassword}
              />
              <Text
                style={[
                  style.labelShowPassword,
                  {
                    alignSelf: 'center',
                  },
                ]}>
                Show password
              </Text>
            </View>

            <View style={{display: 'flex', width: '90%'}}>
              {/* <LinearGradient colors={['rgba(242,209,101,1)', 'rgba(196,141,39,1)']}> */}

              <TouchableOpacity
                onPress={() => this.doLogin()}
                style={{
                  width: '100%',
                  backgroundColor: 'green',
                  padding: 10,
                  borderRadius: 5,
                  justifyContent: 'center',
                }}>
                <Text style={{textAlign: 'center', color: 'white'}}>Login</Text>
              </TouchableOpacity>

              {/* </LinearGradient> */}
            </View>
            <View
              style={{
                paddingLeft: 3,
                marginTop: 20,
                display: 'flex',
                width: '90%',
              }}>
              <Text
                style={{color: 'white', fontWeight: 'bold', fontSize: 12}}
                onPress={() => this.doLostPassword()}>
                Lupa Password Anda ?
              </Text>
            </View>
          </Card>
        </View>
      </ImageBackground>
    );
  }
}

const style = StyleSheet.create({
  logo: {
    aspectRatio: 2,
    resizeMode: 'contain',
    marginBottom: 30,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelShowPassword: {
    fontSize: 11,
  },
  textInput: {
    width: '90%',
    // borderWidth: 1,
    // borderColor: '#ccc',
    borderRadius: 10,
    paddingLeft: 10,
    marginBottom: 10,
    // color: '#fff',
    backgroundColor: '#fff',
  },

  securePassword: {
    width: '100%',
    // borderWidth: 1,
    // borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 10,
    paddingLeft: 15,
    borderColor: 'rgba(255, 99, 71, 0)',
    // color: '#fff',
  },

  loginBox: {
    width: '90%',
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(207,207,207,0.4)',
    paddingTop: 20,
    paddingBottom: 20,
    borderRadius: 10,
  },
});
