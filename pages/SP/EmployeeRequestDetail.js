import React, {Component} from 'react';
import {connect} from 'remx';
import {store as UserStore} from '../../remx/User/store';
import styles from '../../styles';

import AsyncStorage from '@react-native-community/async-storage';

import {Image} from 'react-native';

import {
  Card,
  List,
  ListItem,
  Left,
  Thumbnail,
  Body,
  Text,
  Label,
  Right,
} from 'native-base';

class WorklistDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nip: '',
      alasan_persetujuan: '',
      data: {},
    };
  }

  componentDidMount() {
    AsyncStorage.getItem('nip').then(result => {
      this.setState({nip: result});
    });

    const {data} = this.props.route.params;
    this.setState({data: data});
  }

  /* follow_up(approve) {
        const uri = `${_REST_URL_}/operasional/do_follow_up.php?approve=${approve}&nip=${this.props.user.nip}&kso_kasusnomor=${this.state.data.kso_kasusnomor}&alasan_persetujuan=${this.state.alasan_persetujuan}`
        //alert(uri)
        fetch(uri)
            .then(response => response.json())
            .then(responseJson => {
                console.log(responseJson)
                this.setState({
                    showLoading: false,
                    loginButtonVisible: 'flex'
                })
                //console.log(responseJson)
                if (responseJson.error) {
                    Alert.alert(
                        'Error!',
                        `${responseJson.error_msg}`,
                        [
                            { text: 'OK' }
                        ],
                    )
                } else if (responseJson.success) {
                    if (responseJson.success_msg == null || responseJson.success_msg == "") {
                        //AsyncStorage.setItem('nip', responseJson.user.nip);
                        this.props.navigation.navigate('Home')
                    } else {
                        Alert.alert(
                            'Info',
                            `${responseJson.success_msg}`,
                            [
                                { text: 'OK', onPress: () => this.props.navigation.navigate('Home') }
                            ],
                        )
                    }
                }
                // this.setState({data: responseJSON.data, isLoading: false})
            })
    } */

  render() {
    const {title} = this.props.route.params;

    return (
      <List>
        <ListItem avatar>
          <Left>
            <Thumbnail
              source={
                this.state.data.img
                  ? {uri: this.state.data.img}
                  : require('assets/default.png')
              }
            />
          </Left>
          <Body>
            <Text>{this.state.data.nm_peg}</Text>
            <Text note>
              {this.state.data.nip} | {this.state.data.nm_kantor}
            </Text>
          </Body>
        </ListItem>
        <ListItem>
          <Left style={{flexDirection: 'column'}}>
            <Card
              transparent
              style={{flexDirection: 'row', marginTop: 0, marginBottom: 0}}>
              <Image
                source={require('assets/calendar.png')}
                style={styles.imageInputLabel}
              />
              <Label style={{top: 3}}>Tanggal Dibutuhkan</Label>
            </Card>
            <Text
              style={{
                width: '100%',
                left: 30,
                color: '#1274ce',
                fontStyle: 'italic',
              }}>
              {this.state.data.tanggal_dibutuhkan}
            </Text>
          </Left>
          <Right>
            {/* <Text>{`${this.state.data.tgl.getDate()}/${this.state.data.tgl.getMonth()+1}/${this.state.data.tgl.getFullYear()}`}</Text> */}
          </Right>
        </ListItem>
        <ListItem>
          <Left style={{flexDirection: 'column'}}>
            <Card
              transparent
              style={{flexDirection: 'row', marginTop: 0, marginBottom: 0}}>
              <Image
                source={require('assets/calendar.png')}
                style={styles.imageInputLabel}
              />
              <Label style={{top: 3}}>Tipe</Label>
            </Card>
            <Text
              style={{
                width: '100%',
                left: 30,
                color: '#1274ce',
                fontStyle: 'italic',
              }}>
              {this.state.data.tujuan_permintaan}
            </Text>
          </Left>
          <Right>
            {/*  <Text>{`${this.state.data.tgl.getDate()}/${this.state.data.tgl.getMonth()+1}/${this.state.data.tgl.getFullYear()}`}</Text> */}
          </Right>
        </ListItem>
        <ListItem>
          <Left style={{flexDirection: 'column'}}>
            <Card
              transparent
              style={{flexDirection: 'row', marginTop: 0, marginBottom: 0}}>
              <Image
                source={require('assets/calendar.png')}
                style={styles.imageInputLabel}
              />
              <Label style={{top: 3}}>Jabatan</Label>
            </Card>
            <Text
              style={{
                width: '100%',
                left: 30,
                color: '#1274ce',
                fontStyle: 'italic',
              }}>
              {this.state.data.posisi}
            </Text>
          </Left>
          <Right>
            {/* <Text>{`${this.state.data.tgl.getDate()}/${this.state.data.tgl.getMonth()+1}/${this.state.data.tgl.getFullYear()}`}</Text> */}
          </Right>
        </ListItem>
        <ListItem>
          <Left style={{flexDirection: 'column'}}>
            <Card
              transparent
              style={{flexDirection: 'row', marginTop: 0, marginBottom: 0}}>
              <Image
                source={require('assets/calendar.png')}
                style={styles.imageInputLabel}
              />
              <Label style={{top: 5, left: 5}}>Jumlah</Label>
            </Card>
            <Text
              style={{
                width: '100%',
                left: 30,
                color: '#1274ce',
                fontStyle: 'italic',
              }}>
              {this.state.data.jumlah}
            </Text>
          </Left>
        </ListItem>
        <ListItem>
          <Left style={{flexDirection: 'column'}}>
            <Card
              transparent
              style={{flexDirection: 'row', marginTop: 0, marginBottom: 0}}>
              <Image
                source={require('assets/calendar.png')}
                style={styles.imageInputLabel}
              />
              <Label style={{top: 5, left: 5}}>Catatan</Label>
            </Card>
            <Text
              style={{
                width: '100%',
                left: 30,
                color: '#1274ce',
                fontStyle: 'italic',
              }}>
              {this.state.data.alasan_permintaan}
            </Text>
          </Left>
        </ListItem>
      </List>
    );
  }
}
function mapStateToProps() {
  return {
    user: UserStore.getUserData(),
  };
}

export default connect(mapStateToProps)(WorklistDetail);
