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
  Alert,
} from 'react-native';

import {Button, Text, Item, Input, Card} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import {REST_URL, handleBack, HEADERS_CONFIG} from '../AppConfig';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      showLoading: false,
      showPassword: true,
    };
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
          ver. {packageJson.version}
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
                    borderWidth: 0,
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
              <View style={{marginLeft: 15, width: '89%'}}>
                <Input
                  placeholder="Password"
                  secureTextEntry={this.state.showPassword}
                  onChangeText={(password) => this.setState({password})}
                />
              </View>
            </View>

            <View style={{display: 'flex', width: '90%'}}>
              {/* <LinearGradient colors={['rgba(242,209,101,1)', 'rgba(196,141,39,1)']}> */}

              <Button
                success
                block
                style={
                  {
                    backgroundColor: '#3db964',
                    borderRadius: 10,
                  } /* {backgroundColor: '#FF0000'} */
                }
                onPress={() => this.doReset()}>
                <Text style={{color: 'white'}}>Reset Password</Text>
              </Button>
              <Button
                success
                block
                style={
                  (styles.buttonDanger,
                  {
                    borderRadius: 10,
                    marginTop: 10,
                    backgroundColor: '#ffc107',
                  }) /* {backgroundColor: '#FF0000'} */
                }
                onPress={() => this.props.navigation.goBack(null)}>
                <Text style={{color: 'white'}}>Kembali</Text>
              </Button>

              {/* </LinearGradient> */}
            </View>
          </Card>
        </View>
      </ImageBackground>
    );
  }

  doReset() {
    // do nothing when username and password is empty
    if (this.state.username == '' || this.state.email == '') return false;

    const RESET_URL = `${REST_URL}/reset`;
    Keyboard.dismiss();

    this.setState({showLoading: true});
    const formData = new FormData();
    formData.append('username', this.state.username);
    formData.append('email', this.state.email);
    formData.append('imei', DeviceInfo.getUniqueId());

    // do login process
    fetch(RESET_URL, {
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
        // console.log(res);
        this.setState({
          username: '',
          email: '',
        });
        Alert.alert(
          'Info',
          //'Reset password user berhasil. \nSilahkan periksa pesan masuk pada email anda, atau periksa pada kolom spam.',
          res.message,
          [
            {
              text: 'OK',
              onPress: () => this.props.navigation.navigate('Login'),
            },
          ],
          {cancelable: false},
        );
      })
      .catch((err) => {
        this.setState({showLoading: false});
        Toast.show(`Error when doing password reset :\n ${err}`, Toast.SHORT);
      });
  }
}

const style = StyleSheet.create({
  logo: {
    aspectRatio: 2,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -80,
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
