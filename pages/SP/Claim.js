import React, {Component} from 'react';
import {connect} from 'remx';
import {store as UserStore} from '../../remx/User/store';

import {Image} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

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

class ClaimWorklistDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  render() {
    const {data} = this.props.route.params;
    return (
      <List>
        <ListItem avatar>
          <Left>
            <Thumbnail
              source={
                data.picture
                  ? {uri: data.picture}
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
          <Left style={{flexDirection: 'column'}}>
            <Card
              transparent
              style={{flexDirection: 'row', marginTop: 0, marginBottom: 0}}>
              <Image
                source={require('assets/calendar.png')}
                style={styles.imageInputLabel}
              />
              <Label style={{top: 3}}>Jenis Klaim</Label>
            </Card>
            <Text
              style={{
                width: '100%',
                left: 30,
                color: '#1274ce',
                fontStyle: 'italic',
              }}>
              {data.reimbursement}
            </Text>
          </Left>
          <Right>
            {/* <Text>{`${data.tgl.getDate()}/${data.tgl.getMonth()+1}/${data.tgl.getFullYear()}`}</Text> */}
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
              <Label style={{top: 3}}>Tanggal Permintaan</Label>
            </Card>
            <Text
              style={{
                width: '100%',
                left: 30,
                color: '#1274ce',
                fontStyle: 'italic',
              }}>
              {data.tgl_pengajuan}
            </Text>
          </Left>
          <Right>
            {/*  <Text>{`${data.tgl.getDate()}/${data.tgl.getMonth()+1}/${data.tgl.getFullYear()}`}</Text> */}
          </Right>
        </ListItem>

        <ListItem itemDivider />

        <ListItem>
          <Left style={{flexDirection: 'column'}}>
            <Text>Berkas</Text>
          </Left>
        </ListItem>

        {/* <ListItem>
          <Left style={{flex: 0.5, flexDirection: 'column'}}>
            <Label style={{top: 3}}>Nama</Label>
          </Left>
          <Right style={{flex: 0.5}}>
            <Text>{data.nm_peg}</Text>
          </Right>
        </ListItem> */}
        {/* <ListItem>
          <Left style={{flex: 0.5, flexDirection: 'column'}}>
            <Label style={{top: 3}}>Lampiran</Label>
          </Left>
          <Right style={{flex: 0.5}}>
            {(data.path.length > 0)?<Thumbnail style={{marginTop: 5, marginBottom: 5, marginRight: 5}} square source={{uri: data.path}} onPress={() => {}} />:<Text>-</Text>}
          </Right>
        </ListItem> */}
        {data.peserta.map((x, i) => (
          <List key={i}>
            <ListItem>
              <Left style={{flex: 0.5, flexDirection: 'column'}}>
                <Label style={{top: 3}}>Nama</Label>
              </Left>
              <Right style={{flex: 0.5}}>
                <Text>{x.nm_peserta}</Text>
              </Right>
            </ListItem>
            <ListItem>
              <Left style={{flex: 0.5, flexDirection: 'column'}}>
                <Label style={{top: 3}}>Lampiran</Label>
              </Left>
              <Right style={{flex: 0.5}}>
                {x.path.length > 1 ? (
                  <Text
                    style={{color: '#1565c0'}}
                    onPress={() =>
                      this.props.navigation.navigate('PreviewAttachment', {
                        url: x.path,
                      })
                    }>
                    Lihat berkas
                  </Text>
                ) : (
                  <Text>Tidak ada lampiran</Text>
                )}
              </Right>
            </ListItem>
          </List>
        ))}

        <ListItem itemDivider />

        <ListItem>
          <Left style={{flexDirection: 'column'}}>
            <Card
              transparent
              style={{flexDirection: 'row', marginTop: 0, marginBottom: 0}}>
              <Image
                source={require('assets/calendar.png')}
                style={styles.imageInputLabel}
              />
              <Label style={{top: 3}}>Jumlah Klaim</Label>
            </Card>
            <Text
              style={{
                width: '100%',
                left: 30,
                color: '#1274ce',
                fontStyle: 'italic',
              }}>
              {data.jumlah_klaim
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
            </Text>
          </Left>
          <Right>
            {/*  <Text>{`${data.tgl.getDate()}/${data.tgl.getMonth()+1}/${data.tgl.getFullYear()}`}</Text> */}
          </Right>
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

export default connect(mapStateToProps)(ClaimWorklistDetail);
