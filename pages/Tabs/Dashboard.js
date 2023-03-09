// @flow

import React, {Component, useEffect} from 'react';
import {TouchableHighlight, Linking, Alert} from 'react-native';
import styles from '../../styles';
import {connect} from 'remx';
import * as action from '../../remx/Service/actions';
import {store as UserStore} from '../../remx/User/store';
import * as UserAction from '../../remx/User/actions';
import {store as ServiceStore} from '../../remx/Service/store';
import Carousel, {PaginationLight} from 'react-native-x-carousel';
import {
  Container,
  Content,
  CardItem,
  Body,
  Text,
  View,
  Badge,
  Toast,
  Footer,
} from 'native-base';

import {
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';

import {REST_URL} from '../../AppConfig';

const {width, height} = Dimensions.get('screen');

const checkFcmToken = async () => {
  const fcmToken = await messaging().getToken();
  if (fcmToken){
    console.log('FCM token adalah');
    console.log(fcmToken);
  }
}
class TabDashboard extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      isBanner: true,
    };
    this.openLink.bind(this);
  }



  componentDidMount() {
    // UserAction.checkSession();
    // do get config data from remx
    var userData = UserStore.getUserData();
    this.setState({
      isBanner: userData['is_banner'] == '1' ? true : false,
      nip: userData['employee_id'],
    });
    // action.getJenisTugas();
    action.getFeatureData();
    action.getImageBanner();
    // console.log(this.props.imageBanner);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.user != UserStore.getUserData()) {
      this.setState({refreshing: false});
    }
  }

  doRefresh = () => {
    this.setState({refreshing: false});
    var userData = UserStore.getUserData();
    console.log(userData);

    /* Refresh MyRequest List */
    // action.getMyRequest(this.props.user.nip);
    // action.getTodoList(this.props.user.nip);
  };

  openLink(url) {
    if (url != null) {
      var new_url = url.trim();
      if (new_url != '') {
        Linking.openURL(url).catch((err) =>
          console.error("Couldn't load page", err),
        );
      } else {
        Alert.alert('Info', `Link tidak tersedia`, [{text: 'Close'}]);
      }
    }
  }

  renderBanner = (image, index) => {
    return (
      <View key={index}>
        <TouchableHighlight onPress={() => this.openLink(image.go_to)}>
          <Image style={style.newsBanner} source={{uri: image.url}} />
        </TouchableHighlight>
      </View>
    );
  };

  featureCheck = (target: String) => {
    // let {featureData} = this.props;
    // if (featureData[target] == 'true') {
    switch (target) {
      case 'Leave':
        target = 'LeaveRequest';
        break;
      case 'Claim':
        target = 'ClaimRequest';
        break;
      case 'PaySlip':
        target = 'PaySlipList';
        break;
      default:
        break;
    }

    this.props.navigation.push(target);
    // } else {
    //   Toast.show({
    //     text: `Fitur Belum dapat digunakan`,
    //     position: 'bottom',
    //     type: 'warning',
    //   });
    // }
  };

  render() {
    let {user, todoList} = this.props;
    var bg = require('assets/bg-login.png');
    return (
      <Container>
        <Content
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.doRefresh}
              title="Loading..."
            />
          }
          showsVerticalScrollIndicator={false}
          bouncesZoom={true}>
          <ImageBackground
            source={require('assets/bg-login.png')}
            style={[{width: width}, styles.wallImageWrapper]}>
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: height * 0.1,
              }}>
              <View
                style={{
                  alignContent: 'center',
                  flexDirection: 'column',
                  height: 50,
                }}>
                <Image
                  source={
                    user.url_foto
                      ? {uri: user.url_foto}
                      : require('assets/default.png')
                  }
                  style={styles.displayPicture}
                />
              </View>
              <View
                style={{
                  flexDirection: 'column',
                  alignContent: 'center',
                  marginTop: 50,
                }}>
                <Text style={styles.userBoxName}>
                  {user.employee_name ?? 'Loading...'}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'column',
                  alignContent: 'center',
                }}>
                <Text
                  note
                  style={{
                    color: '#fff',
                    top: 15,
                    fontSize: 14,
                    fontWeight: '100',
                  }}>
                  {user.employee_id ?? 'Loading...'}
                </Text>
              </View>
              <View
                style={{
                  borderRadius: 10,
                  marginTop: height * 0.06,
                  backgroundColor: 'transparent',
                  flex: 1,
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'stretch',
                }}>
                <TouchableOpacity
                  style={style.cardMenu}
                  onPress={() => this.featureCheck('Attendance')}>
                  <CardItem style={{backgroundColor: 'transparent'}}>
                    <Body style={{alignItems: 'center'}}>
                      <Image
                        source={require('assets/menu/fingerlogo.png')}
                        style={style.iconMenu}
                      />
                    </Body>
                  </CardItem>
                </TouchableOpacity>
              </View>
            </View>
            {/* NEWS BANNER */}
            <View
              style={{
                position: 'absolute',
                bottom: 0,
                padding: 0,
                width: width * 0.9,
                height: height * 0.2,
                alignSelf: 'center',
                flexDirection: 'column',
              }}>
              <View
                style={{
                  backgroundColor: '#fff',
                  alignSelf: 'center',
                  borderRadius: 10,
                  alignItems: 'center',
                }}>
                {this.props.imageBanner.length > 0 && this.state.isBanner && (
                  <Carousel
                    pagination={PaginationLight}
                    renderItem={this.renderBanner}
                    data={this.props.imageBanner}
                    loop={true}
                    autoplay={true}
                    autoplayInterval={40000}
                  />
                )}
              </View>
            </View>
          </ImageBackground>
        </Content>
      </Container>
    );
  }
}

const style = StyleSheet.create({
  cardMenu: {
    width: width * 1,
    // borderColor: '#F2D165',
    // backgroundColor: 'rgba(52, 52, 52, 0.8)',
    // borderBottomWidth: 1,
    // borderLeftWidth: 1,
    // borderRightWidth: 1,
    // borderRadius: 0,
    minHeight: 90,
    maxHeight: 130,
    marginRight: 0,
    marginLeft: 0,
    marginTop: 0,
    textAlign: 'center',
    marginTop: -200,
  },
  disabledCardMenu: {
    width: width * 0.25,
    backgroundColor: '#ddd',
    borderColor: '#ccc',
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRadius: 0,
    minHeight: 90,
    maxHeight: 130,
    marginRight: 0,
    marginLeft: 0,
    marginTop: 0,
    textAlign: 'center',
  },
  iconMenu: {
    width: 100,
    height: 100,
    resizeMode: 'stretch',
  },
  menuText: {
    fontSize: width * 0.03,
    top: 2,
    textAlign: 'center',
    fontWeight: '500',
  },
  newsBanner: {
    height: height * 0.15,
    width: width * 0.9,
    resizeMode: 'stretch',
  },
});

function mapStateToProps() {
  return {
    user: UserStore.getUserData(),
    todoList: ServiceStore.getTodoListData(),
    featureData: ServiceStore.getFeatureData(),
    imageBanner: ServiceStore.getImageBanner(),
  };
}

export default connect(mapStateToProps)(TabDashboard);
