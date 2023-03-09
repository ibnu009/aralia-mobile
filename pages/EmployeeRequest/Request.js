import React, {Component} from 'react';
import HeaderLayout from '../HeaderLayout';
import style from '../../styles';
import * as action from '../../remx/Service/actions';
import {store} from '../../remx/Service/store';
import {connect} from 'remx';
import {store as UserStore} from '../../remx/User/store';
import {DocumentPicker, DocumentPickerUtil} from 'react-native-document-picker';
import {REST_URL, HEADERS_CONFIG} from '../../AppConfig';
import {Alert, ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import {
  Container,
  Content,
  Form,
  Item,
  Label,
  Picker,
  Input,
  DatePicker,
  Textarea,
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
} from 'native-base';

class EmployeeRequest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nip: '',
      tujuan_permintaan: 1,
      jumlah: '',
      tanggal_dibutuhkan: '',
      alasan_permintaan: '',
      file: null,
      fileUri: '',
      fileType: '',
      fileName: 'File',
      fileSize: 0,
      showLoading: false,
      loginButtonVisible: 'flex',
    };
  }

  componentDidMount() {
    AsyncStorage.getItem('nip').then((result) => {
      this.setState({nip: result});
    });
  }

  componentWillUnmount() {
    store.setSelectedPosisi({});
  }

  setDate = (value) => {
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
    this.state['tanggal_dibutuhkan'] = value;
  };

  showPicker = () => {
    DocumentPicker.show(
      {
        filetype: [
          DocumentPickerUtil.allFiles(),
          // DocumentPickerUtil.images(),
          // DocumentPickerUtil.pdf(),
          // Audio DocumentPickerUtil.audio(),
          // Plain Text DocumentPickerUtil.plainText(),
        ],
      },
      (error, res) => {
        if (res !== null) {
          if (
            res.type == 'application/pdf' ||
            res.type == 'image/jpeg' ||
            res.type == 'image/jpg' ||
            res.type == 'image/png'
          ) {
            if (parseFloat(res.fileSize / 1000).toFixed(2) > 1000) {
              Alert.alert(
                'Warning',
                `Ukuran file tidak boleh lebih besar dari 1mb`,
                [{text: 'Close'}],
              );
            } else {
              this.setState({
                file: res,
                fileUri: res.uri,
                fileType: res.type,
                fileName: res.fileName,
                fileSize: parseFloat(res.fileSize / 1000).toFixed(2),
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
      },
    );
  };

  cleanDataPicker = () => {
    if (this.state.fileSize > 0) {
      this.setState({
        fileUri: '',
        fileType: '',
        fileName: 'File',
        fileSize: 0,
      });
    }
  };

  submitForm = () => {
    /* alert(this.state.tujuan_permintaan)
    return false */
    if (this.state.tanggal_dibutuhkan == '') {
      Alert.alert('Warning', `Isi Tanggal Dibutuhkan`, [{text: 'OK'}]);
    } else if (
      this.props.selectedPosisi.kd_posisi == '' ||
      typeof this.props.selectedPosisi.kd_posisi == 'undefined'
    ) {
      Alert.alert('Warning', `Isi Jabatan`, [{text: 'OK'}]);
    } else if (this.state.jumlah == '' || this.state.jumlah == '0') {
      Alert.alert('Warning', `Masukkan Jumlah`, [{text: 'OK'}]);
    } else if (this.state.fileUri == '') {
      Alert.alert('Warning', `Pilih Berkas`, [{text: 'OK'}]);
    } else {
      this.setState({
        showLoading: true,
        loginButtonVisible: 'none',
      });
      const uri = `${REST_URL}/penambahan_pegawai/insert.php`;
      // console.log(`nip=${this.props.User.nip}&rei_id=${this.props.jenisKlaim[this.state.jenis].rei_id}&tanggal_permintaan=${this.state.tgl_permintaan}&jumlah_klaim=${this.state.jml_klaim}`)

      const formData = new FormData();
      formData.append('login_nip', this.props.User.nip);
      formData.append('tanggal_dibutuhkan', this.state.tanggal_dibutuhkan);
      formData.append('kd_posisi', this.props.selectedPosisi.kd_posisi);
      formData.append('jumlah', this.state.jumlah);
      formData.append('tujuan_permintaan', this.state.tujuan_permintaan);
      formData.append('alasan_permintaan', this.state.alasan_permintaan);
      formData.append('image', {
        uri: this.state.fileUri,
        type: this.state.fileType,
        name: this.state.fileName,
      });
      formData.append('Content-Type', this.state.fileType);

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
          console.log(responseJson);
          this.setState({
            showLoading: false,
            loginButtonVisible: 'flex',
          });
          //console.log(responseJson)
          if (responseJson.error) {
            Alert.alert('Error!', `${responseJson.error_msg}`, [{text: 'OK'}]);
          } else if (responseJson.success) {
            if (
              responseJson.success_msg == null ||
              responseJson.success_msg == ''
            ) {
              //AsyncStorage.setItem('nip', responseJson.user.nip);
              this.props.navigation.navigate('Home');
            } else {
              Alert.alert('Info', `${responseJson.success_msg}`, [
                {
                  text: 'OK',
                  onPress: () => this.props.navigation.navigate('Home'),
                },
              ]);
            }
          }
          action.getMyRequest(this.state.nip);
        });
    }
  };

  render() {
    const {navigate} = this.props.navigation;
    let list_jns_tk = [
      {
        id: '1',
        value: 'Penambahan',
      },
      {
        id: '2',
        value: 'Pengganti Sementara',
      },
    ];
    const {selectedPosisi} = this.props;

    console.log(this.state.tanggal_dibutuhkan);
    console.log(this.state.tujuan_permintaan);
    console.log(selectedPosisi);
    console.log(this.props.selectedPosisi.kd_posisi);
    console.log(this.state.jumlah);
    console.log(this.state.alasan_permintaan);
    console.log(this.state.fileName);
    console.log(this.state.fileUri);
    return (
      <Container>
        <HeaderLayout
          title="Pengajuan FPPK"
          navigation={this.props.navigation}
        />
        <Content>
          <Form>
            <Item>
              <Label style={style.textInputLabel}>Tanggal Dibutuhkan</Label>
              <DatePicker
                locale={'en'}
                timeZoneOffsetInMinutes={undefined}
                modalTransparent={false}
                animationType={'fade'}
                androidMode={'default'}
                placeHolderText="Tanggal Dibutuhkan"
                placeHolderTextStyle={{color: '#ccc'}}
                onDateChange={(val) => this.setDate(val)}
                disabled={false}
              />
            </Item>
            <Item>
              <Label style={style.textInputLabel}>Tipe</Label>
              <Picker
                note
                mode="dropdown"
                selectedValue={this.state.tujuan_permintaan}
                onValueChange={(val) => this.setState({tujuan_permintaan: val})}
                style={{width: 120}}>
                {list_jns_tk.map((label, i) => (
                  <Picker.Item label={label.value} value={i} key={i} />
                ))}
              </Picker>
            </Item>
            <Item>
              <Label style={style.textInputLabel}>Jabatan</Label>
              <Label
                style={{
                  height: 50,
                  textAlignVertical: 'center',
                  width: 100,
                  paddingBottom: 2,
                  paddingTop: 2,
                  fontSize: 16,
                }}>
                {selectedPosisi.posisi}
              </Label>
              <Right style={{marginLeft: -100}}>
                <Icon
                  name="search"
                  onPress={() =>
                    navigate('SearchPosisi', {
                      select: true,
                      nip: this.props.User.nip,
                    })
                  }
                  style={{marginRight: 5}}
                />
              </Right>
            </Item>
            <Item>
              <Label style={{width: '50%'}}>Jumlah</Label>
              <Input
                keyboardType="number-pad"
                placeholder=""
                value={this.state.jumlah}
                style={{
                  borderWidth: 1,
                  borderColor: '#ccc',
                  marginTop: 10,
                  marginBottom: 10,
                  marginRight: 2,
                  height: 40,
                }}
                onChangeText={(val) => this.setState({jumlah: val})}
              />
            </Item>
            <ListItem itemDivider />
            <Item
              style={{
                flexDirection: 'column',
                paddingTop: 10,
                paddingBottom: 10,
              }}>
              <Label style={[style.textInputLabel, {width: '100%'}]}>
                Catatan
              </Label>
              <Textarea
                onChangeText={(val) => this.setState({alasan_permintaan: val})}
                style={{width: '98%'}}
                rowSpan={5}
                bordered
                placeholder="Ketik disini..."
              />
            </Item>
            <ListItem itemDivider />
            <Item last style={{paddingTop: 10, paddingBottom: 10}}>
              <Label>Unggah Berkas</Label>
            </Item>
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
              <Button
                full
                success
                iconLeft
                onPress={this.showPicker.bind(this)}>
                <Icon name="attach" />
                <Text>Pilih berkas</Text>
              </Button>
            </List>
          </Form>
        </Content>
        {this.state.showLoading && (
          <ActivityIndicator size="large" color="#f0d8a43ff" />
        )}
        <Footer style={{display: this.state.loginButtonVisible}}>
          <FooterTab>
            <Button
              full
              style={style.buttonPrimay}
              onPress={this.submitForm.bind(this)}>
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

function mapStateToProps(ownProps) {
  return {
    User: UserStore.getUserData(),
    selectedPosisi: store.getSelectedPosisi(),
  };
}

export default connect(mapStateToProps)(EmployeeRequest);
