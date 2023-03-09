import React from 'react';
import { connect } from 'remx'
import HeaderLayout from '../HeaderLayout'
import styles from '../../styles'
import { store as UserStore } from '../../remx/User/store'
import {
  Image,
  TouchableOpacity,
  StyleSheet,
  View,
  ActivityIndicator,
} from 'react-native'

import {
  Container,
  Content,
  List,
  ListItem,
  Left,
  Right,
  Button,
  Icon,
  Text
} from 'native-base'

class SuratTugasWorklist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      // data: this.props.data
    }
  }

  componentDidUpdate(prevProps) {
    const data = this.props.data
    if (prevProps.data != data) {
      this.setState({ isLoading: false, data: data })
    }
  }

  render() {
    const { title } = this.props.route.params
    const { navigate } = this.props.navigation
    // console.log(JSON.stringify(this.props.data))

    return (
      <Container>
        <HeaderLayout title={title} navigation={this.props.navigation} />
        <Content>
          {this.state.isLoading && <ActivityIndicator size="large" style={styles.loading} color={styles.loading.color} />}

          {this.props.data.map((e, i) => {
            return (
              <TouchableOpacity key={i}>
                <List>
                  <ListItem>
                    <Text style={{ width: '50%' }}>Nama Aktifitas</Text>
                    <Text style={{ width: '50%' }}>{e.nama_aktifitas}</Text>
                  </ListItem>
                  <ListItem>
                    <Text style={{ width: '50%' }}>Nama Pegawai</Text>
                    <Text style={{ width: '50%' }}>{e.nm_peg}</Text>
                  </ListItem>
                  <ListItem style={{ paddingBottom: 20 }}>
                    <Left style={{ flexDirection: 'column' }}>
                      <View style={[style.leftSide, { width: '100%' }]}>
                        <Image source={require('assets/calendar.png')} style={styles.imageInputLabel} />
                        <Text>Tanggal Pengajuan</Text>
                      </View>
                      <Text style={{ width: '100%', top: 10, color: '#1565c0', left: 25 }}>{e.tgl_pengajuan}</Text>
                    </Left>
                    <Right>
                      <Button
                        success iconRight small
                        style={{ borderRadius: 5, width: 100 }}
                        onPress={() => navigate('WorklistDetail', { title: title, data: e })}>

                        <Text>Detail</Text>
                        <Icon name='ios-arrow-forward' />
                      </Button>
                    </Right>
                  </ListItem>
                </List>
                <ListItem itemDivider />
              </TouchableOpacity>
            )
          })}
        </Content>
      </Container>
    );
  }
}

const style = StyleSheet.create({
  leftSide: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  }
})

function mapStateToProps() {
  return {
    user: UserStore.getUserData(),
    // data: store.getMyRequestListData()
  }
}

export default connect(mapStateToProps)(SuratTugasWorklist)
