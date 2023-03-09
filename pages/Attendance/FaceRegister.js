import React, {Component} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Platform,
  Dimensions,
  Alert,
  Text,
  ToastAndroid,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
// import {Text, Toast} from 'native-base';
import {REST_URL, HEADERS_CONFIG} from '../../AppConfig';
import {RNCamera} from 'react-native-camera';
import Spinner from 'react-native-loading-spinner-overlay';
import {store as UserStore} from '../../remx/User/store';

export default class FaceRegisterIOS extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nip: '',
      currentTrain: 1,
      showLoading: false,
      isCameraReady: false,
    };
  }

  componentDidMount() {
    if ('' != UserStore.getUserData()) {
      var userData = UserStore.getUserData();
      this.setState({
        nip: userData['employee_id'],
        id_employee: userData['id_employee'],
      });
    }

    AsyncStorage.getItem('totalTraining', (err, result) => {
      console.log('result');
      console.log(result);
      if (result) {
        if (parseInt(result) > 3) {
          Alert.alert('Info', 'Wajah Anda sudah didaftarkan!');
          this.props.navigation.goBack();
        } else {
          this.setState({currentTrain: parseInt(result)});
        }
      }
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Spinner
          visible={this.state.showLoading}
          overlayColor="rgba(0, 0, 0, 0.25)"
          size="large"
        />

        <RNCamera
          ref={(ref) => {
            this.camera = ref;
          }}
          type={RNCamera.Constants.Type.front}
          captureAudio={false}
          style={styles.preview}
          flashMode={RNCamera.Constants.FlashMode.off}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
        />

        <View style={styles.captureWrapper}>
          <TouchableOpacity
            onPress={this.takePicture.bind(this)}
            style={styles.capture}>
            <Text>Daftarkan</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  takePicture = async () => {
    if (this.camera) {
      const options = {
        quality: 0.1,
        base64: true,
        pauseAfterCapture: true,
        orientation: 'portrait',
        fixOrientation: true,
        width: 640,
        height: 640,
      };
      const data = await this.camera.takePictureAsync(options);
      this.doRegister(data);
    }
  };

  doUpload = (photo) => {
    // do get config data from remx
    var configData = UserStore.getConfigData();
    var urlFacerecognize = configData['facerecognize'];
    var urlKey = configData['key'];

    const uri =
      Platform.OS === 'android' ? photo.uri : photo.uri.replace('file://', '');
    let name = uri.split('/');
    name = name[name.length - 1];
    const contentType = 'image/jpeg';

    const formData = new FormData();
    formData.append('user_id', this.state.nip);
    formData.append('key', urlKey);
    formData.append('file', {
      name: name,
      type: contentType,
      uri: uri,
    });

    let url = `${urlFacerecognize}/api/v1/face_recognize/upload_only`;
    this.setState({showLoading: true});
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        ...HEADERS_CONFIG.headers,
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((responseJSON) => {
        this.setState({showLoading: false});

        setTimeout(() => {}, 200);

        console.log('resposne wajah');
        console.log(responseJSON);

        if (responseJSON.status == 'ok') {
          // Toast.show({
          //   text: `Wajah Anda telah didaftarkan ${this.state.currentTrain}x`,
          //   type: 'success',
          //   duration: 2000,
          // });
          this.setState({currentTrain: this.state.currentTrain + 1});
          this.camera.resumePreview();
          AsyncStorage.setItem(
            'totalTraining',
            this.state.currentTrain.toString(),
          );
          if (this.state.currentTrain >= 1) {
            setTimeout(() => {
              Alert.alert('Info', 'Wajah telah berhasil didaftarkan', [
                {text: 'OK', onPress: () => this.props.navigation.goBack()},
              ]);
            }, 100);
          }
        } else {
          // Toast.show({
          //   text: `Pendaftaran wajah gagal`,
          //   type: 'danger',
          //   duration: 2000,
          // });
          // Alert.alert('Error', 'Pendaftaran Wajah gagal')
          this.camera.resumePreview();
        }
      })
      .catch((err) => console.error(err));
  };

  doRegister(photo) {
    // do get config data from remx
    var configData = UserStore.getConfigData();
    var urlFacerecognize = configData['facerecognize'];
    var urlKey = configData['key'];

    let urlCheck = `${urlFacerecognize}/api/v1/face_recognize/is_upload`;

    console.log('fr url');
    console.log(urlCheck);

    const formDataCheck = new FormData();
    formDataCheck.append('user_id', this.state.nip);
    formDataCheck.append('key', urlKey);

    fetch(urlCheck, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        ...HEADERS_CONFIG.headers,
      },
      body: formDataCheck,
    })
      .then((response) => response.json())
      .then((responseJSON) => {
        // console.log(responseJSON);
        if (responseJSON.total < 1) {
          this.doUpload(photo);
        } else {
          Alert.alert('Info', 'Pendaftaran Wajah telah terpenuhi ');
          this.props.navigation.goBack();
        }
      });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'flex-end',
  },
  capture: {
    // flex: 1,
    backgroundColor: '#fff',
    borderRadius: 100,
    padding: 15,
    paddingLeft: 30,
    paddingRight: 30,
    paddingHorizontal: 15,
    alignSelf: 'center',
  },
  captureWrapper: {
    flex: 0,
    alignSelf: 'center',
    position: 'absolute',
    marginTop: (85 * Dimensions.get('window').height) / 100,
  },
});
