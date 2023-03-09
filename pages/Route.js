import React, {Component} from 'react';
import {connect} from 'remx';
import {store} from '../remx/Service/store';
import HeaderLayout from './HeaderLayout';
import styles from '../styles';
import {handleBack} from '../AppConfig';

import {Image, BackHandler, View, ImageBackground} from 'react-native';

import {Container, Text, Badge} from 'native-base';
import {NavigationContainer} from '@react-navigation/native';
import {Tabs} from './Tabs';

function Route() {
  return (
    <>
      {/* <View style={styles.container}>
        <ImageBackground
          source={require('../assets/bg-login.png')}
          resizeMode="cover"
          style={{height: 680}}>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <View style={{marginTop: 150}}>
              <Text>Foto Profile</Text>
              <Text style={styles.textLabel}>Nama Lengkap</Text>
              <Text style={styles.textLabel}>User ID</Text>
            </View>
            <View style={{marginTop: 100}}>
              <Image source={require('../assets/menu/fingerlogo.png')} />
            </View>
          </View>
        </ImageBackground>
      </View> */}
      {/* <NavigationContainer>
        <Tabs />
      </NavigationContainer> */}
    </>
  );
}

// tabs pages
// import DashboardPages from './Tabs/Dashboard';
// import RequestPages from './Tabs/Request';
// import SettingPages from './Tabs/Settings';
// import PersonalPages from './Tabs/Personal';

// class Home extends Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       tab1: '',
//       tab2: '',
//       tab3: '',
//       tab4: '',
//     };
//   }

//   componentDidMount() {
//     this.props.navigation.addListener('focus', () => {
//       this.backHandler = BackHandler.addEventListener(
//         'hardwareBackPress',
//         handleBack,
//       );
//     });

//     this.props.navigation.addListener('blur', () => {
//       if (this.backHandler) this.backHandler.remove();
//     });

//     this.setState({tab1: require('assets/tab/home.png')});
//   }

//   onTabChange() {
//     let {currentPage} = this.tabs.state;

//     if (currentPage == 0) {
//       this.setState({
//         tab1: require('assets/tab/home.png'),
//         tab2: '',
//         tab3: '',
//         tab4: '',
//       });
//     } else if (currentPage == 1) {
//       this.setState({
//         tab2: require('assets/tab/request.png'),
//         tab3: '',
//         tab4: '',
//         tab1: '',
//       });
//     } else if (currentPage == 2) {
//       this.setState({
//         tab3: require('assets/tab/setting.png'),
//         tab4: '',
//         tab1: '',
//         tab2: '',
//       });
//     } else if (currentPage == 3) {
//       this.setState({
//         tab4: require('assets/tab/personal.png'),
//         tab1: '',
//         tab2: '',
//         tab3: '',
//       });
//     }
//   }

// render() {
//   let {myRequestData} = this.props;

//   return (
//     <Container>
//       <HeaderLayout />
//       <View
//         ref={(c) => (this.tabs = c)}
//         tabBarUnderlineStyle={styles.tabBar}
//         onChangeTab={() => this.onTabChange()}
//         tabContainerStyle={{elevation: 1}}
//         locked={true}
//         tabBarPosition="bottom">
{
  /* <View
            heading={
              <View style={styles.statusbar}>
                <Image
                  source={
                    this.state.tab1
                      ? this.state.tab1
                      : require('assets/tab/home-inactive.png')
                  }
                  style={styles.tabImage}
                />
              </View>
            }
            tabStyle={{backgroundColor: '#000'}}>
            <DashboardPages navigation={this.props.navigation} />
          </View>

          <View
            heading={
              <View style={styles.statusbar}>
                <Image
                  source={
                    this.state.tab2
                      ? this.state.tab2
                      : require('assets/tab/request-inactive.png')
                  }
                  style={[
                    styles.tabImage,
                    {left: myRequestData.length > 0 ? 20 : 0},
                  ]}
                />
                {myRequestData.length > 0 && (
                  <Badge>
                    <Text style={{top: 2}}>{myRequestData.length}</Text>
                  </Badge>
                )}
              </View>
            }
            tabStyle={{backgroundColor: '#fff'}}>
            <RequestPages navigation={this.props.navigation} />
          </View>

          <View
            heading={
              <View style={styles.statusbar}>
                <Image
                  source={
                    this.state.tab3
                      ? this.state.tab3
                      : require('assets/tab/setting-inactive.png')
                  }
                  style={styles.tabImage}
                />
              </View>
            }
            tabStyle={{backgroundColor: '#fff'}}>
            <SettingPages navigation={this.props.navigation} />
          </View>

          <View
            heading={
              <View style={styles.statusbar}>
                <Image
                  source={
                    this.state.tab4
                      ? this.state.tab4
                      : require('assets/tab/personal-inactive.png')
                  }
                  style={styles.tabImage}
                />
              </View>
            }
            tabStyle={{backgroundColor: '#fff'}}>
            <PersonalPages navigation={this.props.navigation} />
          </View> */
}
//         </View>
//       </Container>
//     );
//   }
// }

function mapStateToProps(ownProps) {
  return {
    myRequestData: store.getMyRequestData(),
  };
}

export default Route;
// export default connect(mapStateToProps)(Route);
