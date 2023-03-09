import React, {Component} from 'react';
import {connect} from 'remx';
import {store} from '../../remx/Service/store';
import * as action from '../../remx/Service/actions';
import HeaderLayout from '../HeaderLayout';
import styles from '../../styles';
import {store as UserStore} from '../../remx/User/store';
import AsyncStorage from '@react-native-community/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';
import {REST_URL, HEADERS_CONFIG, getIndoFormatDate} from '../../AppConfig';
import {Image, TextInput, Alert, Dimensions} from 'react-native';

import {
  Container,
  Content,
  Form,
  Item,
  Label,
  Picker,
  ListItem,
  List,
  Text,
  Right,
  Left,
  Input,
  Icon,
  Textarea,
  Footer,
  FooterTab,
  Button,
  CheckBox,
  Body,
  Toast,
  // DatePicker
} from 'native-base';

import DatePicker from 'react-native-datepicker';

class LeaveRequest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nip: '',
      type: '1',
      tgl_mulai: '',
      tgl_selesai: '',
      alasan: '',
      no_telp: '',
      alamat_sementara: '',
      uang_cuti: '',
      isLoading: true,
      showLoading: false,
      loginButtonVisible: 'flex',
      FieldVisible: 'flex',
      TanggalSelesaiVisible: 'flex',
      checked: false,
      saldo: '',
      data: {
        taken: 'Loading...',
        saldo: 'Loading...',
        total: 'Loading...',
      },
    };

    this.minDate = new Date().setDate(new Date().getDate() + 1);
    this.nextDate =
      new Date(this.minDate).getDate() +
      '/' +
      (new Date(this.minDate).getMonth() + 1) +
      '/' +
      new Date(this.minDate).getFullYear();
  }

  componentDidMount() {
    AsyncStorage.getItem('nip').then((result) => {
      this.setState({nip: result});
    });
    if (
      null == store.getJenisCutiData() ||
      store.getJenisCutiData().toString() == ''
    ) {
      action.getJenisCuti(this.props.user.nip);
    }
    this.getBalanceDetail(this.state.type);
  }

  componentWillUnmount() {
    store.setSelectedPeg({});
  }

  getBalanceDetail = (jns_cuti: ?String) => {
    if (
      jns_cuti == '1' ||
      jns_cuti == '31' ||
      jns_cuti == '32' ||
      jns_cuti == '33' ||
      jns_cuti == '34'
    ) {
      FieldVisible_display = 'flex';
    } else {
      FieldVisible_display = 'none';
    }

    if (
      jns_cuti == '31' ||
      jns_cuti == '32' ||
      jns_cuti == '33' ||
      jns_cuti == '34' ||
      jns_cuti == '25' ||
      jns_cuti == '26' ||
      jns_cuti == '27' ||
      jns_cuti == '28' ||
      jns_cuti == '29'
    ) {
      TanggalSelesaiVisible_display = 'none';
    } else {
      TanggalSelesaiVisible_display = 'flex';
    }
    let nip = this.props.user.nip;
    let uri = `${REST_URL}/rest/?method=checksaldogadai&format=json&nip=${nip}&jns_cuti=${jns_cuti}`;
    fetch(uri, HEADERS_CONFIG)
      .then((response) => response.json())
      .then((res) => {
        const saldo = res.data;
        this.setState({
          isLoading: false,
          type: jns_cuti,
          FieldVisible: FieldVisible_display,
          TanggalSelesaiVisible: TanggalSelesaiVisible_display,
          saldo: saldo,
        });
      });
  };

  submitForm = () => {
    if (this.state.type == '') {
      Alert.alert('Warning', `Pilih Jenis Cuti`, [{text: 'OK'}]);
    } else if (this.state.tgl_mulai == '') {
      Alert.alert('Warning', `Isi Tanggal Mulai`, [{text: 'OK'}]);
    } else if (
      this.state.tgl_selesai == '' &&
      this.state.TanggalSelesaiVisible == 'flex'
    ) {
      Alert.alert('Warning', `Isi Tanggal Selesai`, [{text: 'OK'}]);
    } else if (this.state.saldo <= 0) {
      Alert.alert('Warning', `Maaf Anda tidak bisa mengajukan cuti saat ini!`, [
        {text: 'OK'},
      ]);
    } /*  else if (store.getSelectedPeg().nip == "" || typeof (store.getSelectedPeg().nip) == 'undefined') {
      Alert.alert(
        'Warning',
        `Isi Pejabat Pengganti`,
        [
          { text: 'OK' }
        ],
      )
    } else if (this.state.alasan == "") {
      Alert.alert(
        'Warning',
        `Isi Keperluan Cuti`,
        [
          { text: 'OK' }
        ],
      )
    } else if (this.state.no_telp == "") {
      Alert.alert(
        'Warning',
        `Isi No. Telp`,
        [
          { text: 'OK' }
        ],
      )
    } else if (this.state.alamat_sementara == "") {
      Alert.alert(
        'Warning',
        `Isi Alamat Selama Cuti`,
        [
          { text: 'OK' }
        ],
      )
    } */ else {
      // count the leave amount will taken
      const d1Arr = this.state.tgl_mulai.split('/');
      const d1 = new Date(`${d1Arr[2]}-${d1Arr[1]}-${d1Arr[0]}`);
      const d2Arr = this.state.tgl_selesai.split('/');
      const d2 = new Date(`${d2Arr[2]}-${d2Arr[1]}-${d2Arr[0]}`);
      const diffTime = Math.abs(d2 - d1);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      /* Alert.alert(
        'info',
        `${diffDays} - ${this.state.saldo.substr(0,this.state.saldo-5)} :: ${this.state.saldo.replace('hari','').trim()}`
      ) */
      if (diffDays > saldo) {
        Alert.alert(
          'Warning',
          `Maaf Pengajuan Cuti Anda melebihi Saldo cuti saat ini!`,
          [{text: 'OK'}],
        );
        return false;
      }

      this.setState({
        showLoading: true,
        loginButtonVisible: 'none',
      });

      let formData = new FormData();
      formData.append('nip', this.props.user.nip);
      formData.append('type', this.state.type);
      formData.append('nip_pjs', store.getSelectedPeg().nip);
      formData.append('alasan', this.state.alasan);
      formData.append('tgl_mulai', this.state.tgl_mulai);
      formData.append('tgl_selesai', this.state.tgl_selesai);
      formData.append('alamat_sementara', this.state.alamat_sementara);
      formData.append('no_telp', this.state.no_telp);
      formData.append('uang_cuti', this.state.checked ? 1 : 0);

      let uri = `${REST_URL}/cuti/insert_new.php`;

      fetch(uri, {
        method: 'POST',
        headers: {
          ...HEADERS_CONFIG.headers,
        },
        body: formData,
      })
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
              this.props.navigation.goBack();
            } else {
              Alert.alert('Info', `${res.success_msg}`, [
                {
                  text: 'OK',
                  onPress: () => this.props.navigation.goBack(),
                },
              ]);
            }
            action.getMyRequest(this.state.nip);
          }
          // this.setState({data: responseJSON.data, isLoading: false})
        })
        .catch((err) => {
          Toast.show({
            text: `Error: ${err}`,
            type: 'danger',
          });
        });
    }
  };

  render() {
    let {data, selectedPeg, user} = this.props;

    return (
      <Container>
        <HeaderLayout
          title="Permohonan Cuti"
          navigation={this.props.navigation}
        />
        <Content>
          <Spinner
            visible={this.state.showLoading}
            color={styles.statusbarAccent.backgroundColor}
            size="large"
          />
          <Form>
            <Item last style={{paddingTop: 10, paddingBottom: 10}}>
              <Left style={{flexDirection: 'row'}}>
                <Image
                  source={require('assets/user.png')}
                  style={{width: 25, height: 25}}
                />
                <Text style={{top: 5, left: 10}}>{user.nm_peg}</Text>
              </Left>
              <Right>
                <Text style={{right: 10}}>{user.nip}</Text>
              </Right>
            </Item>
            <List>
              <ListItem>
                <Label style={styles.textInputLabel}>Jenis Cuti</Label>
                <Picker
                  note
                  mode="dropdown"
                  style={{width: Dimensions.get('screen').width * 0.5}}
                  onValueChange={(value) => this.getBalanceDetail(value)}
                  selectedValue={this.state.type}
                  /*  onValueChange={(val) => this.setState({ type: val })} */
                >
                  {data.map((e, i) => (
                    <Picker.Item
                      label={e.nama_cuti}
                      value={e.id_cuti}
                      key={i}
                    />
                  ))}
                </Picker>
              </ListItem>
              <ListItem>
                <Left>
                  <Label style={styles.textInputLabel}>Sisa Saldo</Label>
                </Left>
                <Right>
                  <Text>{this.state.saldo}</Text>
                </Right>
              </ListItem>
            </List>
            <ListItem itemDivider />
            <List>
              <ListItem>
                <Label style={styles.textInputLabel}>Tanggal Mulai</Label>
                <DatePicker
                  style={{width: Dimensions.get('screen').width * 0.5}}
                  date={this.state.tgl_mulai}
                  mode="date"
                  placeholder="DD/MM/YYYY"
                  format="DD/MM/YYYY"
                  minDate={`${new Date().getDate()}/${
                    new Date().getMonth() + 1
                  }/${new Date().getFullYear()}`}
                  confirmBtnText="Ok"
                  cancelBtnText="Batal"
                  customStyles={{
                    datePicker: {backgroundColor: '#fff'},
                    placeholderText: {color: '#000'},
                  }}
                  onDateChange={(val) => this.setState({tgl_mulai: val})}
                />
              </ListItem>
              <ListItem style={{display: this.state.TanggalSelesaiVisible}}>
                <Label style={styles.textInputLabel}>Tanggal Selesai</Label>
                <DatePicker
                  style={{width: Dimensions.get('screen').width * 0.5}}
                  date={this.state.tgl_selesai}
                  mode="date"
                  placeholder="DD/MM/YYYY"
                  format="DD/MM/YYYY"
                  minDate={this.state.tgl_mulai ?? this.nextDate}
                  confirmBtnText="Ok"
                  cancelBtnText="Batal"
                  customStyles={{
                    datePicker: {backgroundColor: '#fff'},
                    placeholderText: {color: '#000'},
                  }}
                  onDateChange={(val) => this.setState({tgl_selesai: val})}
                />
              </ListItem>
              {/* <ListItem>
                <Left>
                  <Image source={require('assets/calendar.png')} style={styles.imageInputLabel} />
                  <Text>Sisa cuti</Text>
                </Left>
                <Right>
                  <Text>{this.state.data.saldo}</Text>
                </Right>
              </ListItem> */}
            </List>
            <List>
              <ListItem style={{display: this.state.FieldVisible}}>
                <Label style={styles.textInputLabel}>Tunjangan Cuti</Label>
                <CheckBox
                  checked={this.state.checked}
                  onPress={() => this.setState({checked: !this.state.checked})}
                />
                <Body>
                  <Text>Ya</Text>
                </Body>
              </ListItem>
              <ListItem>
                <Label style={styles.textInputLabel}>Pejabat Pengganti</Label>
                {/* <Input value={selectedPeg.nip} style={{ borderWidth: 1, borderColor: '#ccc', marginTop: 10, marginBottom: 10, marginRight: 2, height: 40 }} /> */}
                {/* <Input disabled value={selectedPeg.nm_peg} style={{borderWidth: 1, borderColor: '#ccc', marginTop: 10,marginBottom: 10, marginRight: 2, height: 40, width: '100%'}} /> */}
                <Item style={{width: Dimensions.get('screen').width * 0.5}}>
                  <Input value={selectedPeg.nm_peg} disabled />
                  <Icon
                    name="search"
                    onPress={() =>
                      this.props.navigation.push('SearchEmployee', {
                        select: true,
                      })
                    }
                    style={{}}
                  />
                </Item>
                {/* <Label style={{ height: 50, textAlignVertical: 'center', width: Dimensions.get('screen').width*0.4, paddingBottom: 2, paddingTop: 2, fontSize: 14 }}>{selectedPeg.nm_peg}</Label>
                <Icon name="search" onPress={() => navigate('SearchEmployee', { select: true })} style={{fontSize: Dimensions.get('screen').width*0.08}} /> */}
              </ListItem>
              <ListItem>
                <Label style={styles.textInputLabel}>Keperluan Cuti</Label>
                <TextInput
                  onChangeText={(val) => this.setState({alasan: val})}
                  placeholder="Keperluan Cuti"
                />
              </ListItem>
              <ListItem>
                <Label style={styles.textInputLabel}>No. Telp</Label>
                <TextInput
                  keyboardType="phone-pad"
                  onChangeText={(val) => this.setState({no_telp: val})}
                  placeholder="No. Telp"
                />
              </ListItem>
            </List>
            <Item
              style={{
                flexDirection: 'column',
                paddingTop: 10,
                paddingBottom: 10,
              }}>
              <Label style={[styles.textInputLabel, {width: '100%'}]}>
                Alamat Selama Cuti
              </Label>
              <Textarea
                onChangeText={(val) => this.setState({alamat_sementara: val})}
                style={{width: '90%'}}
                rowSpan={5}
                bordered
                placeholder="Ketik disini..."
              />
            </Item>
          </Form>
        </Content>
        <Footer style={{display: this.state.loginButtonVisible}}>
          <FooterTab>
            <Button full style={styles.buttonPrimay} onPress={this.submitForm}>
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
    user: UserStore.getUserData(),
    selectedPeg: store.getSelectedPeg(),
    data: store.getJenisCutiData(),
  };
}

export default connect(mapStateToProps)(LeaveRequest);
