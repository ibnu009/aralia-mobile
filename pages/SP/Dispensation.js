import React, { Component } from 'react';
import { connect } from 'remx';
import { store as UserStore } from '../../remx/User/store';
import AsyncStorage from '@react-native-community/async-storage';
import { Image } from 'react-native';

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

class DispensationWorklistDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nip: '',
      alasan_persetujuan: '',
      data: {},
    };
  }

  componentDidMount() {
  }

  render() {
    const { data } = this.props.route.params;

    return (
      <List>
        <ListItem avatar>
          <Left>
            <Thumbnail
              source={
                data.picture
                  ? { uri: data.picture }
                  : require('assets/default.png')
              }
            />
          </Left>
          <Body>
            <Text>{data.nm_peg}</Text>
            <Text note>
              {data.nip} | {data.nm_kantor}
            </Text>
          </Body>
        </ListItem>
        <ListItem>
          <Left style={{ flexDirection: 'column' }}>
            <Card
              transparent
              style={{ flexDirection: 'row', marginTop: 0, marginBottom: 0 }}>
              <Image
                source={require('assets/calendar.png')}
                style={styles.imageInputLabel}
              />
              <Label style={{ top: 3 }}>Jenis Dispensasi</Label>
            </Card>
            <Text
              style={{
                width: '100%',
                left: 30,
                color: '#1274ce',
                fontStyle: 'italic',
              }}>
              {data.jns_dispensasi}
            </Text>
          </Left>
          <Right>
            {/* <Text>{`${data.tgl.getDate()}/${data.tgl.getMonth()+1}/${data.tgl.getFullYear()}`}</Text> */}
          </Right>
        </ListItem>
        <ListItem>
          <Left style={{ flexDirection: 'column' }}>
            <Card
              transparent
              style={{ flexDirection: 'row', marginTop: 0, marginBottom: 0 }}>
              <Image
                source={require('assets/calendar.png')}
                style={styles.imageInputLabel}
              />
              <Label style={{ top: 3 }}>Tanggal</Label>
            </Card>
            <Text
              style={{
                width: '100%',
                left: 30,
                color: '#1274ce',
                fontStyle: 'italic',
              }}>
              {data.tgl_dispen}
            </Text>
          </Left>
          <Right>
            {/*  <Text>{`${data.tgl.getDate()}/${data.tgl.getMonth()+1}/${data.tgl.getFullYear()}`}</Text> */}
          </Right>
        </ListItem>
        <ListItem>
          <Left style={{ flexDirection: 'column' }}>
            <Card
              transparent
              style={{ flexDirection: 'row', marginTop: 0, marginBottom: 0 }}>
              <Image
                source={require('assets/calendar.png')}
                style={styles.imageInputLabel}
              />
              <Label style={{ top: 3 }}>Jam Masuk</Label>
            </Card>
            <Text
              style={{
                width: '100%',
                left: 30,
                color: '#1274ce',
                fontStyle: 'italic',
              }}>
              {data.masuk.length > 0 ? data.masuk : '-'}
            </Text>
          </Left>
          <Right>
            {/* <Text>{`${data.tgl.getDate()}/${data.tgl.getMonth()+1}/${data.tgl.getFullYear()}`}</Text> */}
          </Right>
        </ListItem>
        <ListItem>
          <Left style={{ flexDirection: 'column' }}>
            <Card
              transparent
              style={{ flexDirection: 'row', marginTop: 0, marginBottom: 0 }}>
              <Image
                source={require('assets/calendar.png')}
                style={styles.imageInputLabel}
              />
              <Label style={{ top: 3 }}>Jam Keluar</Label>
            </Card>
            <Text
              style={{
                width: '100%',
                left: 30,
                color: '#1274ce',
                fontStyle: 'italic',
              }}>
              {data.keluar.length > 0 ? data.keluar : '-'}
            </Text>
          </Left>
          <Right>
            {/* <Text>{`${data.tgl.getDate()}/${data.tgl.getMonth()+1}/${data.tgl.getFullYear()}`}</Text> */}
          </Right>
        </ListItem>
        <ListItem>
          <Left style={{ flex: 0.5, flexDirection: 'column' }}>
            <Label style={{ top: 3 }}>Lampiran</Label>
          </Left>
          <Right style={{ flex: 0.5 }}>
            {data.path.length > 1 ? (
              <Text
                style={{ color: '#1565c0' }}
                onPress={() =>
                  this.props.navigation.push('PreviewAttachment', {
                    url: data.path,
                  })
                }>
                Lihat berkas
              </Text>
            ) : (
                <Text>Tidak ada lampiran</Text>
              )}
          </Right>
        </ListItem>
        <ListItem>
          <Left style={{ flexDirection: 'column' }}>
            <Card
              transparent
              style={{ flexDirection: 'row', marginTop: 0, marginBottom: 0 }}>
              <Image
                source={require('assets/calendar.png')}
                style={styles.imageInputLabel}
              />
              <Label style={{ top: 5, left: 5 }}>Keterangan</Label>
            </Card>
            <Text
              style={{
                width: '100%',
                left: 30,
                color: '#1274ce',
                fontStyle: 'italic',
              }}>
              {data.keterangan}
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

export default connect(mapStateToProps)(DispensationWorklistDetail);
