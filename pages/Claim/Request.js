import React, {Component} from 'react';
import HeaderLayout from '../HeaderLayout';
import style from '../../styles';
import * as action from '../../remx/Service/actions';
import {store} from '../../remx/Service/store';
import {connect} from 'remx';
import {store as UserStore} from '../../remx/User/store';
import DocumentPicker from 'react-native-document-picker';
import Spinner from 'react-native-loading-spinner-overlay';
import ImageResizer from 'react-native-image-resizer';
import DatePicker from 'react-native-datepicker';
import {encode} from 'base-64';
import {REST_URL, HEADERS_CONFIG} from '../../AppConfig';
import {Alert, Image, Dimensions} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import {
  Container,
  Content,
  Form,
  Item,
  Label,
  Picker,
  Input,
  ListItem,
  List,
  Text,
  Left,
  Body,
  Right,
  Thumbnail,
  Button,
  Icon,
  Footer,
  FooterTab,
  Toast,
} from 'native-base';
import SimpleToast from 'react-native-simple-toast';

class ClaimRequest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arrBerkas: [],
      berkas: '',
      showLoading: false,
      nip: '',
      selectedKeluarga: 0,
      jenis: 0,
      jml_klaim: '0',
      tgl_permintaan: new Date(),
      tgl_berkas: '',
      file: null,
      fileUri: '',
      fileType: '',
      fileName: null,
      fileSize: 0,
    };
  }

  componentDidMount() {
    AsyncStorage.getItem('nip').then((result) => {
      this.setState({nip: result});
    });
    if (store.getJenisKlaim().toString() == '') {
      action.getJenisKlaim(this.props.User.nip);
    }

    fetch(`${REST_URL}/reimbursement/berkas.php`, HEADERS_CONFIG)
      .then((response) => response.json())
      .then((res) => {
        this.setState({arrBerkas: res.data});
      });
  }

  componentWillUnmount = () => {
    store.setJenisKlaim([]);
  };

  setDate = (value, target) => {
    if (
      new Date(value).getTime() < new Date().setDate(new Date().getDate() - 60)
    ) {
      Alert.alert(
        'Warning',
        'Tanggal berkas tidak boleh lebih 2 bulan dari tanggal sekarang!',
      );
      return false;
    }
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
  };

  showPicker = () => {
    DocumentPicker.pick({
      type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
    })
      .then((res) => {
        if (res !== null) {
          if (new RegExp('/.jpg|.jpeg|.pdf|.png/').exec(res.type)) {
            if (parseFloat(res.size / 1000).toFixed(2) > 1000) {
              Alert.alert(
                'Warning',
                `Ukuran file tidak boleh lebih besar dari 1MB`,
                [
                  {text: 'Close'},
                  new RegExp('/.jpg|.jpeg|.png/').exec(res.type)
                    ? {text: 'Resize', onPress: () => this.resize(res)}
                    : null,
                ],
              );
            } else {
              this.setState({
                file: res,
                fileUri: res.uri,
                fileType: res.type,
                fileName: res.name,
                fileSize: parseFloat(res.size / 1000).toFixed(2),
              });
            }
          } else {
            Alert.alert(
              'Warning',
              `Format file yang diperbolehkan hanya pdf,png,jpeg,jpg`,
              [{text: 'Close'}],
            );
          }
        }
      })
      .catch((err) => {
        if (DocumentPicker.isCancel(err)) {
        } else {
          SimpleToast.show(`Error: ${err}`);
        }
      });
  };

  resize = (data) => {
    console.log(data.type);
    const fType =
      String(data.type).split('/')[1].toLowerCase() == 'jpg'
        ? 'JPEG'
        : String(data.type).split('/')[1].toUpperCase();
    const fRotate = 0;

    Image.getSize(data.uri, (width, height) => {
      ImageResizer.createResizedImage(
        data.uri,
        width * 0.5,
        height * 0.5,
        fType,
        80,
        fRotate,
      ).then((result) => {
        if (parseFloat(result.size / 1000).toFixed(2) > 1000) {
          data.fileName = result.name;
          data.fileSize = result.size;
          data.uri = result.uri;
          this.resize(data);
        } else {
          this.setState({
            file: result,
            fileUri: result.uri,
            fileType: data.type,
            fileName: result.name,
            fileSize: parseFloat(result.size / 1000).toFixed(2),
          });
        }
      });
    });
  };

  cleanDataPicker = () => {
    if (this.state.fileSize > 0) {
      this.setState({
        fileUri: null,
        fileType: null,
        fileName: null,
        fileSize: 0,
      });
    }
  };

  submitForm = () => {
    this.setState({showLoading: true});
    const uri = `${REST_URL}/reimbursement/insert.php`;
    // console.log(`nip=${this.props.User.nip}&rei_id=${this.props.jenisKlaim[this.state.jenis].rei_id}&tanggal_permintaan=${this.state.tgl_permintaan}&jumlah_klaim=${this.state.jml_klaim}`)
    const day =
      this.state.tgl_permintaan.getDate() < 10
        ? '0' + this.state.tgl_permintaan.getDate()
        : this.state.tgl_permintaan.getDate();
    const month =
      this.state.tgl_permintaan.getMonth() + 1 < 10
        ? '0' + (this.state.tgl_permintaan.getMonth() + 1)
        : this.state.tgl_permintaan.getMonth() + 1;
    const year =
      this.state.tgl_permintaan.getFullYear() < 10
        ? '0' + this.state.tgl_permintaan.getFullYear()
        : this.state.tgl_permintaan.getFullYear();
    const val_pengajuan = year + '-' + month + '-' + day;

    const formData = new FormData();
    formData.append('nip', this.props.User.nip);
    formData.append('rei_id', this.props.jenisKlaim[this.state.jenis].rei_id);
    if (this.props.jenisKlaim[this.state.jenis].rei_id == 'REI-000005') {
      formData.append(
        'kd_anggota_keluarga',
        this.props.jenisKlaim[this.state.jenis].keluarga[
          this.state.selectedKeluarga
        ].kode,
      );
    } else {
      formData.append('kd_anggota_keluarga', '0|0');
    }
    formData.append('tanggal_permintaan', val_pengajuan);
    formData.append('tanggal_berkas', this.state.tgl_berkas);
    formData.append('jumlah_klaim', this.state.jml_klaim);
    formData.append('berkas', this.state.berkas);
    formData.append(
      'batas_klaim',
      this.props.jenisKlaim[this.state.jenis].batas_penggantian,
    );
    if (this.state.fileUri != '') {
      formData.append('image', {
        uri: this.state.fileUri,
        type: this.state.fileType,
        name: this.state.fileName,
      });
      // formData.append('Content-Type', this.state.fileType)
    }

    fetch(uri, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        ...HEADERS_CONFIG.headers,
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((responseJson) => {
        // console.log(responseJson)
        this.setState({showLoading: false});
        Alert.alert('Info', responseJson.message, [{text: 'OK'}]);
        this.props.navigation.goBack();
        action.getMyRequest(this.state.nip);
      })
      .catch((err) => {
        this.setState({showLoading: false});
        Toast.show({
          text: `Error: ${err}`,
          type: 'danger',
        });
      });
  };

  validasi = () => {
    if (this.state.tgl_permintaan == '') {
      Alert.alert('Warning', `Pilih Tanggal Pengajuan`, [{text: 'OK'}]);
    } /* else if ((new Date(this.state.tgl_berkas)) < (new Date(new Date().setDate(new Date().getDate()-60)))) {
      Alert.alert(
        'Warning',
        `Tanggal Pengajuan Maksimal 2 Bulan Yang Lalu`,
        [
          { text: 'OK' }
        ],
      )
    } */ else if (this.state.jml_klaim == '' || this.state.jml_klaim == '0') {
      Alert.alert('Warning', `Masukkan Jumlah Klaim`, [{text: 'OK'}]);
    } else if (this.state.tgl_berkas == '') {
      Alert.alert('Warning', `Pilih Tanggal Berkas`, [{text: 'OK'}]);
    } else if (this.state.file == null) {
      Alert.alert('Warning', `Pilih Lampiran Berkas`, [{text: 'OK'}]);
    } else {
      Alert.alert(
        `Konfirmasi`,
        `Apakah jumlah klaim yang di ajukan sudah benar?`,
        [{text: 'Tidak'}, {text: 'Ya', onPress: () => this.submitForm()}],
      );
    }
  };

  render() {
    const {jenisKlaim} = this.props;
    const me = this;
    let batasKlaim = '';
    if (typeof jenisKlaim[this.state.jenis] !== 'undefined') {
      batasKlaim = jenisKlaim[this.state.jenis].ket_batas_klaim;
    }
    const tgl_pengajuan =
      this.state.tgl_permintaan.getDate() +
      '/' +
      (this.state.tgl_permintaan.getMonth() + 1) +
      '/' +
      this.state.tgl_permintaan.getFullYear();

    const minDate = new Date(new Date().setMonth(new Date().getMonth() - 3));

    function fieldKeluarga() {
      if (typeof jenisKlaim[me.state.jenis] !== 'undefined') {
        const selectedJns = jenisKlaim[me.state.jenis].rei_id;
        if (selectedJns == 'REI-000005') {
          return (
            <Item>
              <Label style={style.textInputLabel}>Anggota Keluarga</Label>
              <Picker
                note
                mode="dropdown"
                selectedValue={me.state.selectedKeluarga}
                onValueChange={(val) => me.setState({selectedKeluarga: val})}
                style={{width: 120}}>
                {jenisKlaim[me.state.jenis].keluarga.map((label, i) => (
                  <Picker.Item label={label.nama} value={i} key={i} />
                ))}
              </Picker>
            </Item>
          );
        }
      }
    }

    return (
      <Container>
        <HeaderLayout
          title="Permohonan Klaim"
          navigation={this.props.navigation}
        />
        <Content>
          <Spinner
            visible={this.state.showLoading}
            color={style.statusbarAccent.backgroundColor}
            size="large"
          />
          <Form>
            <Item>
              <Label style={style.textInputLabel}>Jenis Klaim</Label>
              <Picker
                note
                mode="dropdown"
                selectedValue={this.state.jenis}
                onValueChange={(val) => this.setState({jenis: val})}
                style={{width: Dimensions.get('screen').width * 0.5}}>
                {jenisKlaim.map((label, i) => (
                  <Picker.Item label={label.reimbursement} value={i} key={i} />
                ))}
              </Picker>
            </Item>
            {fieldKeluarga()}
            <Item>
              <Label style={style.textInputLabel}>Tanggal Pengajuan</Label>
              <Text style={{marginTop: 10, marginBottom: 10}}>
                {tgl_pengajuan}
              </Text>
            </Item>
            <Item>
              <Label style={{width: '50%'}}>Batas Klaim</Label>
              <Text style={{marginTop: 10, marginBottom: 10}}>
                {batasKlaim}
              </Text>
            </Item>
            <Item>
              <Label style={{width: '50%'}}>Total Klaim</Label>
              <Input
                keyboardType="number-pad"
                placeholder="Rp."
                value={this.state.jml_klaim}
                style={{
                  borderWidth: 1,
                  borderColor: '#ccc',
                  marginTop: 10,
                  marginBottom: 10,
                  marginRight: 2,
                  height: 40,
                }}
                onChangeText={(val) => this.setState({jml_klaim: val})}
                onBlur={() => {
                  let bts =
                    this.props.jenisKlaim[this.state.jenis].ket_batas_klaim;
                  bts = bts.replace('Rp', '').trim();
                  bts = bts.replace(/\./g, '');

                  if (!isNaN(parseInt(bts))) {
                    if (parseInt(this.state.jml_klaim) > parseInt(bts)) {
                      Alert.alert(
                        'Info',
                        `Pengajuan klaim Anda melebihi batas klaim`,
                        [
                          {text: 'OK'}, // onPress: () => this.setState({jml_klaim: bts})
                        ],
                      );
                    }
                  }
                }}
              />
            </Item>
            <Item>
              <Label style={style.textInputLabel}>Jenis Berkas</Label>
              <Picker
                note
                mode="dropdown"
                selectedValue={this.state.berkas}
                onValueChange={(val) => this.setState({berkas: val})}
                style={{width: 120}}>
                {this.state.arrBerkas.map((label, i) => (
                  <Picker.Item label={label.berkas} value={label.id} key={i} />
                ))}
              </Picker>
            </Item>
            <Item style={{height: 60}}>
              <Label style={style.textInputLabel}>Tanggal Berkas</Label>
              <DatePicker
                style={{width: Dimensions.get('screen').width * 0.48}}
                date={this.state.tgl_berkas}
                mode="date"
                placeholder="DD/MM/YYYY"
                format="DD/MM/YYYY"
                minDate={
                  minDate.getDate() +
                  '/' +
                  (minDate.getMonth() + 1) +
                  '/' +
                  minDate.getFullYear()
                }
                maxDate={
                  new Date().getDate() +
                  '/' +
                  (new Date().getMonth() + 1) +
                  '/' +
                  new Date().getFullYear()
                }
                confirmBtnText="Ok"
                cancelBtnText="Batal"
                customStyles={{datePicker: {backgroundColor: '#000'}}}
                onDateChange={(val) => this.setState({tgl_berkas: val})}
              />
            </Item>
            {/* <Item last style={{flexDirection:'column', paddingTop: 10, paddingBottom: 10}}>
              <Label style={{width:'100%'}}>Deskripsi</Label>
              <Textarea rowSpan={5} bordered placeholder="Write..." style={{width:'99%'}} />
            </Item> */}
            <ListItem itemDivider />
            <Item last style={{paddingTop: 10, paddingBottom: 10}}>
              <Left>
                <Label>Unggah Berkas</Label>
              </Left>
              <Right>
                <Button
                  small
                  iconLeft
                  onPress={this.showPicker.bind(this)}
                  style={style.buttonPrimay}>
                  <Icon name="attach" />
                  <Text>Pilih berkas</Text>
                </Button>
              </Right>
            </Item>

            {this.state.fileName && (
              <List>
                <ListItem noBorder thumbnail>
                  <Left>
                    <Thumbnail
                      square
                      source={
                        this.state.fileType == 'application/pdf'
                          ? require('assets/file.png')
                          : this.state.fileUri == ''
                          ? require('assets/file.png')
                          : {uri: this.state.fileUri}
                      }
                    />
                  </Left>
                  <Body>
                    <Text>{this.state.fileName}</Text>
                  </Body>
                  <Right>
                    <Button
                      danger
                      rounded
                      iconLeft
                      onPress={this.cleanDataPicker.bind(this)}>
                      <Icon name="ios-close-circle-outline" />
                      <Text>Delete</Text>
                    </Button>
                  </Right>
                </ListItem>
                <ListItem itemDivider />
              </List>
            )}
          </Form>
        </Content>
        <Footer style={{display: this.state.loginButtonVisible}}>
          <FooterTab>
            <Button
              full
              style={style.buttonPrimay}
              onPress={() => this.validasi()}>
              <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 15}}>
                Submit
              </Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}

function mapStateToProps() {
  return {
    jenisKlaim: store.getJenisKlaim(),
    User: UserStore.getUserData(),
  };
}

export default connect(mapStateToProps)(ClaimRequest);
