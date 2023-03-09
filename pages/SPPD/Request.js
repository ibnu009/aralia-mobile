import React, {Component} from 'react';
import HeaderLayout from '../HeaderLayout';
import style from '../../styles';
import {store} from '../../remx/Service/store';
import * as action from '../../remx/Service/actions';
import {connect} from 'remx';
import {store as UserStore} from '../../remx/User/store';
import {REST_URL, HEADERS_CONFIG} from '../../AppConfig';

import {Alert, ActivityIndicator} from 'react-native';

import {
  Container,
  Content,
  Form,
  Picker,
  Item,
  Input,
  Label,
  ListItem,
  DatePicker,
  Textarea,
  Button,
  Text,
  Footer,
  Right,
  Icon,
  FooterTab,
  View,
} from 'native-base';

class Sppd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showLoading: false,
      loginButtonVisible: 'flex',
      arrTipeSppd: [
        {id: 1, jenis: 'Perjalanan Dinas Dalam Negeri - Insidentil'},
        {id: 2, jenis: 'Perjalanan Dinas Dalam Negeri - Rutin'},
        {id: 3, jenis: 'Perjalanan Dinas Luar Negeri'},
        {id: 4, jenis: 'Perjalanan Dinas Pindah'},
        {id: 5, jenis: 'Perjalanan Menggunakan Mobil Dinas'},
      ],
      jenis: 1,
      noSurat1: '',
      noSurat2: '',
      noSurat3: '',
      noSurat4: '',
      penandatangan: '',
      deskripsi: '',
      tgl_mulai: '',
      tgl_selesai: '',
      isLoading: false,
      asal: '',
      tujuan: '',
    };
  }

  componentDidMount() {
    if (store.getJenisTugas().toString() == '') {
      action.getJenisTugas();
    }
  }

  componentWillUnmount() {
    store.setSelectedPeg({});
    store.setSelectedCity([], true);
  }

  getCity(target) {
    if (target == 'origin') {
      if (this.props.selectedCity.length == 1) {
        return this.props.selectedCity[0][target];
      } else if (
        this.props.selectedCity.length == 2 &&
        typeof this.props.selectedCity[0][target] !== 'undefined'
      ) {
        return this.props.selectedCity[0][target];
      } else if (this.props.selectedCity.length == 2) {
        return this.props.selectedCity[1][target];
      } else {
        return '';
      }
    } else if (target == 'destination') {
      if (this.props.selectedCity.length == 1) {
        return this.props.selectedCity[0][target];
      } else if (
        this.props.selectedCity.length == 2 &&
        typeof this.props.selectedCity[0][target] !== 'undefined'
      ) {
        return this.props.selectedCity[0][target];
      } else if (this.props.selectedCity.length == 2) {
        return this.props.selectedCity[1][target];
      } else {
        return '';
      }
    }
  }

  submitForm = () => {
    const uri = `${REST_URL}/sppd/insert.php`;
    const dateAwal = new Date(this.state.tgl_mulai);
    const dateAkhir = new Date(this.state.tgl_selesai);
    if (
      this.state.noSurat1 == '' &&
      this.state.noSurat2 == '' &&
      this.state.noSurat3 == '' &&
      this.state.noSurat4 == ''
    ) {
      Alert.alert('Warning', `Isi Nomor Surat`, [{text: 'OK'}]);
    } else if (store.getSelectedPeg().nip == '') {
      Alert.alert('Warning', `Pilih Penandatangan`, [{text: 'OK'}]);
    } else if (this.state.tgl_mulai == '') {
      Alert.alert('Warning', `Pilih Tanggal Mulai Tugas`, [{text: 'OK'}]);
    } else if (this.state.tgl_selesai == '') {
      Alert.alert('Warning', `Pilih Tanggal Selesai Tugas`, [{text: 'OK'}]);
    } else if (dateAkhir < dateAwal) {
      Alert.alert(
        'Warning',
        `Tanggal Selesai Tugas Tidak Boleh Lebih Kecil Dari Tanggal Mulai Tugas`,
        [{text: 'OK'}],
      );
    } else if (this.state.jenis != 3 && this.getCity('origin') == '') {
      Alert.alert('Warning', `Pilih Kota Asal`, [{text: 'OK'}]);
    } else if (this.state.jenis != 3 && this.getCity('destination') == '') {
      Alert.alert('Warning', `Pilih Kota Tujuan`, [{text: 'OK'}]);
    } else if (this.state.jenis == 3 && this.state.asal == '') {
      Alert.alert('Warning', `Pilih Negara Asal`, [{text: 'OK'}]);
    } else if (this.state.jenis == 3 && this.state.tujuan == '') {
      Alert.alert('Warning', `Pilih Negara Tujuan`, [{text: 'OK'}]);
    } else {
      this.setState({
        showLoading: true,
        loginButtonVisible: 'none',
      });
      let formBody = '';
      if (this.state.jenis == 3) {
        formBody = `nip=${this.props.User.nip}&type=${
          this.state.jenis
        }&noSurat1=${this.state.noSurat1}&noSurat2=${
          this.state.noSurat2
        }&noSurat3=${this.state.noSurat3}&noSurat4=${
          this.state.noSurat4
        }&nip_ttd=${store.getSelectedPeg().nip}&keterangan=${
          this.state.deskripsi
        }&tgl_mulai=${this.state.tgl_mulai}&tgl_selesai=${
          this.state.tgl_selesai
        }&asal=${this.state.asal}&tujuan=${this.state.tujuan}`;
      } else {
        formBody = `nip=${this.props.User.nip}&type=${
          this.state.jenis
        }&noSurat1=${this.state.noSurat1}&noSurat2=${
          this.state.noSurat2
        }&noSurat3=${this.state.noSurat3}&noSurat4=${
          this.state.noSurat4
        }&nip_ttd=${store.getSelectedPeg().nip}&keterangan=${
          this.state.deskripsi
        }&tgl_mulai=${this.state.tgl_mulai}&tgl_selesai=${
          this.state.tgl_selesai
        }&asal=${this.getCity('origin')}&tujuan=${this.getCity('destination')}`;
      }
      fetch(uri, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          ...HEADERS_CONFIG.headers,
        },
        body: formBody,
      })
        .then((response) => response.json())
        .then((responseJSON) => {
          this.setState({
            showLoading: false,
            loginButtonVisible: 'flex',
          });
          this.setState({isLoading: false});
          let alertMsg = '';
          if (responseJSON.response_delete && responseJSON.response_insert) {
            alertMsg = responseJSON.response;
          } else {
            if (responseJSON.code == 1) {
              if (responseJSON.response_delete) {
                alertMsg = responseJSON.message_insert;
              } else if (responseJSON.response_insert) {
                alertMsg = responseJSON.message_insert;
              }
            } else {
              alertMsg = responseJSON.response;
            }
          }
          Alert.alert('Info', `${alertMsg}`, [{text: 'OK'}]);
          this.props.navigation.navigate('Home');
        });
    }
  };

  setDate(target, value) {
    var hari = '';
    var bulan = '';
    if ((value.getMonth() + 1).toString().length == 1) {
      bulan = '0' + (value.getMonth() + 1);
    } else {
      bulan = value.getMonth() + 1;
    }
    if (value.getDate().toString().length == 1) {
      hari = '0' + value.getDate();
    } else {
      hari = value.getDate();
    }
    value = value.getFullYear() + '-' + bulan + '-' + hari;
    this.state[target] = value;
  }

  render() {
    const {navigate} = this.props.navigation;
    const {selectedPeg, jenisTugas} = this.props;

    return (
      <Container>
        <HeaderLayout
          title="Pengajuan Surat Tugas"
          navigation={this.props.navigation}
        />
        <Content>
          <Form>
            <Item>
              <Label style={style.textInputLabel}>Jenis Tugas</Label>
              <Picker
                note
                mode="dropdown"
                selectedValue={this.state.jenis}
                onValueChange={(val) => this.setState({jenis: val})}
                style={{width: 120}}>
                {this.state.arrTipeSppd.map((label, i) => (
                  <Picker.Item label={label.jenis} value={label.id} key={i} />
                ))}
              </Picker>
            </Item>

            <Item>
              <Label style={{width: '50%'}}>Nomor Surat</Label>
              <View style={{flexDirection: 'column', flex: 1}}>
                <Input
                  onChangeText={(val) => this.setState({noSurat1: val})}
                  style={{
                    borderWidth: 1,
                    borderColor: '#ccc',
                    marginTop: 10,
                    marginBottom: 1,
                    marginRight: 2,
                    height: 40,
                    width: '95%',
                  }}
                />
                <Input
                  onChangeText={(val) => this.setState({noSurat2: val})}
                  style={{
                    borderWidth: 1,
                    borderColor: '#ccc',
                    marginTop: 1,
                    marginBottom: 1,
                    marginRight: 2,
                    height: 40,
                    width: '95%',
                  }}
                />
                <Input
                  onChangeText={(val) => this.setState({noSurat3: val})}
                  style={{
                    borderWidth: 1,
                    borderColor: '#ccc',
                    marginTop: 1,
                    marginBottom: 1,
                    marginRight: 2,
                    height: 40,
                    width: '95%',
                  }}
                />
                <Input
                  onChangeText={(val) => this.setState({noSurat4: val})}
                  style={{
                    borderWidth: 1,
                    borderColor: '#ccc',
                    marginTop: 1,
                    marginBottom: 10,
                    marginRight: 2,
                    height: 40,
                    width: '95%',
                  }}
                />
              </View>
            </Item>

            <Item>
              <Label style={style.textInputLabel}>Penandatangan</Label>
              <Label
                style={{
                  height: 50,
                  textAlignVertical: 'center',
                  width: 100,
                  paddingBottom: 2,
                  paddingTop: 2,
                  fontSize: 16,
                }}>
                {selectedPeg.nm_peg}
              </Label>
              <Right style={{marginLeft: -100}}>
                <Icon
                  name="search"
                  onPress={() =>
                    navigate('SearchEmployee', {
                      select: true,
                      nip: this.props.User.nip,
                    })
                  }
                  style={{marginRight: 5}}
                />
              </Right>
            </Item>

            <ListItem itemDivider />

            <Item
              style={{
                flexDirection: 'column',
                paddingTop: 10,
                paddingBottom: 10,
              }}>
              <Label style={[style.textInputLabel, {width: '100%'}]}>
                Rincian Tugas
              </Label>
              <Textarea
                onChangeText={(val) => this.setState({deskripsi: val})}
                style={{width: '98%'}}
                rowSpan={5}
                bordered
                placeholder="Ketik disini..."
              />
            </Item>

            <ListItem itemDivider />

            <Item>
              <Label style={style.textInputLabel}>Tanggal Mulai</Label>
              <DatePicker
                locale={'en'}
                timeZoneOffsetInMinutes={undefined}
                modalTransparent={false}
                animationType={'fade'}
                androidMode={'default'}
                placeHolderText="Select date"
                placeHolderTextStyle={{color: '#d3d3d3'}}
                onDateChange={(val) => this.setDate('tgl_mulai', val)}
                disabled={false}
              />
            </Item>

            <Item>
              <Label style={style.textInputLabel}>Tanggal Selesai</Label>
              <DatePicker
                locale={'en'}
                timeZoneOffsetInMinutes={undefined}
                modalTransparent={false}
                animationType={'fade'}
                androidMode={'default'}
                placeHolderText="Select date"
                placeHolderTextStyle={{color: '#d3d3d3'}}
                onDateChange={(val) => this.setDate('tgl_selesai', val)}
                disabled={false}
              />
            </Item>

            <ListItem itemDivider />

            {this.state.jenis == 3 ? (
              <View>
                <Item>
                  <Label style={style.textInputLabel}>Negara Asal</Label>
                  <Input
                    onChangeText={(val) => this.setState({asal: val})}
                    style={{
                      borderWidth: 1,
                      borderColor: '#ccc',
                      marginTop: 10,
                      marginBottom: 1,
                      marginRight: 2,
                      height: 40,
                      width: '95%',
                    }}
                  />
                </Item>
                <Item>
                  <Label style={style.textInputLabel}>Negara Tujuan</Label>
                  <Input
                    onChangeText={(val) => this.setState({tujuan: val})}
                    style={{
                      borderWidth: 1,
                      borderColor: '#ccc',
                      marginTop: 10,
                      marginBottom: 1,
                      marginRight: 2,
                      height: 40,
                      width: '95%',
                    }}
                  />
                </Item>
              </View>
            ) : (
              <View>
                <Item>
                  <Label style={style.textInputLabel}>Kota Asal</Label>
                  <Label
                    style={{
                      height: 50,
                      textAlignVertical: 'center',
                      width: 100,
                      paddingBottom: 2,
                      paddingTop: 2,
                      fontSize: 16,
                    }}>
                    {this.getCity('origin')}
                  </Label>
                  <Right style={{marginLeft: -100}}>
                    <Icon
                      name="search"
                      onPress={() => navigate('SearchCity', {target: 'origin'})}
                      style={{marginRight: 5}}
                    />
                  </Right>
                </Item>
                <Item>
                  <Label style={style.textInputLabel}>Kota Tujuan</Label>
                  <Label
                    style={{
                      height: 50,
                      textAlignVertical: 'center',
                      width: 100,
                      paddingBottom: 2,
                      paddingTop: 2,
                      fontSize: 16,
                    }}>
                    {this.getCity('destination')}
                  </Label>
                  <Right style={{marginLeft: -100}}>
                    <Icon
                      name="search"
                      onPress={() =>
                        navigate('SearchCity', {target: 'destination'})
                      }
                      style={{marginRight: 5}}
                    />
                  </Right>
                </Item>
              </View>
            )}
          </Form>
        </Content>
        {this.state.showLoading && (
          <ActivityIndicator size="large" color="#f0d8a43ff" />
        )}
        <Footer style={{display: this.state.loginButtonVisible}}>
          <FooterTab>
            <Button full style={style.buttonPrimay} onPress={this.submitForm}>
              <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 15}}>
                Submit
              </Text>
            </Button>
          </FooterTab>
        </Footer>

        {this.state.isLoading && (
          <ActivityIndicator
            size="large"
            style={styles.loading}
            color={styles.loading.color}
          />
        )}
      </Container>
    );
  }
}

function mapStateToProps(ownProps) {
  return {
    selectedPeg: store.getSelectedPeg(),
    jenisTugas: store.getJenisTugas(),
    selectedCity: store.getSelectedCity(),
    User: UserStore.getUserData(),
  };
}

export default connect(mapStateToProps)(Sppd);
