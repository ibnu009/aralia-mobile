import {StyleSheet, Dimensions, Platform, PixelRatio} from 'react-native';
const {width, height} = Dimensions.get('screen');
// based on iphone 5s's scale
const scale = width / 320;

export function normalize(size) {
  const newSize = size * scale;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
}

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 10,
  },
  textLabel: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
  viewWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  statusbar: {
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
    borderBottomWidth: 0,
  },
  statusbarAccent: {
    backgroundColor: '#1C191A',
  },
  statusBarImage: {
    width: Dimensions.get('screen').width * 0.2,
    height: Dimensions.get('screen').height * 0.04,
    resizeMode: 'stretch',
  },
  statusbarTitle: {
    fontSize: normalize(20),
    color: '#fff',
    fontWeight: '400',
  },
  badge: {
    backgroundColor: 'red',
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 7,
    paddingRight: 7,
    borderRadius: 50,
    fontSize: normalize(10),
    fontWeight: 'bold',
    color: '#fff',
  },
  tabBar: {
    backgroundColor: '#ccc',
  },
  tabImage: {
    width: 30,
    height: 30,
  },
  wallImageWrapper: {
    // paddingLeft:10,
    // paddingRight: 10,
    // paddingTop: 5,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 0,
    height: height * 0.78,
  },
  userBoxName: {
    top: 10,
    color: '#fff',
    height: 20,
    borderRadius: 10,
    fontWeight: 'bold',
    justifyContent: 'center',
  },
  displayPicture: {
    borderRadius: 30,
    width: 100,
    height: 100,
    resizeMode: 'stretch',
    // borderWidth: 2,
    // borderColor: '#ccc',
  },
  cardListItem: {
    marginLeft: 0,
    marginTop: 0,
    marginRight: 0,
  },
  cardListImageItem: {
    width: 50,
    height: 50,
  },
  buttonPrimay: {
    backgroundColor: 'rgba(242,209,101,1)',
  },
  buttonSuccess: {
    backgroundColor: '#2C6700',
    paddingLeft: 5,
    paddingRight: 5,
    minHeight: 23,
  },
  buttonDanger: {
    backgroundColor: '#dc3545',
    paddingLeft: 5,
    paddingRight: 5,
    minHeight: 23,
  },
  textInputLabel: {
    fontSize: normalize(16),
    color: '#000',
    width: '50%',
  },
  cardTextTitle: {
    fontWeight: '400',
    fontSize: normalize(17),
    color: '#fff',
    left: width * 0.02,
  },
  imageInputLabel: {
    width: 25,
    height: 25,
    right: 5,
  },
  loading: {
    height: height,
    color: 'rgba(242,209,101,1)',
  },
});
