import React, {Component} from 'react';
import {store as UserStore} from '../remx/User/store';
import {connect} from 'remx';
import HeaderLayout from './HeaderLayout';
import {REST_URL, HEADERS_CONFIG} from '../AppConfig';
import * as UserAction from '../remx/User/actions';
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
  Button,
  Picker,
} from 'native-base';

import {View, StyleSheet, TouchableHighlight, Image, Alert} from 'react-native';

import Spinner from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-simple-toast';

const stylesButton = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#ecf0f1',
    width: '100%',
    paddingTop: '5%',
  },
  itemContainer: {
    backgroundColor: '#fff',
    margin: '5%',
    marginTop: 0,
    borderRadius: 5,
    width: '90%',
  },
  itemHeaderContainer: {
    padding: 15,
    borderColor: '#E4E2E9',
    borderBottomWidth: 1,
  },
  itemHeaderText: {
    //  height:'auto',
    color: '#333',
    fontSize: 23,
    fontWeight: '800',
  },
  itemButtonContainer: {
    padding: 13,
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  itemButtonText: {fontSize: 12, color: '#fff', fontWeight: '800'},
  itemCreateButton: {
    backgroundColor: 'green',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
});

class OfficeUpdate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      code: '',
      officeSelected: '0',
      isLoading: true,
      showLoading: false,
    };
  }

  componentDidMount() {}

  onValueChange(value) {
    this.setState({
      officeSelected: value,
    });
  }

  submitForm = () => {
    let userData = UserStore.getUserData();

    var form = new FormData();
    form.append('id_employee', userData['id_employee']);
    form.append('code', this.state.code);
    form.append('type', this.state.officeSelected);

    let uri = `${REST_URL}/update_office`;
    this.setState({showLoading: true});

    console.log(form);

    // do login process
    fetch(uri, {
      body: form,
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    })
      .then((response) => response.json())
      .then((res) => {
        this.setState({showLoading: false});
        Alert.alert(
          'Info',
          //'Reset password user berhasil. \nSilahkan periksa pesan masuk pada email anda, atau periksa pada kolom spam.',
          res.message,
          [
            {
              text: 'OK',
              onPress: () => {
                if (userData['is_quesioner'] == '1' && userData['check'] < 1) {
                  this.props.navigation.navigate('HealthSurvey');
                } else {
                  this.props.navigation.navigate('Home');
                }
              },
            },
          ],
          {cancelable: false},
        );
      })
      .catch((err) => {
        this.setState({showLoading: false});
        Toast.show(`Error : ${err}`, Toast.SHORT);
        this.props.navigation.navigate('Home');
      });
  };

  render() {
    return (
      <Container>
        <HeaderLayout navigation={this.props.navigation} title="Ubah Kantor" />

        <Spinner
          visible={this.state.showLoading}
          color={styles.statusbarAccent.backgroundColor}
          size="large"
        />

        <Content>
          <Form>
            <Item stackedLabel>
              <Label>Kode</Label>
              <Input
                value={this.state.code}
                autoFocus={true}
                onChangeText={(val) => this.setState({code: val})}
              />
            </Item>
            <Item stackedLabel>
              <Label>Type</Label>
              <Picker
                mode="dropdown"
                style={{width: '100%', marginLeft: -20}}
                placeholder="Select your SIM"
                placeholderStyle={{color: '#bfc6ea'}}
                placeholderIconColor="#007aff"
                selectedValue={this.state.officeSelected}
                onValueChange={this.onValueChange.bind(this)}>
                <Picker.Item label="Pilih Kantor" value="0" />
                <Picker.Item label="Kantor Pusat" value="1" />
                <Picker.Item label="The Gade Learning Center" value="2" />
                <Picker.Item label="Kantor Wilayah" value="3" />
                <Picker.Item label="Area" value="4" />
                <Picker.Item label="Kantor Hukum" value="5" />
                <Picker.Item label="Inspektur" value="6" />
                <Picker.Item label="Gudang" value="7" />
                <Picker.Item label="Cabang" value="8" />
                <Picker.Item label="Unit" value="9" />
              </Picker>
            </Item>
          </Form>
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

export default connect(mapStateToProps)(OfficeUpdate);
