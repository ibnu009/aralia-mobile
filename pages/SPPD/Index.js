import React, { Component } from 'react';
import styles from '../../styles';
import HeaderLayout from '../HeaderLayout';
import { TouchableOpacity, Image } from 'react-native';

import {
  Content,
  Container,
  Card,
  CardItem,
  Left,
  Right,
  Icon,
  Text,
} from 'native-base';

export default class SuratTugas extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Container>
        <HeaderLayout title="Surat Tugas" navigation={this.props.navigation} />
        <Content>
          <Card style={styles.cardListItem}>
            <CardItem>
              <TouchableOpacity
                style={{ flexDirection: 'row' }}
                onPress={() => this.props.navigation.navigate('Sppd')}>
                <Image
                  source={require('assets/menu/sppd.png')}
                  style={styles.cardListImageItem}
                />
                <Left>
                  <Text style={styles.cardTextTitle}>Pengajuan</Text>
                </Left>
                <Right>
                  <Icon active name="ios-arrow-forward" />
                </Right>
              </TouchableOpacity>
            </CardItem>
          </Card>

          <Card style={styles.cardListItem}>
            <CardItem>
              <TouchableOpacity
                style={{ flexDirection: 'row' }}
                onPress={() =>
                  this.props.navigation.navigate('Responsibility')
                }>
                <Image
                  source={require('assets/menu/sppd.png')}
                  style={styles.cardListImageItem}
                />
                <Left>
                  <Text style={styles.cardTextTitle}>
                    Pertanggungjawaban SPPD
                  </Text>
                </Left>
                <Right>
                  <Icon active name="ios-arrow-forward" />
                </Right>
              </TouchableOpacity>
            </CardItem>
          </Card>
        </Content>
      </Container>
    );
  }
}
