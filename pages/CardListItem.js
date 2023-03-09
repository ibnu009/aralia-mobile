import React, { Component } from 'react';
import DeviceInfo from 'react-native-device-info'
import { Image, TouchableOpacity } from 'react-native';
import * as UserAction from '../remx/User/actions';
import styles from '../styles';
import { Card, CardItem, Left, Right, Icon, Text } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import { Alert } from "react-native";
import { store as ServiceStore } from '../remx/Service/store'
import { store as UserStore } from '../remx/User/store';

class CardListItem extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    UserAction.checkSession()
  }

  featureCheck = (target, param) => {
    let user = UserStore.getUserData()
    let featureData = ServiceStore.getFeatureData()
    // if (featureData[target] == 'true') {
      this.props.navigation.push(target, param);
    // } else {
    //   Alert.alert('Info', `Fitur belum dapat digunakan`, [
    //     { text: 'Close' },
    //   ]);
    // }
  }

  render() {
    let item = this.props.item.item;

    return (
      <>
        <Card style={styles.cardListItem,{backgroundColor:"transparent",margin:0, borderRadius:50}}>
          <CardItem style={{backgroundColor:'#587058', borderRadius:50}}>
            <TouchableOpacity
              style={{ flexDirection: 'row' }}
              onPress={() => this.featureCheck(item.route, { ...item.routeParam })}>
              <Image source={item.image} style={styles.cardListImageItem} />
              <Left>
                <Text style={styles.cardTextTitle}>{item.title}</Text>
              </Left>
              <Right>
                <Icon active name="ios-arrow-forward" />
              </Right>
            </TouchableOpacity>
          </CardItem>
        </Card>
      </>
    );
  }
}

export default CardListItem;
