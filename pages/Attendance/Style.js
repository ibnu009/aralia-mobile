import {StyleSheet, Dimensions} from 'react-native';

const {width} = Dimensions.get('window');

// Style
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#143b1e',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    aspectRatio: 2,
    resizeMode: 'contain',
    marginBottom: 30,
    width: 100,
    height: 100
  },
  text: {
    marginBottom: 10,
    borderWidth: 1,
    padding: 10,
    borderColor: 'black',
    backgroundColor: 'white',
    borderRadius: 50,
    color: '#000',
    textAlign: 'center',
  },
  
  buttonStyle: {
    marginBottom: 10,
    borderWidth: 1,
    padding: 10,
    borderColor: 'black',
    backgroundColor: 'white',
    borderRadius: 50,
    textAlign: 'center',
  },

  textModal: {
    marginBottom: 10,
    borderWidth: 1,
    padding: 10,
    borderColor: 'green',
    color: 'white',
    backgroundColor: 'green',
    borderRadius: 50,
    textAlign: 'center',
  },

  btnSubmit: {
    width: '100%',
  },
  
  statusbarAccent: {
    backgroundColor: '#1C191A',
  },
  viewWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  modalView: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: '30%',
    left: '50%',
    elevation: 5,
    transform: [{translateX: -(width * 0.4)}, {translateY: -90}],
    height: 400,
    width: width * 0.8,
    backgroundColor: '#fff',
    borderRadius: 7,
  },


  modalViewList: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: '30%',
    left: '50%',
    elevation: 5,
    transform: [{translateX: -(width * 0.4)}, {translateY: -90}],
    height: 500,
    width: width * 0.8,
    backgroundColor: '#fff',
    borderRadius: 7,
  },

  textInput: {
    width: '80%',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderColor: 'rgba(0, 0, 0, 0.2)',
    borderWidth: 1,
    marginBottom: 8,
  },

  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 40,
    width: '40%',
    paddingHorizontal: 18,
    borderRadius: 5,
    elevation: 3,
    backgroundColor: '#276730',
  },
  buttonNew: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginBottom: 16,
    marginTop: 40,
    width: '40%',
    paddingHorizontal: 18,
    borderRadius: 5,
    elevation: 3,
    backgroundColor: '#276730',
  },
});

export {styles};
