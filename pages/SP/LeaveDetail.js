import React, {Component} from 'react';
import {connect} from 'remx';
import {store as UserStore} from '../../remx/User/store';
import AsyncStorage from '@react-native-community/async-storage';
import {REST_URL, HEADERS_CONFIG} from '../../AppConfig';
import {Image, Alert} from 'react-native';

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
import styles from '../../styles';

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
    AsyncStorage.getItem('nip').then((result) => {
      this.setState({nip: result});
    });

    const {data} = this.props.route.params;
    this.setState({data: data});
  }

  follow_up(approve) {
    const uri = `${REST_URL}/operasional/do_follow_up.php?approve=${approve}&nip=${this.props.user.nip}&kso_kasusnomor=${this.state.data.kso_kasusnomor}&alasan_persetujuan=${this.state.alasan_persetujuan}`;
    //alert(uri)
    fetch(uri, HEADERS_CONFIG)
      .then((response) => response.json())
      .then((res) => {
        this.setState({
          showLoading: false,
          loginButtonVisible: 'flex',
        });
        //console.log(responseJson)
        if (res.error) {
          Alert.alert('Error!', `${res.error_msg}`, [{text: 'OK'}]);
        } else if (res.success) {
          if (res.success_msg == null || res.success_msg == '') {
            //AsyncStorage.setItem('nip', responseJson.user.nip);
            this.props.navigation.navigate('Home');
          } else {
            Alert.alert('Info', `${res.success_msg}`, [
              {
                text: 'OK',
                onPress: () => this.props.navigation.navigate('Home'),
              },
            ]);
          }
        }
        // this.setState({data: responseJSON.data, isLoading: false})
      });
  }

  render() {
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
              <Label style={{top: 3}}>Jenis Cuti</Label>
            </Card>
            <Text
              style={{
                width: '100%',
                left: 30,
                color: '#1274ce',
                fontStyle: 'italic',
              }}>
              {this.state.data.nm_cuti}
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
              <Label style={{top: 3}}>Tanggal Mulai</Label>
            </Card>
            <Text
              style={{
                width: '100%',
                left: 30,
                color: '#1274ce',
                fontStyle: 'italic',
              }}>
              {this.state.data.tanggal_mulai}
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
              <Label style={{top: 3}}>Tanggal Selesai</Label>
            </Card>
            <Text
              style={{
                width: '100%',
                left: 30,
                color: '#1274ce',
                fontStyle: 'italic',
              }}>
              {this.state.data.tanggal_selesai}
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
              <Label style={{top: 5, left: 5}}>Alasan</Label>
            </Card>
            <Text
              style={{
                width: '100%',
                left: 30,
                color: '#1274ce',
                fontStyle: 'italic',
              }}>
              {this.state.data.alasan}
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
