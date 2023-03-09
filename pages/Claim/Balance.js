import React, { Component } from 'react'
import HeaderLayout from  '../HeaderLayout'
import {
  Image,
} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'

import style from '../../styles'

import {
  Container,
  Content,
  Form,
  Item,
  Label,
  Picker,
  ListItem,
  List,
  Text,
  Right,
  Left,
} from 'native-base'

export default class ClaimBalance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nip: '',
      selectedType: '',
      selectedPeriod: '',
    }
  }

  componentDidMount() {
    AsyncStorage.getItem('nip').then((result) => {
			this.setState({nip: result})
    })
  }

  render() {
    function yearOptionItems() {
      var arr = []
      let a = new Date().getFullYear()
      for (let i = a; i>(a-3); i--) {
        arr.push(`${i}`)
      }
      return arr
    }

    return (
      <Container>
        <HeaderLayout title='Saldo Klaim' navigation={this.props.navigation} />
        <Content>
          <Form>
            <Item>
              <Label style={style.textInputLabel}>Tipe</Label>
              <Picker
                note
                mode="dropdown"
                style={{ width: 120 }}>

                <Picker.Item label='Claim' value='0' />
              </Picker>
            </Item>
            <Item>
              <Label style={style.textInputLabel}>Periode</Label>
              <Picker
                note
                mode="dropdown"
                selectedValue={this.state.selectedPeriod}
                onValueChange={(val)=> this.setState({selectedPeriod: val})}
                style={{ width: 120 }}>
                { yearOptionItems().map((label, i) =>
                  <Picker.Item label={label} value={label} key={i} />
                )}
              </Picker>
            </Item>
            <ListItem itemDivider />
            <List>
              <ListItem>
                <Left>
                  <Image source={require('assets/cost.png')} style={style.imageInputLabel} />
                  <Text>Total Paid</Text>
                </Left>
                <Right>
                  <Text>Rp.0</Text>
                </Right>
              </ListItem>
              <ListItem>
                <Left>
                  <Image source={require('assets/cost.png')} style={style.imageInputLabel} />
                  <Text>Total Unpaid</Text>
                </Left>
                <Right>
                  <Text>Rp.0</Text>
                </Right>
              </ListItem>
              <ListItem>
                <Left>
                  <Image source={require('assets/cost.png')} style={style.imageInputLabel} />
                  <Text>Balance</Text>
                </Left>
                <Right>
                  <Text>Rp.0</Text>
                </Right>
              </ListItem>
            </List>
          </Form>
        </Content>
      </Container>
    )
  }
}
