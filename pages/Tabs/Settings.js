import React, {Component} from 'react';
import {connect} from 'remx';
import {store as ServiceStore} from '../../remx/Service/store';
import {store as UserStore} from '../../remx/User/store';
import * as UserAction from '../../remx/User/actions';
import {handleBack} from '../../AppConfig';
// import {
//   Container,
//   Content,
//   Body,
//   Text,
//   Left,
//   View,
//   Icon,
//   Button,
//   Right,
// } from 'native-base';

import {ImageBackground, Dimensions, View, Text, TextInput} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

import AsyncStorage from '@react-native-community/async-storage';
import {TouchableOpacity, Alert} from 'react-native';
import HeaderLogo from '../HeaderLogo';

const {width, height} = Dimensions.get('screen');

class TabSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    // UserAction.checkSession();
  }

  featureCheck = (target) => {
    const {featureData} = this.props;
    if (featureData[target] == 'true') {
      this.props.navigation.push(target);
    } else {
      Alert.alert('Info', `Fitur belum dapat digunakan`, [{text: 'Close'}]);
    }
  };

  logout = () => {
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
            AsyncStorage.clear();
            this.props.navigation.reset({
              index: 0,
              routes: [{name: 'Login'}],
            });
            this.props.navigation.navigate('Login');
          },
        },
      ],
      {
        cancelable: false,
      },
    );
  };

  render() {
    return (
      <View>
        <HeaderLogo />
        <View>
          <ImageBackground
            source={require('assets/bg-login.png')}
            style={{width: height, height: height}}>
            <View
              style={{
                marginTop: 10,
                borderRadius: 50,
                width: width * 1,
                height: height * 0.08,
                backgroundColor: '#ccc',
                marginLeft: 0,
                paddingLeft: 20,
              }}>
              <TouchableOpacity
                style={{flexDirection: 'row', alignItems: 'center', flex: 1}}
                onPress={() => this.featureCheck('ChangePassword')}>
                <View>
                  <TouchableOpacity
                    style={{
                      backgroundColor: '#438A5E',
                      width: 30,
                      borderRadius: 5,
                      alignItems: 'center',
                    }}>
                    <Icon name="question" size={30} color="#fff" />
                  </TouchableOpacity>
                </View>
                <View>
                  <Text
                    style={{
                      marginLeft: 20,
                    }}>
                    Ubah Katasandi
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            <View
              icon
              style={{
                marginTop: 10,
                backgroundColor: '#587058',
                borderRadius: 50,
                width: width * 1,
                height: height * 0.08,
                backgroundColor: '#ccc',
                marginLeft: 0,
                paddingLeft: 18,
              }}>
              <TouchableOpacity
                style={{flexDirection: 'row', alignItems: 'center', flex: 1}}
                onPress={() => this.logout()}>
                <View>
                  <Text
                    style={{
                      backgroundColor: '#438A5E',
                      width: 30,
                      borderRadius: 5,
                      alignItems: 'center',
                    }}>
                    <Icon name="sign-out" size={30} color="white" />
                    {/* <Icon active name="log-out" /> */}
                  </Text>
                </View>
                <View>
                  <Text
                    style={{
                      marginLeft: 20,
                    }}>
                    Logout
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>
      </View>
    );
  }
}

function mapStateToProps() {
  return {
    featureData: ServiceStore.getFeatureData(),
    user: UserStore.getUserData(),
  };
}

export default connect(mapStateToProps)(TabSettings);
