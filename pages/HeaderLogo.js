import {StyleSheet, Image, Text, View, Dimensions} from 'react-native';
import React from 'react';

const HeaderLogo = () => {
  return (
    <View style={styles.statusBar}>
      <Image
        source={require('assets/logo.png')}
        style={styles.statusBarImage}
      />
    </View>
  );
};

export default HeaderLogo;

const {width, height} = Dimensions.get('screen');
const styles = StyleSheet.create({
  statusBar: {
    width: '100%',
    // heigh: ,
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
    padding: 5,
  },
  statusBarImage: {
    resizeMode: 'stretch',
    width: Dimensions.get('screen').width * 0.2,
    height: Dimensions.get('screen').height * 0.05,
  },
});
