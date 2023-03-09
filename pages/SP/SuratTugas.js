import React, {Component} from 'react';
import {connect} from 'remx';
import HeaderLayout from '../HeaderLayout';
import {store as UserStore} from '../../remx/User/store';

import {AsyncStorage, Image, Alert} from 'react-native';

import {
  Container,
  Content,
  Card,
  List,
  ListItem,
  Left,
  Thumbnail,
  Body,
  Text,
  Label,
  Right,
  Button,
  Footer,
  FooterTab,
  Item,
  Textarea,
  View,
} from 'native-base';
import styles from '../../styles';

class SuratTugasWorklistDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nip: '',
      alasan_persetujuan: '',
      data: {},
      jnsTugas: [
        'Perjalanan Dinas Dalam Negeri - Insidentil',
        'Perjalanan Dinas Dalam Negeri - Rutin',
        'Perjalanan Dinas Luar Negeri',
        'Perjalanan Dinas Pindah',
        'Perjalanan Menggunakan Mobil Dinas',
      ],
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
          <View>
            <Thumbnail
              source={
                this.state.data.picture
                  ? {uri: this.state.data.picture}
                  : require('assets/default.png')
              }
            />
          </View>
          <Body>
            <Text>{this.state.data.nm_peg}</Text>
            <Text note>
              {this.state.data.nip} | {this.state.data.nm_kantor}
            </Text>
          </Body>
        </ListItem>
        <ListItem>
          <View style={{width: '40%'}}>
            <Label>Jenis Tugas</Label>
          </View>
          <Text style={{color: '#1274ce', fontStyle: 'italic'}}>
            {this.state.jnsTugas[this.state.data.type.toString() - 1]}
          </Text>
        </ListItem>
        <ListItem>
          <View style={{width: '40%'}}>
            <Label>Nomor Surat</Label>
          </View>
          <Text style={{color: '#1274ce', fontStyle: 'italic'}}>
            {this.state.data.no_surat}
          </Text>
          <Right>
            {/*  <Text>{`${this.state.data.tgl.getDate()}/${this.state.data.tgl.getMonth()+1}/${this.state.data.tgl.getFullYear()}`}</Text> */}
          </Right>
        </ListItem>
        <ListItem>
          <View style={{width: '40%'}}>
            <Label>Tanggal Surat</Label>
          </View>
          <Text style={{color: '#1274ce', fontStyle: 'italic'}}>
            {this.state.data.tgl_surat.length > 0
              ? this.state.data.tgl_surat
              : '-'}
          </Text>
          <Right>
            {/*  <Text>{`${this.state.data.tgl.getDate()}/${this.state.data.tgl.getMonth()+1}/${this.state.data.tgl.getFullYear()}`}</Text> */}
          </Right>
        </ListItem>
        <ListItem>
          <View style={{width: '40%'}}>
            <Label>Tanggal Dinas</Label>
          </View>
          <Text style={{color: '#1274ce', fontStyle: 'italic'}}>
            {this.state.data.tgl_dinas}
          </Text>
          <Right>
            {/* <Text>{`${this.state.data.tgl.getDate()}/${this.state.data.tgl.getMonth()+1}/${this.state.data.tgl.getFullYear()}`}</Text> */}
          </Right>
        </ListItem>
        <ListItem>
          <View style={{width: '40%'}}>
            <Label>Asal</Label>
          </View>
          <Text style={{color: '#1274ce', fontStyle: 'italic'}}>
            {this.state.data.asal}
          </Text>
          <Right>
            {/* <Text>{`${this.state.data.tgl.getDate()}/${this.state.data.tgl.getMonth()+1}/${this.state.data.tgl.getFullYear()}`}</Text> */}
          </Right>
        </ListItem>
        <ListItem>
          <View style={{width: '40%'}}>
            <Label>Tujuan</Label>
          </View>
          <Text style={{color: '#1274ce', fontStyle: 'italic'}}>
            {this.state.data.tujuan}
          </Text>
          <Right>
            {/* <Text>{`${this.state.data.tgl.getDate()}/${this.state.data.tgl.getMonth()+1}/${this.state.data.tgl.getFullYear()}`}</Text> */}
          </Right>
        </ListItem>
        <ListItem>
          <View style={{width: '40%'}}>
            <Label>Penandatangan</Label>
          </View>
          <Text style={{color: '#1274ce', fontStyle: 'italic'}}>
            {this.state.data.nm_ttd}
          </Text>
          <Right>
            {/* <Text>{`${this.state.data.tgl.getDate()}/${this.state.data.tgl.getMonth()+1}/${this.state.data.tgl.getFullYear()}`}</Text> */}
          </Right>
        </ListItem>
        <ListItem>
          <Left style={{flexDirection: 'column'}}>
            <Card
              transparent
              style={{flexDirection: 'row', marginTop: 0, marginBottom: 0}}>
              <Label>Keterangan</Label>
            </Card>
            <Text
              style={{
                width: '100%',
                left: 30,
                color: '#1274ce',
                fontStyle: 'italic',
              }}>
              {this.state.data.keterangan}
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

export default connect(mapStateToProps)(SuratTugasWorklistDetail);
