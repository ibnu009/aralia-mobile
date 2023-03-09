import React from 'react';
import styles from '../styles';
import packageJson from '../package.json';

import {Heading, Card, Text, Icon} from 'native-base';

import {Image, TouchableOpacity, Platform, View} from 'react-native';

export default class HeaderLayout extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Heading
        transparent
        style={[
          styles.statusbar,
          {
            marginBottom: 20,
            padding: 10,
          },
        ]}
        // hasTabs
        androidStatusBarColor={[styles.statusbarAccent.backgroundColor]}
        iosBarStyle="light-content">
        {this.props.title ? (
          <TouchableOpacity
            onPress={() => this.props.navigation.goBack()}
            style={{
              width: 20,
              left: 5,
              top: Platform.OS == 'android' ? 15 : 7.5,
            }}>
            <Icon
              active
              name="ios-arrow-back"
              style={{color: '#fff', marginLeft: 20}}
            />
          </TouchableOpacity>
        ) : (
          <View>
            <Image
              source={require('assets/logo.png')}
              style={styles.statusBarImage}
            />
          </View>
        )}
        <Card style={{alignItems: 'center'}}>
          <Text
            style={{
              color: '#ffffff',
              position: 'absolute',
              textAlign: 'right',
              width: '100%',
              fontSize: 10,
              marginTop: -13,
            }}>
            ver. {packageJson.version}
          </Text>
          <Text style={[styles.statusbarTitle, {marginTop: 20}]}>
            {this.props.title}
          </Text>
        </Card>
      </Heading>
    );
  }
}
