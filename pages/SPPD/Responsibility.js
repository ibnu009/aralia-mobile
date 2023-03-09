import React, {Component} from 'react';
import HeaderLayout from '../HeaderLayout';
import style from '../../styles';
import {store} from '../../remx/Service/store';
import * as action from '../../remx/Service/actions';
import AsyncStorage from '@react-native-community/async-storage';
import {REST_URL, HEADERS_CONFIG} from '../../AppConfig';
import {
  Container,
  Content,
  Text,
  Card,
  CardItem,
  Left,
  Right,
  Icon,
  View,
} from 'native-base';

import {Image, TouchableOpacity, RefreshControl} from 'react-native';

export default class Responsibility extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nip: '',
      refreshing: false,
      data: [],
    };
  }

  componentDidMount() {
    AsyncStorage.getItem('nip')
      .then((result) => {
        this.setState({nip: result});
      })
      .then(() => {
        const uri = `${REST_URL}/sppd/respons.php`;
        fetch(uri, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            ...HEADERS_CONFIG.headers,
          },
          body: `nip=${this.state.nip}`,
        })
          .then((response) => response.json())
          .then((res) => {
            this.setState({data: res.data});
          });
      });
  }

  _refresh = () => {
    this.setState({refreshing: true});
    action.getMyRequest();
    store.getMyRequestData();
  };

  render() {
    const {navigate} = this.props.navigation;

    return (
      <Container>
        <HeaderLayout title="List SPPD" navigation={this.props.navigation} />
        <Content
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._refresh}
              title="Loading..."
            />
          }>
          {this.state.data == 'Empty' ? (
            <Card key="0" style={style.cardListItem}>
              <CardItem>
                <Text
                  style={[style.cardTextTitle, {flex: 1, textAlign: 'center'}]}>
                  Empty
                </Text>
              </CardItem>
            </Card>
          ) : this.state.data.length > 0 ? (
            this.state.data.map((e, i) => {
              return (
                <Card key={i} style={style.cardListItem}>
                  <CardItem>
                    <TouchableOpacity
                      style={{flexDirection: 'row'}}
                      onPress={() =>
                        navigate('ResponsibilityDetail', {
                          id: e.id,
                          no_surat: e.no_surat,
                          kso_kasusnomor: e.kso_kasusnomor,
                        })
                      }>
                      <Image
                        source={require('assets/file.png')}
                        style={style.cardListImageItem}
                      />
                      <Left>
                        <Text style={style.cardTextTitle}>{e.no_surat}</Text>
                      </Left>
                      <Right>
                        <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                          <Icon name="arrow-back" />
                          <Text
                            style={{
                              fontSize: 20,
                              paddingLeft: 10,
                              paddingRight: 10,
                            }}>
                            Pilih
                          </Text>
                        </View>
                      </Right>
                    </TouchableOpacity>
                  </CardItem>
                </Card>
              );
            })
          ) : (
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._refresh}
              title="Loading..."
            />
          )}
        </Content>
      </Container>
    );
  }
}
