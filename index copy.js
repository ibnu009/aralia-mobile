/**
 * @format
 * @flow
 */

import 'react-native-gesture-handler';
import { AppRegistry, StatusBar } from 'react-native';
import { name as appName } from './app.json';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import * as route from './routes';
import {Root} from 'native-base';

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

export default function App() {
  return (
    <Root>
      <NavigationContainer>
        <StatusBar barStyle="light-content" backgroundColor="#0966B9" />
        <Stack.Navigator
          initialRouteName="Blank"
          screenOptions={{ headerShown: false }}>
          {/* Single page */}
          <Stack.Screen
            options={TransitionPresets.SlideFromRightIOS}
            name="NotFound"
            component={route.NotFound}
          />
          <Stack.Screen options={TransitionPresets.SlideFromRightIOS} name="Blank" component={route.Blank} /> 
          <Stack.Screen options={TransitionPresets.SlideFromRightIOS} name="Login" component={route.Login} />
          <Stack.Screen options={TransitionPresets.SlideFromRightIOS} name="LostPassword" component={route.LostPassword} />
          <Stack.Screen options={TransitionPresets.SlideFromRightIOS} name="Home" component={route.Home} />
          <Stack.Screen
            options={TransitionPresets.SlideFromRightIOS}
            name="SearchEmployee"
            component={route.SearchEmployee}
          />
          <Stack.Screen
            options={TransitionPresets.SlideFromRightIOS}
            name="EmployeeInfo"
            component={route.EmployeeInfo}
          />
          <Stack.Screen
            options={TransitionPresets.SlideFromRightIOS}
            name="SearchCity"
            component={route.SearchCity}
          />
          <Stack.Screen
            options={TransitionPresets.SlideFromRightIOS}
            name="QRScanner"
            component={route.QRScanner}
          />
          <Stack.Screen options={TransitionPresets.SlideFromRightIOS} name="OfficeUpdate" component={route.OfficeUpdate} />
          <Stack.Screen options={TransitionPresets.SlideFromRightIOS} name="ChangePassword" component={route.ChangePassword} />
          <Stack.Screen options={TransitionPresets.SlideFromRightIOS} name="ChangeProfile" component={route.ChangeProfile} />
          <Stack.Screen options={TransitionPresets.SlideFromRightIOS} name="PreviewAttachment" component={route.PreviewAttachment} />

          {/* Sppd */}

          <Stack.Screen options={TransitionPresets.SlideFromRightIOS} name="SppdRequest" component={route.SppdRequest} />

          <Stack.Screen options={TransitionPresets.SlideFromRightIOS} name="SppdRespons" component={route.SppdRespons} />

          <Stack.Screen options={TransitionPresets.SlideFromRightIOS} name="SppdResponsDetail"
            component={route.SppdResponsDetail}
          />
          <Stack.Screen options={TransitionPresets.SlideFromRightIOS} name="Sppd" component={route.Sppd} />

          {/* PaySlip */}
          <Stack.Screen options={TransitionPresets.SlideFromRightIOS} name="PaySlipView" component={route.PayslipView} />
          <Stack.Screen options={TransitionPresets.SlideFromRightIOS} name="PaySlipList" component={route.PaySlipList} />

          {/* Attendance */}
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
            name="FaceRegister"
            component={route.FaceRegister}
          />
          <Stack.Screen
            options={TransitionPresets.SlideFromRightIOS}
            name="CheckInOut"
            component={route.CheckInOut}
          />
          <Stack.Screen
            options={TransitionPresets.SlideFromRightIOS}
            name="Overtime"
            component={route.Overtime}
          />
          <Stack.Screen
            options={TransitionPresets.SlideFromRightIOS}
            name="Dispensation"
            component={route.Dispensation}
          />

          {/* Claim */}
          <Stack.Screen options={TransitionPresets.SlideFromRightIOS} name="Claim" component={route.Claim} />
          <Stack.Screen
            options={TransitionPresets.SlideFromRightIOS}
            name="ClaimBalance"
            component={route.ClaimBalance}
          />
          <Stack.Screen
            options={TransitionPresets.SlideFromRightIOS}
            name="ClaimRequest"
            component={route.ClaimRequest}
          />

          {/* Leave */}
          <Stack.Screen options={TransitionPresets.SlideFromRightIOS} name="Leave" component={route.Leave} />
          <Stack.Screen
            options={TransitionPresets.SlideFromRightIOS}
            name="LeaveBalance"
            component={route.LeaveBalance}
          />
          <Stack.Screen
            options={TransitionPresets.SlideFromRightIOS}
            name="LeaveRequest"
            component={route.LeaveRequest}
          />

          {/* Worklist */}
          <Stack.Screen
            options={TransitionPresets.SlideFromRightIOS}
            name="Worklist"
            component={route.Worklist}
          />
          <Stack.Screen
            options={TransitionPresets.SlideFromRightIOS}
            name="WorklistList"
            component={route.WorklistList}
          />
          <Stack.Screen
            options={TransitionPresets.SlideFromRightIOS}
            name="WorklistDetail"
            component={route.WorklistDetail}
          />

          {/* My Request */}
          <Stack.Screen
            options={TransitionPresets.SlideFromRightIOS}
            name="MyRequestList"
            component={route.MyRequestList}
          />
          <Stack.Screen
            options={TransitionPresets.SlideFromRightIOS}
            name="MyRequestDetail"
            component={route.MyRequestDetail}
          />

          {/* Employee Request */}
          <Stack.Screen
            options={TransitionPresets.SlideFromRightIOS}
            name="EmployeeRequestIndex"
            component={route.EmployeeRequestIndex}
          />
          <Stack.Screen
            options={TransitionPresets.SlideFromRightIOS}
            name="EmployeeRequest"
            component={route.EmployeeRequest}
          />

          {/* Health Survey */}
          <Stack.Screen
            options={TransitionPresets.SlideFromRightIOS}
            name="HealthSurvey"
            component={route.HealthSurvey}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Root>
  );
}

AppRegistry.registerComponent(appName, () => App);
