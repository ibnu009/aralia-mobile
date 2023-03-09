import React, {Component} from 'react';
import HeaderLayout from '../HeaderLayout';
import style from '../../styles';
import {store} from '../../remx/Service/store';
import {connect} from 'remx';
import {store as UserStore} from '../../remx/User/store';
import ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import {REST_URL, HEADERS_CONFIG} from '../../AppConfig';
import {Alert, TouchableOpacity} from 'react-native';

import {
  Container,
  Content,
  Form,
  Picker,
  Item,
  Input,
  Label,
  ListItem,
  DatePicker,
  Textarea,
  Button,
  Text,
  Footer,
  Right,
  Icon,
  FooterTab,
  View,
  Left,
  List,
  Thumbnail,
} from 'native-base';

class ResponsibilityDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...this.props.route.params,
      isLoading: false,
      fileCount: 0,
      file: [],
    };
  }

  componentDidMount() {
    fetch(`${REST_URL}/sppd/respons.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        ...HEADERS_CONFIG.headers,
      },
      body: `act=getFile&nip=${
        this.props.User.nip
      }&id=${this.props.navigation.getParam(
        'id',
      )}&no_surat=${this.props.navigation.getParam('no_surat')}`,
    })
      .then((response) => response.json())
      .then((responseJson) => {
        responseJson.data.map((data, i) => {
          const source = {
            fileName: data.fileName,
            fileSize: data.fileSize,
            type: data.type,
            uri: data.uri,
          };

          this.state.file.push(source);
          this.setState({fileCount: this.state.fileCount + 1});
        });
      });
  }

  componentWillUnmount() {
    store.setSelectedPeg({});
    store.setSelectedCity({}, true);
  }

  submitForm = () => {
    const uri = `${REST_URL}/sppd/respons.php`;

    const formData = new FormData();
    formData.append('act', 'tambahin');
    formData.append('id', this.props.navigation.getParam('id'));
    formData.append('no_surat', this.props.navigation.getParam('no_surat'));
    formData.append('nip', this.props.User.nip);
    this.state.file.map((data, i) =>
      formData.append('image_' + i, {
        uri: data.uri,
        type: data.type,
        name: data.fileName,
      }),
    );
    formData.append('Content-Type', this.state.file[0].type);
    // console.log(formData)

    fetch(uri, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        ...HEADERS_CONFIG.headers,
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((responseJson) => {
        // console.log(responseJson)
        Alert.alert('Info', responseJson.response, [{text: 'OK'}]);
        this.props.navigation.navigate('Home');
      });
  };

  showPicker = () => {
    const options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.launchImageLibrary(options, (response) => {
      if (parseFloat(response.fileSize / 1000).toFixed(2) > 1000) {
        Alert.alert('Warning', `Ukuran file tidak boleh lebih besar dari 1mb`, [
          {text: 'Close'},
          {text: 'Resize', onPress: () => this.resize(response)},
        ]);
      } else if (!response.didCancel && !response.error) {
        const source = {
          fileName: response.fileName,
          fileSize: response.fileSize,
          type: response.type,
          uri: response.uri,
        };

        this.state.file.push(source);
        this.setState({fileCount: this.state.fileCount + 1});
      }
    });
  };

  resize = (data) => {
    const fType =
      String(data.type).split('/')[1] == 'jpg'
        ? 'JPEG'
        : String(data.type).split('/')[1].toUpperCase();
    const fRotate = 0;

    ImageResizer.createResizedImage(
      data.uri,
      data.width * 0.5,
      data.height * 0.5,
      fType,
      80,
      fRotate,
    ).then((result) => {
      if (parseFloat(result.size / 1000).toFixed(2) > 1000) {
        data.fileName = result.name;
        data.fileSize = result.size;
        data.uri = result.uri;
        this.resize(data);
      } else {
        const source = {
          fileName: result.name,
          fileSize: result.size,
          type: data.type,
          uri: result.uri,
        };

        this.state.file.push(source);
        this.setState({fileCount: this.state.fileCount + 1});
      }
    });
  };

  camPicker = () => {
    const options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.launchCamera(options, (response) => {
      if (parseFloat(response.fileSize / 1000).toFixed(2) > 1000) {
        this.resize(response);
      } else if (!response.didCancel && !response.error) {
        const source = {
          fileName: response.fileName,
          fileSize: response.fileSize,
          type: response.type,
          uri: response.uri,
        };

        this.state.file.push(source);
        this.setState({fileCount: this.state.fileCount + 1});
      }
    });
  };

  removeFile = (index) => {
    this.state.file.splice(index, 1);
    this.setState({fileCount: this.state.fileCount - 1});
  };

  render() {
    const {navigate} = this.props.navigation;

    return (
      <Container>
        <HeaderLayout
          title="Pertanggungjawaban SPPD"
          navigation={this.props.navigation}
        />
        <Content>
          <Form>
            <Item style={{height: 50}}>
              <View style={{flexDirection: 'column', flex: 1}}>
                <Label>Nomor Surat</Label>
              </View>
              <View style={{flexDirection: 'column', flex: 1}}>
                <Text>{this.state.no_surat}</Text>
              </View>
            </Item>

            <Item style={{height: 50}}>
              <View style={{flexDirection: 'column', flex: 1}}>
                <Text>Unggah Berkas</Text>
              </View>
              <View style={{flexDirection: 'column', flex: 1}}>
                <Text>Maks. 1Mb</Text>
              </View>
            </Item>

            <Item>
              <TouchableOpacity
                style={{
                  width: '47.5%',
                  marginRight: 10,
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  marginTop: 5,
                  marginBottom: 5,
                  padding: 5,
                  borderRadius: 5,
                  backgroundColor: '#0daa43',
                }}
                onPress={() => this.showPicker()}>
                <Icon name="folder" />
                <Text style={{marginLeft: 10, color: '#fff'}}>
                  Pilih Berkas
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  width: '47.5%',
                  marginRight: 10,
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  marginTop: 5,
                  marginBottom: 5,
                  padding: 5,
                  borderRadius: 5,
                  backgroundColor: '#0daa43',
                }}
                onPress={() => this.camPicker()}>
                <Icon name="camera" />
                <Text style={{marginLeft: 10, color: '#fff'}}>Foto Berkas</Text>
              </TouchableOpacity>
            </Item>

            <Item>
              <List>
                {this.state.file.map((data, i) => (
                  <ListItem noBorder thumbnail style={{height: 60}} key={i}>
                    <Left style={{width: '80%'}}>
                      <Thumbnail
                        style={{marginTop: 5, marginBottom: 5, marginRight: 5}}
                        square
                        source={
                          data.type == 'application/pdf'
                            ? require('assets/file.png')
                            : data.uri == ''
                            ? require('assets/file.png')
                            : {uri: data.uri}
                        }
                      />
                      <Text style={{flex: 1, flexWrap: 'wrap'}}>
                        {data.fileName}
                      </Text>
                    </Left>
                    <Right>
                      <Button
                        danger
                        rounded
                        onPress={() => {
                          this.removeFile(i);
                        }}>
                        <Icon name="close" />
                      </Button>
                    </Right>
                  </ListItem>
                ))}
              </List>
            </Item>
          </Form>
        </Content>

        <Footer>
          <FooterTab>
            <Button full style={style.buttonPrimay} onPress={this.submitForm}>
              <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 15}}>
                Submit
              </Text>
            </Button>
          </FooterTab>
        </Footer>

        {this.state.isLoading && (
          <ActivityIndicator
            size="large"
            style={styles.loading}
            color={styles.loading.color}
          />
        )}
      </Container>
    );
  }
}

function mapStateToProps(ownProps) {
  return {
    fileData: null,
    User: UserStore.getUserData(),
  };
}

export default connect(mapStateToProps)(ResponsibilityDetail);
