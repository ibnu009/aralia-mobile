import React, {Component} from 'react';
import Pdf from 'react-native-pdf';
import HeaderLayout from '../HeaderLayout';
import {decode as atob, encode} from 'base-64';
import {View, StyleSheet, Dimensions} from 'react-native';
import {Container} from 'native-base';
import {HEADERS_CONFIG} from '../../AppConfig';
import {Button, Text, Icon} from 'native-base';

export default class ViewPaySlip extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.doBack.bind(this);
  }

  doBack() {
    this.props.navigation.navigate('PaySlipList');
  }

  render() {
    const source = {
      uri: this.props.route.params.url,
      cache: false,
      headers: HEADERS_CONFIG.headers,
    };
    const passwd = atob(
      atob(this.props.route.params.password).split('').reverse().join(''),
    );
    return (
      <Container>
        <HeaderLayout navigation={this.props.navigation} />
        <View style={styles.container}>
          <Pdf password={passwd} source={source} style={styles.pdf} />
          <Button
            success
            block
            style={styles.buttonPrimay /* {backgroundColor: '#0966B9'} */}
            onPress={() => this.doBack()}>
            <Icon active name="left" type="AntDesign" />
            <Text>Kembali</Text>
          </Button>
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    // marginTop: 25,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
  },
});
