import React, {Component} from 'react';
import {connect} from 'remx';
import {store as UserStore} from '../../remx/User/store';
import {store as ServiceStore} from '../../remx/Service/store';
import * as ServiceAction from '../../remx/Service/actions';
import styles from '../../styles';
import HeaderLayout from '../HeaderLayout';
import DateTimePicker from '@react-native-community/datetimepicker';
import {REST_URL, HEADERS_CONFIG} from '../../AppConfig';
import {
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import {
  Container,
  Content,
  Item,
  Label,
  Left,
  Form,
  Text,
  Right,
  ListItem,
  Row,
  Col,
  Card,
  DatePicker,
  Button,
  Picker,
  Textarea,
  Footer,
  FooterTab,
  Icon,
} from 'native-base';

class Overtime extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = {
      nip: '',
      selectedDate: new Date(),
      showStartTimePicker: false,
      selectedStartTimePicker: new Date(),
      showEndTimePicker: false,
      selectedEndTimePicker: new Date(),
      jenisLembur: '1',
      tujuanLembur: '',
      showLoading: false,
      loginButtonVisible: 'flex',
    };
  }

  componentDidMount() {
    this._isMounted = true;

    AsyncStorage.getItem('nip').then((result) => {
      this.setState({nip: result});
    });

    if (ServiceStore.getJenisLemburData().toString() == '') {
      ServiceAction.getJenisLembur();
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleConfirmTimePickerStart = (date) => {
    this.setState({selectedStartTimePicker: date});
    this.setState({showStartTimePicker: false});
  };

  handleConfirmTimePickerEnd = (date) => {
    this.setState({selectedEndTimePicker: date});
    this.setState({showEndTimePicker: false});
  };

  handleCancelTimePicker = (i) => {
    if (i == 1) {
      this.setState({showStartTimePicker: false});
    } else {
      this.setState({showEndTimePicker: false});
    }
  };

  /* getJenisLembur() {
    if (this.props.jenisLembur.toString() != '') {
      this.props.jenisLembur.map((e,i) => {
        return(
          <Picker.Item label={e.ket_lembur} value={e.lbr_id} key={i} />
        )
      })
    }
  } */
  setDate(value) {
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
    //value = value.getFullYear() + "-" + bulan + "-" + hari
    value = hari + '/' + bulan + '/' + value.getFullYear();
    return value;
  }

  formatJam = (date) => {
    let finalData = '';
    if (date.getHours() < 10) finalData += '0';
    finalData += date.getHours() + ':';
    if (date.getMinutes() < 10) finalData += '0';
    finalData += date.getMinutes();
    return finalData;
  };

  submitForm = () => {
    if (this.state.selectedDate == '') {
      Alert.alert('Warning', `Pilih Tanggal Lembur`, [{text: 'OK'}]);
    } else if (this.state.selectedStartTimePicker == '') {
      Alert.alert('Warning', `Isi Jam Mulai`, [{text: 'OK'}]);
    } else if (this.state.selectedEndTimePicker == '') {
      Alert.alert('Warning', `Isi Jam Selesai`, [{text: 'OK'}]);
    } else if (this.state.jenisLembur == '') {
      Alert.alert('Warning', `Isi Tipe Lembur`, [{text: 'OK'}]);
    } else if (this.state.tujuanLembur == '') {
      Alert.alert('Warning', `Isi Pekerjaan & Hasil Pekerjaan`, [{text: 'OK'}]);
    } else {
      this.setState({
        showLoading: true,
        loginButtonVisible: 'none',
      });
      const uri = `${REST_URL}/lembur/insert_new.php`;
      //console.log(uri + `nip=${this.props.user.nip}&jns_lembur=${this.state.jenisLembur}&tanggal=${this.setDate(this.state.selectedDate)}&jam_mulai_lembur=${this.state.selectedStartTimePicker.getHours() + ':' + this.state.selectedStartTimePicker.getMinutes()}&jam_selesai_lembur=${this.state.selectedEndTimePicker.getHours() + ':' + this.state.selectedEndTimePicker.getMinutes()}&alasan=${this.state.tujuanLembur}`);
      // this.setState({isLoading: true, data: []})
      fetch(uri, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          ...HEADERS_CONFIG.headers,
        },
        body: `nip=${this.props.user.nip}&jns_lembur=${
          this.state.jenisLembur
        }&tanggal=${this.setDate(
          this.state.selectedDate,
        )}&jam_mulai_lembur=${this.formatJam(
          this.state.selectedStartTimePicker,
        )}&jam_selesai_lembur=${this.formatJam(
          this.state.selectedEndTimePicker,
        )}&alasan=${this.state.tujuanLembur}`,
      })
        .then((response) => response.json())
        .then((responseJson) => {
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
          // this.setState({data: responseJSON.data, isLoading: false})
        });
    }
  };

  render() {
    const {user} = this.props;
    const monthArr = [
      'Januari',
      'Pebuari',
      'Maret',
      'April',
      'Mei',
      'Juni',
      'Juli',
      'Agustus',
      'September',
      'Oktober',
      'November',
      'Desember',
    ];
    const {jenisLemburdata} = this.props;

    return (
      <Container>
        <HeaderLayout
          title="Permohonan Lembur"
          navigation={this.props.navigation}
        />
        <Content>
          {/*   <Spinner
            visible={ServiceStore.getJenisLemburData().toString()!='' ? false : true}
            color={style.statusbarAccent.backgroundColor}
            size='large' /> */}

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
            <ListItem itemDivider />
            <Row>
              <Col size={50} style={{paddingLeft: 15}}>
                <Card transparent style={{flexDirection: 'row'}}>
                  <Image
                    source={require('assets/calendar.png')}
                    style={{width: 30, height: 30}}
                  />
                  <Label style={{top: 5, left: 5}}>Tanggal</Label>
                </Card>
                <Card transparent style={{flexDirection: 'row'}}>
                  <Card transparent style={{width: '40%', paddingLeft: '5%'}}>
                    <Text style={style.textDate}>
                      {this.state.selectedDate.getDate()}
                    </Text>
                  </Card>
                  <Card transparent style={{width: '50%'}}>
                    <Text
                      style={{
                        borderBottomWidth: 1,
                        borderBottomColor: '#ccc',
                        top: 15,
                      }}>
                      {monthArr[this.state.selectedDate.getMonth()]}
                    </Text>
                    <Text style={{top: 15}}>
                      {this.state.selectedDate.getFullYear()}
                    </Text>
                  </Card>
                </Card>
                {/* <Row>
                  <Col size={50}>
                  </Col>
                  <Col size={50}>
                    <Text style={{borderBottomWidth: 1, borderBottomColor: '#ccc',top:15,right:10}}>{monthArr[this.state.selectedDate.getMonth()]}</Text>
                    <Text style={{top:15,right:10}}>{this.state.selectedDate.getFullYear()}</Text>
                  </Col>
                </Row> */}
                <Row>
                  <Col size={15}></Col>
                  <Col size={80}>
                    <Button
                      block
                      small
                      rounded
                      style={{
                        marginRight: 10,
                        marginBottom: 10,
                        height: Dimensions.get('window').height * 0.04,
                        backgroundColor: styles.buttonPrimay.backgroundColor,
                      }}>
                      <DatePicker
                        locale={'en'}
                        timeZoneOffsetInMinutes={undefined}
                        modalTransparent={false}
                        animationType={'fade'}
                        androidMode={'default'}
                        placeHolderText="Pilih Tanggal"
                        placeHolderTextStyle={{
                          color: '#fff',
                          paddingBottom:
                            Dimensions.get('window').height * 0.035,
                        }}
                        formatChosenDate={undefined}
                        textStyle={{color: '#fff'}}
                        selectedDate={new Date()}
                        onDateChange={(val) =>
                          this.setState({selectedDate: val})
                        }
                        disabled={true}
                      />
                    </Button>
                  </Col>
                </Row>
              </Col>

              <Col
                size={50}
                style={{
                  borderLeftColor: '#ccc',
                  borderLeftWidth: 1,
                  paddingLeft: 15,
                }}>
                <Card transparent style={{flexDirection: 'row'}}>
                  <Image
                    source={require('assets/start-time.png')}
                    style={style.imageInputLabel}
                  />
                  <Text>Jam mulai</Text>
                </Card>
                <Button
                  iconLeft
                  bordered
                  success
                  block
                  small
                  style={{
                    marginRight: 10,
                    minHeight: Dimensions.get('window').height * 0.045,
                  }}
                  onPress={() => this.setState({showStartTimePicker: true})}>
                  <Icon name="time" />
                  <Text>
                    {this.formatJam(this.state.selectedStartTimePicker)}
                  </Text>
                </Button>
                <DateTimePicker
                  mode="time"
                  date={this.state.selectedStartTimePicker}
                  isVisible={this.state.showStartTimePicker}
                  onConfirm={this.handleConfirmTimePickerStart}
                  onCancel={() => this.handleCancelTimePicker(1)}
                />

                <Card transparent style={{flexDirection: 'row'}}>
                  <Image
                    source={require('assets/end-time.png')}
                    style={style.imageInputLabel}
                  />
                  <Text>Jam selesai</Text>
                </Card>
                <Button
                  bordered
                  iconLeft
                  success
                  block
                  small
                  style={{
                    marginRight: 10,
                    minHeight: Dimensions.get('window').height * 0.045,
                  }}
                  onPress={() => this.setState({showEndTimePicker: true})}>
                  <Icon name="time" />
                  <Text>
                    {this.formatJam(this.state.selectedEndTimePicker)}
                  </Text>
                </Button>
                <DateTimePicker
                  mode="time"
                  date={this.state.selectedEndTimePicker}
                  isVisible={this.state.showEndTimePicker}
                  onConfirm={this.handleConfirmTimePickerEnd}
                  onCancel={() => this.handleCancelTimePicker(2)}
                />
              </Col>
            </Row>
            <ListItem itemDivider />

            <Item>
              <Image
                source={require('assets/type-overtime.png')}
                style={style.imageInputLabel}
              />
              <Label style={style.textInputLabel}>Tipe Lembur</Label>
              <Picker
                note
                mode="dropdown"
                selectedValue={this.state.jenisLembur}
                onValueChange={(val) => this.setState({jenisLembur: val})}
                style={{width: 120}}>
                {jenisLemburdata.map((label, i) => (
                  <Picker.Item
                    label={label.ket_lembur}
                    value={label.lbr_id}
                    key={i}
                  />
                ))}
              </Picker>
            </Item>
            <Item
              last
              style={{
                paddingTop: 10,
                paddingBottom: 10,
                flexDirection: 'column',
              }}>
              <Card transparent style={{width: '100%', flexDirection: 'row'}}>
                <Image
                  source={require('assets/purposetype.png')}
                  style={style.imageInputLabel}
                />
                <Label style={[style.textInputLabel, {width: '100%'}]}>
                  Pekerjaan & Hasil Pekerjaan
                </Label>
              </Card>
              <Textarea
                bordered
                style={{width: '97%', right: 5}}
                rowSpan={5}
                placeholder="Ketik disini..."
                onChangeText={(val) => this.setState({tujuanLembur: val})}
              />
            </Item>
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
      </Container>
    );
  }
}

const style = StyleSheet.create({
  ...styles,
  textDate: {
    fontSize: 55,
    fontWeight: 'bold',
    color: '#064c8b',
  },
});

function mapStateToProps(ownProps) {
  return {
    user: UserStore.getUserData(),
    jenisLemburdata: ServiceStore.getJenisLemburData(),
  };
}

export default connect(mapStateToProps)(Overtime);
