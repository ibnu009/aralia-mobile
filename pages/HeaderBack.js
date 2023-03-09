import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import packageJson from '../package.json';
import {useNavigation} from '@react-navigation/native';

const HeaderBack = (props) => {
  const navigation = useNavigation();
  return (
    <View style={styles.navBar}>
      <FontAwesome
        name="angle-left"
        size={28}
        color="#fff"
        style={{marginLeft: 10}}
        onPress={() => navigation.goBack()}
      />
      <Text
        style={[
          styles.HText,
          {
            fontSize: 22,
          },
        ]}>
        {props.title}
      </Text>
      <Text
        style={[
          styles.HText,
          {
            alignSelf: 'flex-start',
          },
        ]}>
        Ver {packageJson.version}
      </Text>
    </View>
  );
};

export default HeaderBack;

const styles = StyleSheet.create({
  navBar: {
    width: '100%',
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  HText: {
    color: 'white',
    fontSize: 8,
  },
});
