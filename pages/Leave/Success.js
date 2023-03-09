import {
  View,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

import {styles} from './Style';


import React from 'react';


const ButtonMenu = (props) => {
  return (
    <View>
      <Text style={{
                  width: '100%',
                  backgroundColor: 'green',
                  padding: 10,
                  color: 'white',
                  borderRadius: 5,
                  textAlign: 'center',
                  marginBottom: 16,
                  marginTop: 16
                }}>{props.name}</Text>
    </View>
  );
};

const Success = ({navigation}) => {
  return (
    <View style={{flex: 1, flexDirection: 'column'}}>
      <ImageBackground
        source={require('assets/bg-login.png')}
        style={{
          width: Dimensions.get('screen').width,
          height: Dimensions.get('screen').height,
        }}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'white',
            marginHorizontal: 20,
            marginVertical: 20,
            marginTop: 200,
            borderRadius: 20,
          }}>
          <Text style={{marginBottom: 20, fontSize: 18, fontWeight: 'bold'}}>
            Pengajuan Cuti
          </Text>

          <Image source={require('assets/success.png')} style={styles.logo} />

          <Text style={{fontSize: 24, color: 'black'}}>Berhasil mengajukan cuti</Text>

          <TouchableOpacity
          onPress={() => navigation.navigate('Leave')}
          style={{width: '85%'}}>
          <ButtonMenu name='Kembali' />
        </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

export default Success;
