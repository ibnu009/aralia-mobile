import React, {Component} from 'react';
import {connect} from 'remx';
import {store as UserStore} from '../../remx/User/store';
import AsyncStorage from '@react-native-community/async-storage';
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
    AsyncStorage.getItem('nip').then(result => {
      this.setState({nip: result});
    });

    const {data} = this.props.route.params;
    this.setState({data: data});
  }

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
              <Label style={{top: 3}}>Tanggal Lembur</Label>
            </Card>
            <Text
              style={{
                width: '100%',
                left: 30,
                color: '#1274ce',
                fontStyle: 'italic',
              }}>
              {this.state.data.tgl_lembur}
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
              <Label style={{top: 3}}>Jam Mulai</Label>
            </Card>
            <Text
              style={{
                width: '100%',
                left: 30,
                color: '#1274ce',
                fontStyle: 'italic',
              }}>
              {this.state.data.jam_mulai_lembur}
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
              <Label style={{top: 3}}>Jam Selesai</Label>
            </Card>
            <Text
              style={{
                width: '100%',
                left: 30,
                color: '#1274ce',
                fontStyle: 'italic',
              }}>
              {this.state.data.jam_selesai_lembur}
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
              <Label style={{top: 5, left: 5}}>
                Pekerjaan & Hasil Pekerjaan
              </Label>
            </Card>
            <Text
              style={{
                width: '100%',
                left: 30,
                color: '#1274ce',
                fontStyle: 'italic',
              }}>
              {this.state.data.alasan_lembur}
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
