import React, {Component} from 'react';
import HeaderLayout from '../HeaderLayout';
import style from '../../styles';
import * as action from '../../remx/Service/actions';
import {store} from '../../remx/Service/store';
import {connect} from 'remx';
import {store as UserStore} from '../../remx/User/store';
import DocumentPicker from 'react-native-document-picker';
import Spinner from 'react-native-loading-spinner-overlay';
import {
  REST_URL,
  HEADERS_CONFIG,
  formatJam,
  getDateFromString,
} from '../../AppConfig';
import {Alert, Dimensions} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import DatePicker from 'react-native-datepicker';
import {
  Container,
  Content,
  Form,
  Item,
  Label,
  Picker,
  Input,
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
  View,
  Toast,
} from 'native-base';
import SimpleToast from 'react-native-simple-toast';

class Dispensation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showLoading: false,
      nip: '',
      jenis: 0,
      tgl_permintaan: '',
      keterangan: '',
      no_spd: '',
      kd_absen: '1',
      kd_jenis_absen: '1',
      tgl_start: '',
      tgl_end: '',
      tanggal_masuk_2: '',
      tanggal_keluar_2: '',
      tanggal_masuk_sehari: '',
      jam_masuk_sehari: formatJam(),
      jam_keluar_sehari: formatJam(),
      jam_masuk_2: formatJam(),
      jam_keluar_2: formatJam(),
      fileUri: null,
      fileType: null,
      fileName: null,
      fileSize: 0,
    };
  }

  componentDidMount() {
    AsyncStorage.getItem('nip').then((result) => {
      this.setState({nip: result});
    });
    if (store.getJenisDispen().toString() == '') {
      action.getJenisDispen();
    }
  }

  setDate = (value, target) => {
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
    this.setState({[target]: value});
    // this.state[target] = value
  };

  showPicker = () => {
    DocumentPicker.pick({
      type: [
        // DocumentPickerUtil.allFiles(),
        DocumentPicker.types.images,
        // DocumentPickerUtil.pdf(),
        // Audio DocumentPickerUtil.audio(),
        // Plain Text DocumentPickerUtil.plainText(),
      ],
    })
      .then((res) => {
        if (res !== null) {
          if (parseFloat(res.size / 1000).toFixed(2) > 500) {
            Alert.alert(
              'Warning',
              `Ukuran file tidak boleh lebih besar dari 500kb`,
              [{text: 'Close'}],
            );
          } else {
            this.setState({
              fileUri: res.uri,
              fileType: res.type,
              fileName: res.name,
              fileSize: parseFloat(res.size / 1000).toFixed(2),
            });
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
    let lolos = false;
    if (
      this.props.jenisDispen[this.state.jenis].id == 1 ||
      this.props.jenisDispen[this.state.jenis].id == 2 ||
      this.props.jenisDispen[this.state.jenis].id == 8 ||
      this.props.jenisDispen[this.state.jenis].id == 22
    ) {
      if (this.state.kd_absen == 1) {
        if (this.state.tanggal_masuk_sehari == '') {
          Alert.alert('Warning', `Pilih Tanggal Sehari`, [{text: 'OK'}]);
        } else if (new Date(this.state.tanggal_masuk_sehari) > new Date()) {
          Alert.alert(
            'Warning',
            `Tanggal Dispensasi Tidak Boleh Lebih Besar Dari Tanggal Sekarang`,
            [{text: 'OK'}],
          );
        } else if (
          this.state.jam_keluar_sehari.split(':')[0] <
          this.state.jam_masuk_sehari.split(':')[0]
        ) {
          Alert.alert('Warning', `Jam Pulang Tidak Boleh Dibawah Jam Masuk`, [
            {text: 'OK'},
          ]);
        } else if (
          this.state.jam_keluar_sehari.split(':')[0] ==
            this.state.jam_masuk_sehari.split(':')[0] &&
          this.state.jam_keluar_sehari.split(':')[1] <
            this.state.jam_masuk_sehari.split(':')[1]
        ) {
          Alert.alert('Warning', `Jam Pulang Tidak Boleh Dibawah Jam Masuk`, [
            {text: 'OK'},
          ]);
        } else if (this.state.keterangan == '') {
          Alert.alert('Warning', `Isi Keterangan`, [{text: 'OK'}]);
        } else if (
          !this.state.fileName &&
          (this.props.jenisDispen[this.state.jenis].id != 26 ||
            this.props.jenisDispen[this.state.jenis].id != 27)
        ) {
          Alert.alert('Warning', `Pilih File`, [{text: 'OK'}]);
        } else {
          lolos = true;
        }
      } else {
        if (this.state.kd_jenis_absen == 1) {
          if (this.state.tanggal_masuk_2 == '') {
            Alert.alert('Warning', `Pilih Tanggal`, [{text: 'OK'}]);
          } else if (new Date(this.state.tanggal_masuk_2) > new Date()) {
            Alert.alert(
              'Warning',
              `Tanggal Dispensasi Tidak Boleh Lebih Besar Dari Tanggal Sekarang`,
              [{text: 'OK'}],
            );
          } else if (this.state.keterangan == '') {
            Alert.alert('Warning', `Isi Keterangan`, [{text: 'OK'}]);
          } else if (
            !this.state.fileName &&
            (this.props.jenisDispen[this.state.jenis].id != 26 ||
              this.props.jenisDispen[this.state.jenis].id != 27)
          ) {
            Alert.alert('Warning', `Pilih File`, [{text: 'OK'}]);
          } else {
            lolos = true;
          }
        } else {
          if (this.state.tanggal_keluar_2 == '') {
            Alert.alert('Warning', `Pilih Tanggal`, [{text: 'OK'}]);
          } else if (new Date(this.state.tanggal_keluar_2) > new Date()) {
            Alert.alert(
              'Warning',
              `Tanggal Dispensasi Tidak Boleh Lebih Besar Dari Tanggal Sekarang`,
              [{text: 'OK'}],
            );
          } else if (this.state.keterangan == '') {
            Alert.alert('Warning', `Isi Keterangan`, [{text: 'OK'}]);
          } else if (
            !this.state.fileName &&
            (this.props.jenisDispen[this.state.jenis].id != 26 ||
              this.props.jenisDispen[this.state.jenis].id != 27)
          ) {
            Alert.alert('Warning', `Pilih File`, [{text: 'OK'}]);
          } else {
            lolos = true;
          }
        }
      }
    } else if (this.props.jenisDispen[this.state.jenis].id == 24) {
      if (this.state.tanggal_masuk_2 == '') {
        Alert.alert('Warning', `Pilih Tanggal`, [{text: 'OK'}]);
      } else if (new Date(this.state.tanggal_masuk_2) > new Date()) {
        Alert.alert(
          'Warning',
          `Tanggal Dispensasi Tidak Boleh Lebih Besar Dari Tanggal Sekarang`,
          [{text: 'OK'}],
        );
      } else if (this.state.keterangan == '') {
        Alert.alert('Warning', `Isi Keterangan`, [{text: 'OK'}]);
      } else if (
        !this.state.fileName &&
        (this.props.jenisDispen[this.state.jenis].id != 26 ||
          this.props.jenisDispen[this.state.jenis].id != 27)
      ) {
        Alert.alert('Warning', `Pilih File`, [{text: 'OK'}]);
      } else {
        lolos = true;
      }
    } else if (this.props.jenisDispen[this.state.jenis].id == 25) {
      if (this.state.tanggal_keluar_2 == '') {
        Alert.alert('Warning', `Pilih Tanggal`, [{text: 'OK'}]);
      } else if (new Date(this.state.tanggal_keluar_2) > new Date()) {
        Alert.alert(
          'Warning',
          `Tanggal Dispensasi Tidak Boleh Lebih Besar Dari Tanggal Sekarang`,
          [{text: 'OK'}],
        );
      } else if (this.state.keterangan == '') {
        Alert.alert('Warning', `Isi Keterangan`, [{text: 'OK'}]);
      } else if (
        !this.state.fileName &&
        (this.props.jenisDispen[this.state.jenis].id != 26 ||
          this.props.jenisDispen[this.state.jenis].id != 27)
      ) {
        Alert.alert('Warning', `Pilih File`, [{text: 'OK'}]);
      } else {
        lolos = true;
      }
    } else if (this.props.jenisDispen[this.state.jenis].id == 20) {
      if (this.state.no_spd.length == 0) {
        Alert.alert('Warning', `Isi No. SPD!`, [{text: 'OK'}]);
      } else {
        lolos = true;
      }
    } else {
      if (this.state.tgl_start == '') {
        Alert.alert('Warning', `Pilih Tanggal Mulai`, [{text: 'OK'}]);
      } else if (this.state.tgl_end == '') {
        Alert.alert('Warning', `Pilih Tanggal Selesai`, [{text: 'OK'}]);
      } else if (
        new Date(this.state.tgl_start) > new Date() ||
        new Date(this.state.tgl_end) > new Date()
      ) {
        Alert.alert(
          'Warning',
          `Tanggal Dispensasi Tidak Boleh Lebih Besar Dari Tanggal Sekarang`,
          [{text: 'OK'}],
        );
      } else if (
        new Date(this.state.tgl_end) < new Date(this.state.tgl_start)
      ) {
        Alert.alert(
          'Warning',
          `Tanggal Selesai Tidak Boleh Lebih Rendah Tanggal Mulai`,
          [{text: 'OK'}],
        );
      } else if (this.state.keterangan == '') {
        Alert.alert('Warning', `Isi Keterangan`, [{text: 'OK'}]);
      } else if (
        !this.state.fileName &&
        !new RegExp(/tidak absen/i).exec(
          this.props.jenisDispen[this.state.jenis].keterangan,
        )
      ) {
        Alert.alert('Warning', `Pilih File`, [{text: 'OK'}]);
      } else {
        lolos = true;
      }
    }

    if (lolos) {
      this.setState({showLoading: true});
      const uri = `${REST_URL}/absensi/dispensasi_absen.php`;

      const formData = new FormData();
      formData.append('nip', this.props.User.nip);
      formData.append(
        'jns_dispensasi',
        this.props.jenisDispen[this.state.jenis].id,
      );
      formData.append('tgl_start', this.state.tgl_start);
      formData.append('tgl_end', this.state.tgl_end);
      formData.append('kd_absen', this.state.kd_absen);
      formData.append('kd_jenis_absen', this.state.kd_jenis_absen);
      formData.append('keterangan', this.state.keterangan);
      formData.append('tanggal_masuk_sehari', this.state.tanggal_masuk_sehari);
      formData.append('jam_masuk_sehari', this.state.jam_masuk_sehari);
      formData.append('jam_keluar_sehari', this.state.jam_keluar_sehari);
      formData.append('tanggal_masuk_2', this.state.tanggal_masuk_2);
      formData.append('jam_masuk_2', this.state.jam_masuk_2);
      formData.append('tanggal_keluar_2', this.state.tanggal_keluar_2);
      formData.append('jam_keluar_2', this.state.jam_keluar_2);
      console.log(formData);
      return false;
      if (this.state.fileUri != '') {
        formData.append('file', {
          uri: this.state.fileUri,
          type: this.state.fileType,
          name: this.state.fileName,
        });
        formData.append('Content-Type', this.state.fileType);
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
        .then((res) => {
          this.setState({showLoading: false});
          if (typeof res.error != 'undefined' && res.error != '') {
            Alert.alert('Info', res.error, [{text: 'OK'}]);
          } else {
            Alert.alert('Info', res.message, [{text: 'OK'}]);
            this.props.navigation.goBack();
            action.getMyRequest(this.state.nip);
          }
        })
        .catch((err) => {
          this.setState({showLoading: false});
          Toast.show({
            text: `Error: ${err}`,
            type: 'danger',
          });
        });
    }
  };

  getFieldContent = () => {
    let {jenisDispen} = this.props;

    let selectedDispen = '';
    if (jenisDispen.length == 0) {
      selectedDispen = 99;
    } else {
      selectedDispen = jenisDispen[this.state.jenis].id;
    }

    if (
      selectedDispen == 3 ||
      selectedDispen == 4 ||
      selectedDispen == 5 ||
      selectedDispen == 6 ||
      selectedDispen == 7 ||
      selectedDispen == 9 ||
      selectedDispen == 16 ||
      selectedDispen == 19 ||
      selectedDispen == 21 ||
      selectedDispen == 23 ||
      selectedDispen == 26 ||
      selectedDispen == 27 ||
      selectedDispen == 28 ||
      selectedDispen == 29
    ) {
      return (
        <View style={{marginLeft: 10}}>
          <Item>
            <Label
              style={{
                width: '100%',
                height: 40,
                textAlign: 'center',
                textAlignVertical: 'center',
              }}>
              Tanggal Pengajuan
            </Label>
          </Item>
          <Item>
            <Left style={{paddingLeft: '10%'}}>
              <DatePicker
                confirmBtnText="Ok"
                cancelBtnText="Batal"
                mode="date"
                date={this.state.tgl_start}
                showIcon={false}
                placeholder="Tanggal Mulai"
                format="DD/MM/YYYY"
                customStyles={{datePicker: {backgroundColor: '#000'}}}
                onDateChange={(val) => this.setState({tgl_start: val})}
              />
            </Left>
            <Right style={{paddingRight: '10%'}}>
              <DatePicker
                confirmBtnText="Ok"
                cancelBtnText="Batal"
                mode="date"
                minDate={getDateFromString(this.state.tgl_start)}
                date={this.state.tgl_end}
                showIcon={false}
                placeholder="Tanggal Selesai"
                format="DD/MM/YYYY"
                customStyles={{datePicker: {backgroundColor: '#000'}}}
                onDateChange={(val) => this.setState({tgl_end: val})}
              />
            </Right>
          </Item>
        </View>
      );
    } else if (selectedDispen == 20) {
      return (
        <View style={{marginLeft: 10}}>
          <Item>
            <Label style={style.textInputLabel}>No SPD</Label>
            <Input
              value={this.state.no_spd}
              style={{
                borderWidth: 1,
                borderColor: '#ccc',
                marginTop: 10,
                marginBottom: 10,
                marginRight: 2,
                height: 40,
              }}
              onChangeText={(val) => this.setState({no_spd: val})}
            />
          </Item>
          <Item>
            <Label
              style={{
                width: '100%',
                height: 40,
                textAlign: 'center',
                textAlignVertical: 'center',
              }}>
              Tanggal Pengajuan
            </Label>
          </Item>
          <Item>
            <Left style={{paddingLeft: '10%'}}>
              <DatePicker
                confirmBtnText="Ok"
                cancelBtnText="Batal"
                mode="date"
                date={this.state.tgl_start}
                placeholder="DD/MM/YYYY"
                format="DD/MM/YYYY"
                showIcon={false}
                customStyles={{datePicker: {backgroundColor: '#000'}}}
                onDateChange={(val) => this.setState({tgl_start: val})}
              />
            </Left>
            <Right style={{paddingRight: '10%'}}>
              <DatePicker
                confirmBtnText="Ok"
                cancelBtnText="Batal"
                mode="date"
                date={this.state.tgl_end}
                placeholder="DD/MM/YYYY"
                format="DD/MM/YYYY"
                showIcon={false}
                customStyles={{datePicker: {backgroundColor: '#000'}}}
                onDateChange={(val) => this.setState({tgl_end: val})}
              />
            </Right>
          </Item>
        </View>
      );
    } else if (selectedDispen == 24) {
      return (
        <View style={{marginLeft: 10}}>
          <Item>
            <Label
              style={{
                width: '100%',
                height: 40,
                textAlign: 'center',
                textAlignVertical: 'center',
              }}>
              Tanggal / Jam Masuk Setengah Hari
            </Label>
          </Item>
          <Item>
            <Left style={{paddingLeft: '5%', paddingTop: 5, paddingBottom: 5}}>
              <DatePicker
                confirmBtnText="Ok"
                cancelBtnText="Batal"
                mode="date"
                date={this.state.tanggal_masuk_2}
                placeholder="DD/MM/YYYY"
                format="DD/MM/YYYY"
                showIcon={false}
                customStyles={{datePicker: {backgroundColor: '#000'}}}
                onDateChange={(val) => this.setState({tanggal_masuk_2: val})}
              />
            </Left>
            <Right style={{paddingTop: 5, paddingBottom: 5}}>
              <DatePicker
                confirmBtnText="Ok"
                cancelBtnText="Batal"
                mode="time"
                date={this.state.jam_masuk_2}
                format="HH:mm"
                showIcon={false}
                customStyles={{datePicker: {backgroundColor: '#000'}}}
                onDateChange={(val) => this.setState({jam_masuk_2: val})}
              />
            </Right>
          </Item>
        </View>
      );
    } else if (selectedDispen == 25) {
      return (
        <View style={{marginLeft: 10}}>
          <Item>
            <Label
              style={{
                width: '100%',
                height: 40,
                textAlign: 'center',
                textAlignVertical: 'center',
              }}>
              Tanggal / Jam Keluar Setengah Hari
            </Label>
          </Item>
          <Item>
            <Left style={{paddingLeft: '5%', paddingTop: 5, paddingBottom: 5}}>
              <DatePicker
                confirmBtnText="Ok"
                cancelBtnText="Batal"
                mode="date"
                date={this.state.tanggal_keluar_2}
                placeholder="DD/MM/YYYY"
                format="DD/MM/YYYY"
                showIcon={false}
                customStyles={{datePicker: {backgroundColor: '#000'}}}
                onDateChange={(val) => this.setState({tanggal_keluar_2: val})}
              />
            </Left>
            <Right style={{paddingTop: 5, paddingBottom: 5}}>
              <DatePicker
                confirmBtnText="Ok"
                cancelBtnText="Batal"
                mode="time"
                date={this.state.jam_keluar_2}
                format="HH:mm"
                showIcon={false}
                customStyles={{datePicker: {backgroundColor: '#000'}}}
                onDateChange={(val) => this.setState({jam_keluar_2: val})}
              />
            </Right>
          </Item>
        </View>
      );
    } else if (
      selectedDispen == 1 ||
      selectedDispen == 2 ||
      selectedDispen == 8 ||
      selectedDispen == 22
    ) {
      return (
        <View style={{marginLeft: 10}}>
          <Item>
            <Label style={style.textInputLabel}>Pilihan</Label>
            <Picker
              note
              mode="dropdown"
              selectedValue={this.state.kd_absen}
              onValueChange={(val) => this.setState({kd_absen: val})}
              style={{width: 120}}>
              <Picker.Item label="Sehari" value="1" />
              <Picker.Item label="Setengah Hari" value="2" />
            </Picker>
          </Item>
        </View>
      );
    }
  };

  checkKdAbsen = () => {
    if (this.state.kd_absen == 1) {
      return (
        <View style={{marginLeft: 10}}>
          <Item>
            <Label style={style.textInputLabel}>Tanggal Sehari</Label>
            <DatePicker
              confirmBtnText="Ok"
              cancelBtnText="Batal"
              mode="date"
              date={this.state.tanggal_masuk_sehari}
              placeholder="Tanggal Sehari"
              format="DD/MM/YYYY"
              showIcon={false}
              customStyles={{datePicker: {backgroundColor: '#000'}}}
              onDateChange={(val) => this.setState({tanggal_masuk_sehari: val})}
            />
          </Item>
          <Item>
            <Label
              style={{
                width: '100%',
                height: 40,
                textAlign: 'center',
                textAlignVertical: 'center',
              }}>
              Jam Masuk & Keluar Sehari
            </Label>
          </Item>
          <Item>
            <Left style={{paddingLeft: '5%', paddingTop: 5, paddingBottom: 5}}>
              <DatePicker
                confirmBtnText="Ok"
                cancelBtnText="Batal"
                mode="time"
                date={this.state.jam_masuk_sehari}
                format="HH:mm"
                showIcon={false}
                customStyles={{datePicker: {backgroundColor: '#000'}}}
                onDateChange={(val) => this.setState({jam_masuk_sehari: val})}
              />
            </Left>
            <Right style={{paddingTop: 5, paddingBottom: 5}}>
              <DatePicker
                confirmBtnText="Ok"
                cancelBtnText="Batal"
                mode="time"
                date={this.state.jam_keluar_sehari}
                format="HH:mm"
                showIcon={false}
                customStyles={{datePicker: {backgroundColor: '#000'}}}
                onDateChange={(val) => this.setState({jam_keluar_sehari: val})}
              />
            </Right>
          </Item>
        </View>
      );
    } else {
      return (
        <Item>
          <Label style={style.textInputLabel}>Jenis Jam</Label>
          <Picker
            note
            mode="dropdown"
            selectedValue={this.state.kd_jenis_absen}
            onValueChange={(val) => this.setState({kd_jenis_absen: val})}
            style={{width: 120}}>
            <Picker.Item label="Masuk" value="1" />
            <Picker.Item label="Pulang" value="2" />
          </Picker>
        </Item>
      );
    }
  };

  checkKdJenis = () => {
    if (this.state.kd_jenis_absen == 1) {
      return (
        <View style={{marginLeft: 10}}>
          <Item>
            <Label
              style={{
                width: '100%',
                height: 40,
                textAlign: 'center',
                textAlignVertical: 'center',
              }}>
              Tanggal / Jam Masuk Setengah Hari
            </Label>
          </Item>
          <Item>
            <Left style={{paddingLeft: '5%', paddingTop: 5, paddingBottom: 5}}>
              <DatePicker
                confirmBtnText="Ok"
                cancelBtnText="Batal"
                mode="date"
                date={this.state.tanggal_masuk_2}
                placeholder="Tanggal"
                format="DD/MM/YYYY"
                showIcon={false}
                customStyles={{datePicker: {backgroundColor: '#000'}}}
                onDateChange={(val) => this.setState({tanggal_masuk_2: val})}
              />
            </Left>
            <Right style={{paddingTop: 5, paddingBottom: 5}}>
              <DatePicker
                confirmBtnText="Ok"
                cancelBtnText="Batal"
                mode="time"
                date={this.state.jam_masuk_2}
                placeholder="Jam Masuk"
                format="HH:mm"
                showIcon={false}
                customStyles={{datePicker: {backgroundColor: '#000'}}}
                onDateChange={(val) => this.setState({jam_masuk_2: val})}
              />
            </Right>
          </Item>
        </View>
      );
    } else {
      return (
        <View style={{marginLeft: 10}}>
          <Item>
            <Label
              style={{
                width: '100%',
                height: 40,
                textAlign: 'center',
                textAlignVertical: 'center',
              }}>
              Tanggal / Jam Keluar Setengah Hari
            </Label>
          </Item>
          <Item>
            <Left style={{paddingLeft: '5%', paddingTop: 5, paddingBottom: 5}}>
              <DatePicker
                confirmBtnText="Ok"
                cancelBtnText="Batal"
                mode="date"
                date={this.state.tanggal_keluar_2}
                placeholder="Tanggal"
                format="DD/MM/YYYY"
                onDateChange={(val) => this.setState({tanggal_keluar_2: val})}
              />
            </Left>
            <Right style={{paddingTop: 5, paddingBottom: 5}}>
              <DatePicker
                confirmBtnText="Ok"
                cancelBtnText="Batal"
                mode="time"
                date={this.state.jam_keluar_2}
                format="HH:mm"
                showIcon={false}
                customStyles={{datePicker: {backgroundColor: '#000'}}}
                onDateChange={(val) => this.setState({jam_keluar_2: val})}
              />
            </Right>
          </Item>
        </View>
      );
    }
  };

  render() {
    const {jenisDispen} = this.props;

    return (
      <Container>
        <HeaderLayout
          title="Permohonan Dispensasi Absensi"
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
              <Label style={style.textInputLabel}>Jenis Dispensasi</Label>
              <Picker
                note
                mode="dropdown"
                selectedValue={this.state.jenis}
                onValueChange={(val) => this.setState({jenis: val})}
                style={{width: Dimensions.get('screen').width * 0.5}}>
                {jenisDispen.map((label, i) => (
                  <Picker.Item label={label.keterangan} value={i} key={i} />
                ))}
              </Picker>
            </Item>

            {this.getFieldContent()}

            {jenisDispen.length > 0 ? (
              jenisDispen[this.state.jenis].id == 1 ||
              jenisDispen[this.state.jenis].id == 2 ||
              jenisDispen[this.state.jenis].id == 8 ||
              jenisDispen[this.state.jenis].id == 22 ? (
                this.checkKdAbsen()
              ) : (
                <Text style={{display: 'none'}}></Text>
              )
            ) : (
              <Text style={{display: 'none'}}></Text>
            )}
            {jenisDispen.length > 0 ? (
              jenisDispen[this.state.jenis].id == 1 ||
              jenisDispen[this.state.jenis].id == 2 ||
              jenisDispen[this.state.jenis].id == 8 ||
              jenisDispen[this.state.jenis].id == 22 ? (
                this.state.kd_absen == 2 ? (
                  this.checkKdJenis()
                ) : (
                  <Text style={{display: 'none'}}></Text>
                )
              ) : (
                <Text style={{display: 'none'}}></Text>
              )
            ) : (
              <Text style={{display: 'none'}}></Text>
            )}
            <Item>
              <Label style={{width: '50%'}}>Keterangan</Label>
              <Textarea
                onChangeText={(val) => this.setState({keterangan: val})}
                style={{width: '49%', marginBottom: 5}}
                rowSpan={5}
                bordered
                placeholder="Ketik disini..."
              />
            </Item>
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
        <Footer>
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

function mapStateToProps() {
  return {
    jenisDispen: store.getJenisDispen(),
    User: UserStore.getUserData(),
  };
}

export default connect(mapStateToProps)(Dispensation);
