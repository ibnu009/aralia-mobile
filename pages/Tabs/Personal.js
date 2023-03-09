import React, {useEffect} from 'react';
import {connect} from 'remx';
import HeaderLayout from '../HeaderLayout';
import {store} from '../../remx/Service/store';
import * as UserAction from '../../remx/User/actions';
import {store as UserStore} from '../../remx/User/store';
import styles from '../../styles';
// import {
//   Container,
//   Content,
//   Text,
//   Card,
//   ListItem,
//   List,
//   Item,
//   Label,
//   View,
//   Icon,
//   Left,
// } from 'native-base';

import {
  View,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import HeaderLogo from '../HeaderLogo';

const Personal = ({navigation}) => {
  const {
    no_ktp,
    email,
    phone,
    jabatan,
    employee_id,
    employee_name,
    nm_kantor,
    foto,
    url_foto,
  } = UserStore.getUserData();

  useEffect(() => {
    setTimeout(() => {
      var userData = UserStore.getUserData();
    }, 5000);
  });

  // constructor(props) {
  //   super(props);
  //   this.state = {};
  // }

  // componentDidMount() {
  //   UserAction.checkSession();
  // }

  // header = () => {
  //   if (this.props.route) {
  //     return (
  //       <HeaderLayout title="Info Pegawai" navigation={this.props.navigation} />
  //     );
  //   }
  // };

  // const doEdit = () => {
  //   navigation.navigate('ChangeProfile');
  // };

  // let {user} = this.props;
  // if (this.props.route) user = this.props.route.params.data;
  console.log('url foto');
  console.log(url_foto);

  return (
    <View>
      {/* {this.header()} */}
      <HeaderLogo />

      <View bouncesZoom={true} showsVerticalScrollIndicator={false}>
        <ImageBackground
          source={require('assets/bg-login.png')}
          style={[styles.wallImageWrapper, {width: '100%', height: 100}]}
        />

        <View transparent style={{alignItems: 'center', bottom: 50}}>
          <Image
            source={
              foto ? {uri: url_foto} : require('assets/default.png')
              // require('../../assets/tab/personal.png')
            }
            style={[
              styles.displayPicture,
              {width: 100, height: 100, borderRadius: 50},
            ]}
          />
          <Text
            style={[
              styles.userBoxName,
              styles.buttonSuccess,
              {textAlign: 'center'},
            ]}>
            {employee_name ?? 'Loading...'}
          </Text>
          <Text
            style={{
              color: '#000',
              top: 15,
              fontSize: 14,
              fontWeight: 'bold',
              textAlign: 'center',
              paddingBottom: 30,
            }}>
            {employee_id ?? 'Loading...'}
          </Text>

          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <TouchableOpacity
              onPress={() => navigation.navigate('ChangeProfile')}>
              <Image
                source={require('../../assets/edit.png')}
                style={styles.imageInputLabel}
              />
            </TouchableOpacity>
          </View>
          {/* <Text note style={{color: '#000', top:15, fontSize:14, fontWeight: '100', textAlign:'center'}}>{user.jabatan} {(user.jns_kantor && user.jns_kantor.trim() == '1')?user.nm_unit_es3:user.nm_kantor} {user.nm_pangkat}</Text> */}
        </View>

        <View>
          <View style={{flexDirection: 'column', padding: 10}}>
            <View transparent style={{width: '100%', flexDirection: 'row'}}>
              <Image
                source={require('../../assets/user.png')}
                style={styles.imageInputLabel}
              />
              <Text
                style={[
                  styles.textInputLabel,
                  {width: '100%', fontWeight: 'bold', fontSize: 13},
                ]}>
                No.Ktp
              </Text>
            </View>
            <Text
              style={{width: '100%', left: 25, fontSize: 13, color: '#000'}}>
              {no_ktp ?? '-'}
            </Text>
          </View>
          <View style={{flexDirection: 'column', padding: 10}}>
            <View transparent style={{width: '100%', flexDirection: 'row'}}>
              <Image
                source={require('../../assets/email.png')}
                style={styles.imageInputLabel}
              />
              <Text
                style={[
                  styles.textInputLabel,
                  {width: '100%', fontWeight: 'bold', fontSize: 13},
                ]}>
                Email
              </Text>
            </View>
            <Text
              style={{width: '100%', left: 25, fontSize: 13, color: '#000'}}>
              {email ?? '-'}
            </Text>
          </View>
          <View style={{flexDirection: 'column', padding: 10}}>
            <View transparent style={{width: '100%', flexDirection: 'row'}}>
              <Image
                source={require('../../assets/phone.png')}
                style={styles.imageInputLabel}
              />
              <Text
                style={[
                  styles.textInputLabel,
                  {width: '100%', fontWeight: 'bold', fontSize: 13},
                ]}>
                Phone
              </Text>
            </View>
            <Text
              style={{width: '100%', left: 25, fontSize: 13, color: '#000'}}>
              {phone ?? '-'}
            </Text>
          </View>
          <View style={{flexDirection: 'column', padding: 10}}>
            <View transparent style={{width: '100%', flexDirection: 'row'}}>
              <Image
                source={require('../../assets/department.png')}
                style={styles.imageInputLabel}
              />
              <Text
                style={[
                  styles.textInputLabel,
                  {width: '100%', fontWeight: 'bold', fontSize: 13},
                ]}>
                Jabatan
              </Text>
            </View>
            <Text
              style={{width: '100%', left: 25, fontSize: 13, color: '#000'}}>
              {jabatan ?? '-'}
            </Text>
          </View>
          <View style={{flexDirection: 'column', padding: 10}}>
            <View transparent style={{width: '100%', flexDirection: 'row'}}>
              <Image
                source={require('../../assets/office-block.png')}
                style={styles.imageInputLabel}
              />
              <Text
                style={[
                  styles.textInputLabel,
                  {width: '100%', fontWeight: 'bold', fontSize: 13},
                ]}>
                Kantor
              </Text>
            </View>
            <Text
              style={{width: '100%', left: 25, fontSize: 13, color: '#000'}}>
              {nm_kantor ?? '-'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  btnLogout: {
    flexDirection: 'row',
    height: 40,
    alignItems: 'center',
  },
});

function mapStateToProps() {
  return {
    user: UserStore.getUserData(),
  };
}

export default connect(mapStateToProps)(Personal);
