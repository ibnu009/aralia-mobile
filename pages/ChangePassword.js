import React, {Component} from 'react';
import {store as UserStore} from '../remx/User/store';
import {connect} from 'remx';
import HeaderLayout from '../pages/HeaderLayout';
import {REST_URL, HEADERS_CONFIG} from '../AppConfig';
import styles from '../styles';
import {
  Container,
  Content,
  Text,
  Card,
  CardItem,
  Body,
  Item,
  Label,
  Form,
  Input,
  Footer,
  FooterTab,
  Icon,
  Button,
  View,
} from 'native-base';
import Spinner from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-simple-toast';

class ChangePassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pass_old: '',
      pass_new: '',
      verify: '',
      isLoading: true,
      showLoading: false,
      icon_old: 'eye-off',
      icon_new: 'eye-off',
      icon_ver: 'eye-off',
      password_state_old: true,
      password_state_new: true,
      password_state_ver: true,
    };
  }

  _changeIconOld() {
    this.setState((prevState) => ({
      icon_old: prevState.icon_old === 'eye' ? 'eye-off' : 'eye',
      password_state_old: !prevState.password_state_old,
    }));
  }

  _changeIconNew() {
    this.setState((prevState) => ({
      icon_new: prevState.icon_new === 'eye' ? 'eye-off' : 'eye',
      password_state_new: !prevState.password_state_new,
    }));
  }

  _changeIconVer() {
    this.setState((prevState) => ({
      icon_ver: prevState.icon_ver === 'eye' ? 'eye-off' : 'eye',
      password_state_ver: !prevState.password_state_ver,
    }));
  }

  submitForm = () => {
    let uri = `${REST_URL}/profile/pwd?id_employee=${this.props.user.id_employee}&old_password=${this.state.pass_old}&new_password=${this.state.pass_new}&confirm_password=${this.state.verify}`;

    this.setState({showLoading: true});

    // do login process
    fetch(uri, {
      method: 'POST',
      headers: {
        ...HEADERS_CONFIG.headers,
      },
    })
      .then((response) => response.json())
      .then((res) => {
        this.setState({showLoading: false});
        if (res.status == 'OK') {
          Toast.show(res.message, Toast.SHORT);
        } else {
          Toast.show(res.message, Toast.SHORT);
        }
      })
      .catch((err) => {
        this.setState({showLoading: false});
        Toast.show(`Error : ${err}`, Toast.SHORT);
      });
  };

  render() {
    return (
      <Container>
        <HeaderLayout
          navigation={this.props.navigation}
          title="Ubah Katasandi"
        />

        <Spinner
          visible={this.state.showLoading}
          color={styles.statusbarAccent.backgroundColor}
          size="large"
        />

        <Content>
          <Form>
            <Item stackedLabel>
              <Label>Password Lama</Label>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingRight: 10,
                }}>
                <Input
                  secureTextEntry={this.state.password_state_old}
                  onChangeText={(e) => this.setState({pass_old: e})}
                />
                <Icon
                  name={this.state.icon_old}
                  onPress={() => this._changeIconOld()}
                />
              </View>
            </Item>
            <Item stackedLabel>
              <Label>Password Baru</Label>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingRight: 10,
                }}>
                <Input
                  secureTextEntry={this.state.password_state_new}
                  onChangeText={(e) => this.setState({pass_new: e})}
                />
                <Icon
                  name={this.state.icon_new}
                  onPress={() => this._changeIconNew()}
                />
              </View>
            </Item>
            <Item stackedLabel last>
              <Label>Verifikasi Password</Label>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingRight: 10,
                }}>
                <Input
                  secureTextEntry={this.state.password_state_ver}
                  onChangeText={(e) => this.setState({verify: e})}
                />
                <Icon
                  name={this.state.icon_ver}
                  onPress={() => this._changeIconVer()}
                />
              </View>
            </Item>
          </Form>
          <Card>
            <CardItem header>
              <Text>Aturan Password :</Text>
            </CardItem>
            <CardItem>
              <Body>
                <Text>
                  1. Panjang karakter minimal 8 Karakter, maksimal 16 karakter
                </Text>
                <Text>2. Tidak mengandung unsur nip</Text>
                <Text>
                  3. Harus ada/mengandung minimal 1 huruf kecil dan 1 huruf
                  besar
                </Text>
                <Text>4. Harus ada/mengandung angka</Text>
                <Text>
                  5. Harus mengandung spesial karakter antara lain : & . # $ ! *
                  @
                </Text>
              </Body>
            </CardItem>
          </Card>
        </Content>

        <Footer style={{backgroundColor: 'transparent'}}>
          <FooterTab style={{backgroundColor: 'transparent'}}>
            <Button
              full
              style={{backgroundColor: '#0d8a43', borderRadius: 50}}
              onPress={this.submitForm}>
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
  };
}

export default connect(mapStateToProps)(ChangePassword);
