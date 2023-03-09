import React, {Component} from 'react';
import {connect} from 'remx';
import {store} from '../../remx/Service/store';
import * as action from '../../remx/Service/actions';
import HeaderLayout from '../HeaderLayout';
import styles from '../../styles';
import {REST_URL, HEADERS_CONFIG} from '../../AppConfig';
import {AsyncStorage, Image} from 'react-native';

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
} from 'native-base';

class LeaveBalance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nip: '',
      isLoading: true,
      data: {
        taken: 'Loading...',
        saldo: 'Loading...',
        total: 'Loading...',
      },
    };
  }

  componentDidMount() {
    AsyncStorage.getItem('nip').then((result) => {
      this.setState({nip: result});
    });
    if (
      null == store.getJenisCutiData() ||
      store.getJenisCutiData().toString() == ''
    ) {
      action.getJenisCuti('P93257');
    }
  }

  getBalanceDetail = (jns_cuti: ?String) => {
    const nip = 'P93257';
    const uri = `${REST_URL}/rest/?method=checksaldo&format=json&nip=${nip}&jns_cuti=${jns_cuti}`;
    fetch(uri, HEADERS_CONFIG)
      .then((response) => response.json())
      .then((res) => {
        const data = res.data;
        const dataSetter = {
          taken: data.jumlah_diambil,
          saldo: data.saldo_atasnya,
          total: data.total,
        };
        this.setState({isLoading: false, data: dataSetter});
      });
  };

  render() {
    let {data} = this.props;

    return (
      <Container>
        <HeaderLayout title="Saldo Cuti" navigation={this.props.navigation} />
        <Content>
          <Form>
            <Item>
              <Label style={styles.textInputLabel}>Tipe</Label>
              <Picker
                note
                mode="dropdown"
                style={{width: 120}}
                onValueChange={(value) => this.getBalanceDetail(value)}>
                {data.map((e, i) => (
                  <Picker.Item label={e.nama_cuti} value={e.id_cuti} key={i} />
                ))}
              </Picker>
            </Item>
            <ListItem itemDivider />
            <List>
              <ListItem>
                <Left>
                  <Image
                    source={require('assets/calendar.png')}
                    style={styles.imageInputLabel}
                  />
                  <Text>Hak Cuti</Text>
                </Left>
                <Right>
                  <Text>{this.state.data.saldo}</Text>
                </Right>
              </ListItem>
              <ListItem>
                <Left>
                  <Image
                    source={require('assets/calendar.png')}
                    style={styles.imageInputLabel}
                  />
                  <Text>Cuti terpakai</Text>
                </Left>
                <Right>
                  <Text>{this.state.data.taken}</Text>
                </Right>
              </ListItem>
              <ListItem>
                <Left>
                  <Image
                    source={require('assets/calendar.png')}
                    style={styles.imageInputLabel}
                  />
                  <Text>Sisa cuti</Text>
                </Left>
                <Right>
                  <Text>{this.state.data.saldo}</Text>
                </Right>
              </ListItem>
            </List>
          </Form>
        </Content>
      </Container>
    );
  }
}

function mapStateToProps() {
  return {
    data: store.getJenisCutiData(),
  };
}

export default connect(mapStateToProps)(LeaveBalance);
