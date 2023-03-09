/**
 * @format
 * @flow
 */

import 'react-native-gesture-handler';
import {
  AppRegistry,
  StatusBar,
  Alert,
  Modal,
  View,
  TouchableOpacity,
} from 'react-native';
import {name as appName} from './app.json';
import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import * as route from './routes';
import {NativeBaseProvider} from 'native-base';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from './pages/Home';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Personal from './pages/Tabs/Personal';
import NotFound from './pages/NotFound';
import SettingScreen from './pages/Tabs/Settings';
import Attendance from './pages/Attendance/index';
import TableLeave from './pages/Leave/TableLeave';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-community/async-storage';
import {styles} from './styles';

const Stack = createStackNavigator();
const config = {
  animation: 'timing',
  config: {
    duration: 250,
    useNativeDriver: true,
  },
};

const options = {
  transitionSpec: {
    open: config,
    close: config,
  },
};

function MainApp() {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home';
          } else if (route.name === 'NotFound') {
            iconName = focused ? 'wechat' : 'wechat';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'gears' : 'gear';
          } else if (route.name === 'Personal') {
            iconName = focused ? 'user-circle-o' : 'user-circle';
          }

          // You can return any component that you like here!
          return <FontAwesome name={iconName} size={size} color={color} />;
        },
        headerShown: false,
        tabBarActiveTintColor: 'yellow',
        tabBarInactiveTintColor: 'white',
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#37394e',
        },
      })}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="NotFound" component={NotFound} />
      <Tab.Screen name="Settings" component={SettingScreen} />
      <Tab.Screen name="Personal" component={Personal} />
    </Tab.Navigator>
  );
}
const screenOptions = {
  tabBarStyle: {
    backgroundColor: '#0000ff',
    height: 100,
  },
  tabBarItemStyle: {
    backgroundColor: '#00ff00',
    margin: 5,
    borderRadius: 10,
  },
};

const saveData = async (key, val) => {
  try {
    AsyncStorage.setItem(key, val).then(() => {
      console.log('Device id Saved with value');
      console.log(val);
    });
  } catch (e) {
    console.log('Failed to save the data to the storage');
    console.log(e);
    // alert()
  }
};

export default function App() {
  const checkToken = async () => {
    const fcmToken = await messaging().getToken();
    console.log('Getting token');

    if (fcmToken) {
      console.log(fcmToken);
      saveData('device_id_fcm', fcmToken);
    } else {
      console.log('Token is missing');
    }
  };

  checkToken();

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert(
        remoteMessage.notification.title,
        remoteMessage.notification.body,
      );
      console.log('HALO HALO');
      console.log(remoteMessage.notification.title);
      console.log(remoteMessage.notification.body);
    });
    // Unmount FCM if done
    return unsubscribe;
  }, []);

  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{headerShown: false}}>
          <Stack.Screen
            options={TransitionPresets.SlideFromRightIOS}
            name="NotFound"
            component={route.NotFound}
          />
          <Stack.Screen
            options={TransitionPresets.SlideFromRightIOS}
            name="Blank"
            component={route.Blank}
          />
          <Stack.Screen
            options={TransitionPresets.SlideFromRightIOS}
            name="Leave"
            component={route.Leave}
          />
          <Stack.Screen
            options={TransitionPresets.SlideFromRightIOS}
            name="TableLeave"
            component={route.TableLeave}
          />
          <Stack.Screen
            options={TransitionPresets.SlideFromRightIOS}
            name="LeaveSuccess"
            component={route.LeaveSuccess}
          />
          <Stack.Screen
            options={TransitionPresets.SlideFromRightIOS}
            name="LeaveFailed"
            component={route.LeaveFailed}
          />
          <Stack.Screen
            options={TransitionPresets.SlideFromRightIOS}
            name="AttendanceSuccess"
            component={route.AttendanceSuccess}
          />
          <Stack.Screen
            options={TransitionPresets.SlideFromRightIOS}
            name="AttendanceFailed"
            component={route.AttendanceFailed}
          />
          <Stack.Screen
            options={TransitionPresets.SlideFromRightIOS}
            name="Attendance"
            component={route.Attendance}
          />
          <Stack.Screen
            options={TransitionPresets.SlideFromRightIOS}
            name="AttendanceList"
            component={route.AttendanceList}
          />
          <Stack.Screen
            options={TransitionPresets.SlideFromRightIOS}
            name="CheckInOut"
            component={route.CheckInOut}
          />
          <Stack.Screen
            options={TransitionPresets.SlideFromRightIOS}
            name="ChangeProfile"
            component={route.ChangeProfile}
          />
          <Stack.Screen
            options={TransitionPresets.SlideFromRightIOS}
            name="MainApp"
            component={MainApp}
          />
          {/* <Stack.Screen
            options={TransitionPresets.SlideFromRightIOS}
            name="Login"
            component={route.Login}
          /> */}
          <Stack.Screen
            options={TransitionPresets.SlideFromRightIOS}
            name="Login"
            component={route.Login}
          />
          <Stack.Screen
            options={TransitionPresets.SlideFromRightIOS}
            name="LostPassword"
            component={route.LostPassword}
          />
          <Stack.Screen
            options={TransitionPresets.SlideFromRightIOS}
            name="Home"
            component={route.Home}
          />
          <Stack.Screen
            options={TransitionPresets.SlideFromRightIOS}
            name="FaceRegister"
            component={route.FaceRegister}
          />
          <Stack.Screen
            options={TransitionPresets.SlideFromRightIOS}
            name="HealthSurvey"
            component={route.HealthSurvey}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
}

AppRegistry.registerComponent(appName, () => App);
