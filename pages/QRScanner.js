// source https://github.com/moaazsidat/react-native-qrcode-scanner
import React, {Component} from 'react';
import Spinner from 'react-native-loading-spinner-overlay';
import style from '../styles';
import {encode} from 'base-64';

import {StyleSheet, Text, TouchableOpacity, Alert} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {Container} from 'native-base';

export default class QRScanner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spinner: false,
      nip: '',
    };
  }

  componentDidMount() {
    AsyncStorage.getItem('nip', (err, result) => {
      if (result) this.setState({nip: result});
    });
  }

  onSuccess = (e) => {
    this.setState({spinner: true});
    const uri = e.data + `&nip=${this.state.nip}`;
    fetch(e.data, {
      headers: {
        Authorization: `Basic ${encode('larisa:pgd')}`,
      },
    })
      .then((response) => response.json())
      .then((responseJSON) => {
        // const data = responseJSON.data
        Alert.alert('Absensi berhasil');
        this.props.navigation.navigate('Home');
      });
    setTimeout(() => {
      // this.setState({ spinner: false })
      this.props.navigation.navigate('Home');
    }, 5000);
  };

  render() {
    return (
      <Container>
        <Spinner
          visible={this.state.spinner}
          color={style.statusbarAccent.backgroundColor}
          overlayColor="white"
          size="large"
        />

        {!this.state.spinner && (
          <QRCodeScanner
            onRead={this.onSuccess}
            topContent={
              <Text style={styles.centerText}>
                Arahkan Kode QR yang ada untuk melakukan Absensi
              </Text>
            }
            bottomContent={
              <TouchableOpacity style={styles.buttonTouchable}>
                <Text style={styles.buttonText}>OK, mengerti!</Text>
              </TouchableOpacity>
            }
          />
        )}
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777',
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },
  buttonTouchable: {
    padding: 16,
    marginTop: 50,
  },
});
