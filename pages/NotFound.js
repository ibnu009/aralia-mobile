import React, {Component} from 'react';
import {View, Text, Image} from 'react-native';
import {normalize} from '../styles';

export default class NotFound extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <>
        <View
          style={{
            ...this.props,
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
          }}>
          <Image
            source={require('assets/sad.png')}
            style={{width: 100, height: 100}}
          />
          <Text
            style={{
              fontWeight: '600',
              top: 15,
              color: '#CEC9C9',
              fontSize: normalize(19),
              paddingBottom: 15,
            }}>
            Nothing to see here
          </Text>
        </View>
      </>
    );
  }
}
