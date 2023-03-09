import React, { Component } from 'react'
import { connect } from 'remx'
import { store } from '../../remx/Service/store'
import * as action from '../../remx/Service/actions'
import HeaderLayout from '../HeaderLayout'
import styles from '../../styles'
import AsyncStorage from '@react-native-community/async-storage'
import {
  Image,
  View,
  ActivityIndicator
} from 'react-native'

import {
  Container,
  Content,
  List,
  ListItem,
  Text,
  Label,
  Left,
  Right,
  Icon,
} from 'native-base'


class MyRequestDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      nip: '',
      isLoading: true,
    }
  }

  componentDidMount() {
    AsyncStorage.getItem('nip', (err, result) => {
      if (result) this.setState({ nip: result })
    })
    const { kso } = this.props.route.params
    action.getMyRequestById(kso)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.data != store.getMyRequestById()) {
      this.setState({ isLoading: false })
    }
  }

  render() {
    const { data } = this.props
    const { kso } = this.props.route.params
    let requestData = null
    if (data.toString() != '') {
      data.map(e => {
        if (kso == e.kso) {
          requestData = e.data
        }

      })
    }

    return (
      <Container>
        <HeaderLayout title='Detail Permohonan' navigation={this.props.navigation} />
        <Content>
          {this.state.isLoading && <ActivityIndicator size="large" style={styles.loading} color={styles.loading.color} />}

          <List>
            {!this.state.isLoading && requestData.map((e, i) => {
              let status = ''
              if (e.status_kasus !== null) {
                status = e.status_kasus.substr(0, 1).toUpperCase() + e.status_kasus.substr(1, e.status_kasus.length - 1)
              }
              if (e.nama_aktivitas.includes('Create')) {
                status = 'Setuju'
              }

              let image = null
              switch (status) {
                case '':
                  image = require('assets/waiting-icon.png')
                  break;
                case 'Setuju':
                  image = require('assets/approve-icon.png')
                  break;
                case 'Tolak':
                  image = require('assets/cross-icon.png')
                  break;
                case 'Tidak Setuju':
                  image = require('assets/cross-icon.png')
                  break;
              }

              return (
                <View key={i}>
                  <ListItem>
                    <Left style={{ flexDirection: 'column' }}>
                      <View style={{ flexDirection: 'row' }}>
                        <Image source={require('assets/user.png')} style={styles.imageInputLabel} />
                        <Text>{e.nama_aktivitas}</Text>
                      </View>
                      <Label style={{ left: 25 }}>{e.user}</Label>
                    </Left>
                    <Right>
                      <Image source={image} style={{ height: 50, width: 50 }} />
                    </Right>
                  </ListItem>
                  <ListItem>
                    <Left>
                      <Image source={require('assets/calendar.png')} style={styles.imageInputLabel} />
                      <Text>Tanggal Permohonan</Text>
                    </Left>
                    <Right>
                      <Text>{(e.tanggal_buat !== null) ? e.tanggal_buat : '-'}</Text>
                    </Right>
                  </ListItem>
                  {(i < requestData.length - 1) ? <ListItem itemDivider style={{ justifyContent: 'center', paddingTop: 0, paddingBottom: 0, }}>
                    <Icon name="ios-arrow-down" style={{ fontSize: 40 }} />
                  </ListItem> : <ListItem itemDivider />}
                </View>
              )
            })}
          </List>
        </Content>
      </Container>
    )
  }
}

function mapStateToProps() {
  return {
    data: store.getMyRequestById()
  }
}

export default connect(mapStateToProps)(MyRequestDetail)
