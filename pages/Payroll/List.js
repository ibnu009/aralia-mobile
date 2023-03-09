import React, {Component} from 'react';
import HeaderLayout from '../HeaderLayout';
import {connect} from 'remx';
import styles from '../../styles';
import {store as UserStore} from '../../remx/User/store';
import {REST_URL, HEADERS_CONFIG, MONTH_ITEMS_OPTION} from '../../AppConfig';
import {Dimensions, TouchableOpacity, View} from 'react-native';
import {
  Container,
  Item,
  Picker,
  Button,
  Text,
  ListItem,
  List,
  Icon,
  Body,
  Right,
  Toast,
} from 'native-base';
import Spinner from 'react-native-loading-spinner-overlay';
import {FlatList} from 'react-native-gesture-handler';

class PaySlip extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = {
      isLoading: false,
      selectedYear: '',
      data: [],
    };
  }

  submitButton = () => {
    const uri = `${REST_URL}/payroll/slip_gaji.php`;
    this.setState({isLoading: true, data: []});
    fetch(uri, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        ...HEADERS_CONFIG.headers,
      },
      body: `n=${this.props.user.nip}&y=${this.state.selectedYear}`,
    })
      .then((response) => response.json())
      .then((responseJSON) => {
        if (responseJSON.data != 'Empty') {
          this.setState({data: responseJSON.data, isLoading: false});
        } else {
          this.setState({isLoading: false});
        }
      })
      .catch((err) => {
        this.setState({isLoading: false});
        Toast.show({
          text: `Error: ${err}`,
          type: 'danger',
        });
      });
  };

  yearOptionItems = () => {
    var arr = [`Semua Periode`];
    let a = new Date().getFullYear();
    for (let i = a; i > a - 5; i--) {
      arr.push(`${i}`);
    }
    return arr;
  };

  generateList = (items) => {
    let data = items.item;

    return (
      <ListItem>
        <TouchableOpacity
          style={{flexDirection: 'row'}}
          onPress={() => this.props.navigation.push('PaySlipView', data)}>
          <Body>
            {/* <Text>{atob(atob(e.password).split("").reverse().join(""))}</Text> */}
            <Text>
              {MONTH_ITEMS_OPTION[data.periode.substr(4, 2) - 1] +
                ' ' +
                data.periode.substr(0, 4)}
            </Text>
          </Body>
          <Right>
            <Icon name="ios-arrow-forward" />
          </Right>
        </TouchableOpacity>
      </ListItem>
    );
  };

  render() {
    return (
      <Container>
        <HeaderLayout title="Slip Gaji" navigation={this.props.navigation} />
        <View>
          <Spinner
            visible={this.state.isLoading}
            color={styles.statusbarAccent.backgroundColor}
            size="large"
          />

          <Item last>
            <Picker
              note
              mode="dropdown"
              placeholder="Year"
              selectedValue={this.state.selectedYear}
              onValueChange={(val) => this.setState({selectedYear: val})}
              style={{width: Dimensions.get('screen').width * 0.8}}>
              {this.yearOptionItems().map((label, i) => (
                <Picker.Item label={label} value={label} key={i} />
              ))}
            </Picker>

            <Button
              style={[
                styles.buttonPrimay,
                {
                  height: '100%',
                  borderRadius: 0,
                  width: Dimensions.get('screen').width * 0.2,
                },
              ]}
              onPress={this.submitButton}>
              <Text>Lihat</Text>
            </Button>
          </Item>
          <ListItem itemDivider />

          <FlatList
            data={this.state.data}
            renderItem={(item) => this.generateList(item)}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            initialNumToRender={5}
          />
          {/* <List>
          </List> */}
        </View>
      </Container>
    );
  }
}

function mapStateToProps() {
  return {
    user: UserStore.getUserData(),
  };
}

export default connect(mapStateToProps)(PaySlip);
