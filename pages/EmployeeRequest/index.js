import React, { Component } from 'react'
import style from '../../styles'
import HeaderLayout from '../HeaderLayout'

import {
  TouchableOpacity,
  Image,
} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'

import {
  Content,
  Container,
  Card,
  CardItem,
  Left,
  Right,
  Icon,
  Text,
 } from 'native-base'

export default class Claim extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nip: ''
    }
  }

  componentDidMount() {
    AsyncStorage.getItem('nip').then((result) => {
			this.setState({nip: result})
    })
	}

  render() {
    return (
      <Container>
        <HeaderLayout title='Pengajuan FPPK' navigation={this.props.navigation} />
        <Content>
          <Card style={style.cardListItem}>
            <CardItem>
              <TouchableOpacity style={{flexDirection: 'row'}} onPress={()=> this.props.navigation.navigate('EmployeeRequest')}>
                <Image source={require('assets/menu/sppd.png')} style={style.cardListImageItem} />
                <Left>
                  <Text style={style.cardTextTitle}>Pengajuan FPPK</Text>
                </Left>
                <Right>
                  <Icon active name='ios-arrow-forward' />
                </Right>
              </TouchableOpacity>
            </CardItem>
          </Card>

        </Content>
      </Container>
    )
  }
}
