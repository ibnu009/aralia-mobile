import {
  View,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import styles from '../styles';
import {store as UserStore} from '../remx/User/store';
import HeaderLogo from './HeaderLogo';
import packageJson from '../package.json';
// import {useNavigation} from '@react-navigation/native';
const Home = ({navigation}) => {
  // const navigation = useNavigation();
  const {username, employee_name, url_foto} = UserStore.getUserData();
  const [userData, setUserData] = useState({});
  useEffect(() => {
    setUserData(UserStore.getUserData());
  });

  return (
    <>
      <View style={styles.container}>
        <Text
          style={{
            textAlign: 'right',
            width: Dimensions.get('screen').width,
            paddingRight: 10,
            fontSize: 10,
            fontWeight: '100',
            color: '#fff',
            backgroundColor: 'rgba(52, 52, 52, 0.8)'
          }}>
          {packageJson.version}
        </Text>
        <HeaderLogo />
        <ImageBackground
          source={require('../assets/bg-login.png')}
          resizeMode="cover"
          style={{
            width: Dimensions.get('screen').width,
            height: Dimensions.get('screen').height,
          }}>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <View style={{marginTop: 100}}>
              <Image
                source={userData.url_foto
                  ? {uri: userData.url_foto}
                  : require('assets/default.png')}
                style={{width: 100, height: 100, borderRadius: 15}}
              />
              <Text style={styles.textLabel}>{userData.username}</Text>
              <Text style={styles.textLabel}>{userData.employee_name}</Text>
            </View>
            <View style={{marginTop: 100}}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('Attendance');
                }}>
                <Image source={require('../assets/menu/fingerlogo.png')} />
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </View>
    </>
  );
};

export default Home;
