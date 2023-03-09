import {
  View,
  Text,
  Image,
  BackHandler,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect} from 'react';
import styles from '../styles';
import {store as UserStore} from '../remx/User/store';
import Attendance from './Attendance/index';
import HeaderLogo from './HeaderLogo';
// import {useNavigation} from '@react-navigation/native';

const Home = ({navigation}) => {
  // const navigation = useNavigation();
  const {username, employee_name, url_foto} = UserStore.getUserData();

  useEffect(() => {
    setTimeout(() => {
      var userData = UserStore.getUserData();
      // console.log(userData);
    }, 5000);
  });

  return (
    <>
      <View style={styles.container}>
        <HeaderLogo />
        <ImageBackground
          source={require('../assets/bg-login.png')}
          resizeMode="cover"
          style={{height: 680}}>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <View style={{marginTop: 100}}>
              <Image
                source={{uri: url_foto}}
                style={{width: 100, height: 100, borderRadius: 15}}
              />
              <Text style={styles.textLabel}>{username}</Text>
              <Text style={styles.textLabel}>{employee_name}</Text>
            </View>
            <View style={{marginTop: 100}}>
              <TouchableOpacity
                onPress={() => {
                  console.log(navigation.navigate('Attendance'));
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
