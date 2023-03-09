import React, {useState, useEffect} from 'react';
import {store as UserStore} from '../remx/User/store';
import {connect} from 'remx';
import HeaderBack from '../pages/HeaderBack';
import {REST_URL, HEADERS_CONFIG} from '../AppConfig';
import * as UserAction from '../remx/User/actions';
import * as ImagePicker from 'react-native-image-picker';
import styles from '../styles';
const RNFS = require('react-native-fs');

// import {
//   Container,
//   Content,
//   Text,
//   Item,
//   Label,
//   Form,
//   Input,
//   Footer,
//   FooterTab,
//   Button,
// } from 'native-base';

import {
  View,
  StyleSheet,
  TouchableHighlight,
  Image,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  Text,
  TextInput,
  ScrollView,
} from 'react-native';

import Spinner from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-simple-toast';
import {getPhoneNumber} from 'react-native-device-info';
// import {TouchableOpacity} from 'react-native-gesture-handler';

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

const ChangeProfile = ({navigation}) => {
  const {
    employee_id,
    no_ktp,
    email,
    phone,
    jabatan,
    employee_name,
    nm_kantor,
    foto,
    url_foto,
  } = UserStore.getUserData();

  const [Form, setForm] = useState({
    no_ktp: '',
    employee_id: '',
    email: '',
    phone: '',
    filePath: '',
    fileData: '',
    fileUri: '',
    url_foto: '',
    isLoading: true,
    showLoading: false,
  });

  function handleChange(labels, value) {
    setForm({
      ...Form,
      [labels]: value,
    });
  }

  useEffect(() => {
    handleChange('employee_id', employee_id);
    handleChange('no_ktp', no_ktp);
    handleChange('email', email);
    handleChange('phone', phone);
    handleChange('fileUri', url_foto);
  }, []);

  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     no_ktp: '',
  //     email: '',
  //     phone: '',
  //     filePath: '',
  //     fileData: '',
  //     fileUri: '',
  //     isLoading: true,
  //     showLoading: false,
  //   };
  // }

  // componentDidMount() {
  //   let data = Personalroute.params.data;
  //   this.setState({
  //     no_ktp: data.no_ktp,
  //     email: data.email,
  //     phone: data.phone,
  //     id_employee: data.id_employee,
  //     url_foto: data.url_foto,
  //   });
  //   console.log(`${RNFS.PicturesDirectoryPath}`);
  // }

  const submitForm = () => {
    var photo = {
      uri: Form.filePath.uri,
      type: Form.filePath.type,
      name: Form.filePath.fileName,
    };

    console.log(JSON.stringify(photo));

    var form = new FormData();

    form.append('no_ktp', Form.no_ktp);
    form.append('email', Form.email);
    form.append('phone', Form.phone);
    // console.log('Employee id: ', employee_id);

    if (Form.filePath != '') {
      form.append('image', photo);
    }

    form.append('id_employee', employee_id);

    let uri = `${REST_URL}/profile/update`;
    setForm({showLoading: true});

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
        setForm({showLoading: false});
        Alert.alert(
          'Info',
          //'Reset password user berhasil. \nSilahkan periksa pesan masuk pada email anda, atau periksa pada kolom spam.',
          res.message,
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(null),
            },
          ],
          {cancelable: false},
        );

        // update state profile
        // UserAction.getUserDetail(Form.id_employee);
      })
      .catch((err) => {
        setForm({showLoading: false});
        Toast.show(`Error : ${err}`, Toast.SHORT);
        navigation.goBack(null);
      });
  };

  const launchCamera = () => {
    let options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      width: 400,
      height: 200,
      quality: 0.5,
    };
    ImagePicker.launchCamera(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        setForm({
          filePath: response,
          fileData: response.data,
          fileUri: response.uri,
        });
      }
    });
  };

  const lauchImageGallery = () => {
    let options = {
      storageOptions: {
        skipBackup: true,
        path: `images`,
      },
      width: 400,
      height: 200,
      // quality: 0.5,
    };
    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        setForm({
          filePath: response,
          fileData: response.data,
          fileUri: response.uri,
        });
      }
    });
  };

  const btnSave = () => {
    submitForm();
  };

  return (
    <>
      <HeaderBack title="Ubah Profile" />

      <Spinner
        visible={Form.showLoading}
        color={styles.statusbarAccent.backgroundColor}
        size="large"
      />

      <ScrollView>
        <View style={{flex: 1, padding: 10}}>
          <TextInput
            placeholder="No.Ktp"
            style={styles.textInputLabel}
            defaultValue={no_ktp}
            onChangeText={(val) => handleChange('no_ktp', val)}></TextInput>
          <View
            style={{
              borderBottomColor: 'black',
              borderBottomWidth: StyleSheet.hairlineWidth,
            }}
          />
          <TextInput
            placeholder="Email"
            style={styles.textInputLabel}
            defaultValue={email}
            onChangeText={(val) => handleChange('email', val)}></TextInput>
          <View
            style={{
              borderBottomColor: 'black',
              borderBottomWidth: StyleSheet.hairlineWidth,
            }}
          />
          <View
            style={{
              borderBottomColor: 'black',
              borderBottomWidth: StyleSheet.hairlineWidth,
            }}
          />
          <TextInput
            placeholder="Phone"
            style={styles.textInputLabel}
            defaultValue={phone}
            onChangeText={(val) => handleChange('phone', val)}></TextInput>
          <View
            style={{
              borderBottomColor: 'black',
              borderBottomWidth: StyleSheet.hairlineWidth,
              marginBottom: 10,
            }}
          />
        </View>

        <View
          style={{
            flex: 2,
            alignItems: 'center',
          }}>
          <Text style={{alignSelf: 'flex-start', marginLeft: 15}}>
            Foto Pengguna
          </Text>
          <Image
            style={{
              width: 50,
              height: 50,
            }}
            source={
              Form.fileUri
                ? {
                    uri: Form.fileUri,
                  }
                : require('assets/default.png')
            }
          />
          <View style={{flexDirection: 'row', flexWrap: 'wrap', marginTop: 20}}>
            <TouchableOpacity
              onPress={() => lauchImageGallery()}
              style={{
                marginRight: 10,
                backgroundColor: '#0d8a43',
                borderRadius: 50,
                padding: 15,
              }}>
              <Text style={{color: 'white'}}>Pilih Galeri</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => launchCamera()}
              style={{
                backgroundColor: '#0d8a43',
                borderRadius: 50,
                padding: 15,
              }}>
              <Text style={{color: 'white'}}>Pakai Kamera</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* <View>
            <View>
              <Text>No. KTP</Text>
              <TextInput
                value={this.state.no_ktp}
                onChangeText={(val) => this.setState({no_ktp: val})}
              />
            </View>
            <View>
              <Text>E-mail</Text>
              <TextInput
                value={this.state.email}
                onChangeText={(val) => this.setState({email: val})}
              />
            </View>
            <View>
              <Text>Phone</Text>
              <TextInput
                value={this.state.phone}
                onChangeText={(val) => this.setState({phone: val})}
              />
            </View>
            <View>
              <Text>Foto Pengguna</Text>
              <Image
                source={
                  this.state.url_foto
                    ? {
                        uri: this.state.fileUri
                          ? this.state.fileUri
                          : this.state.url_foto,
                      }
                    : require('assets/default.png')
                }
                style={{
                  marginTop: 20,
                  borderRadius: 10,
                  width: 100,
                  height: 100,
                }}
              />
              <View style={stylesButton.itemButtonContainer}>
                <TouchableHighlight
                  underlayColor="#ccc"
                  onPress={this.lauchImageGallery}
                  style={[stylesButton.itemCreateButton, {marginRight: 10}]}>
                  <View
                    style={{
                      flexWrap: 'wrap',
                      alignItems: 'flex-start',
                      flexDirection: 'row',
                    }}>
                    <Text style={stylesButton.itemButtonText}>
                      Pilih Galeri
                    </Text>
                  </View>
                </TouchableHighlight>

                <TouchableHighlight
                  underlayColor="#ccc"
                  onPress={this.launchCamera}
                  style={stylesButton.itemCreateButton}>
                  <View
                    style={{
                      flexWrap: 'wrap',
                      alignItems: 'flex-start',
                      flexDirection: 'row',
                    }}>
                    <Text style={stylesButton.itemButtonText}>
                      Pakai Kamera
                    </Text>
                  </View>
                </TouchableHighlight>
              </View>
            </View>
          </View> */}
      </ScrollView>
      <View
        style={{
          marginHorizontal: 10,
          marginBottom: 20,
          backgroundColor: 'transparent',
        }}>
        <View style={{backgroundColor: 'transparent'}}>
          <TouchableOpacity
            full
            style={{
              backgroundColor: '#0d8a43',
              borderRadius: 50,
              padding: 15,
            }}
            onPress={() => btnSave()}>
            <Text
              style={{
                color: '#fff',
                fontWeight: 'bold',
                fontSize: 15,
                textAlign: 'center',
              }}>
              Submit
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

function mapStateToProps() {
  return {
    user: UserStore.getUserData(),
  };
}

export default connect(mapStateToProps)(ChangeProfile);
