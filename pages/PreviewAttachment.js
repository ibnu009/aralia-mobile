import React, {Component} from 'react';
import Pdf from 'react-native-pdf';
import HeaderLayout from './HeaderLayout';
import ImageViewer from 'react-native-image-zoom-viewer';
import {HEADERS_CONFIG} from '../AppConfig';
import {View, StyleSheet, Dimensions, Modal, Platform} from 'react-native';
import {Container} from 'native-base';

export default class PreviewAttachment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: true,
    };
  }

  pdfViewer = () => {
    let sourceData = {
      uri: this.props.route.params.url,
      cache: false,
      headers: HEADERS_CONFIG.headers,
    };

    return (
      <Container>
        <HeaderLayout navigation={this.props.navigation} />
        <View style={styles.container}>
          <Pdf
            source={sourceData}
            onLoadComplete={() => {
              // console.log(`number of pages: ${numberOfPages}`);
            }}
            onPageChanged={() => {
              // console.log(`current page: ${page}`);
            }}
            onError={() => {
              // console.log(error);
            }}
            style={styles.pdf}
          />
        </View>
      </Container>
    );
  };

  imageViewer = () => {
    let images = [{url: this.props.route.params.url}];
    return (
      // <Container>
      //   <HeaderLayout navigation={this.props.navigation} />
      <View style={styles.container}>
        <Modal
          visible={this.state.modalVisible}
          transparent={true}
          onRequestClose={() => {
            this.setState({modalVisible: false});
            this.props.navigation.goBack();
          }}>
          <ImageViewer
            imageUrls={images}
            enableSwipeDown={Platform.OS == 'ios'}
            onSwipeDown={() => {
              this.setState({modalVisible: false});
              this.props.navigation.goBack();
            }}
          />
        </Modal>
      </View>
      // </Container>
    );
  };

  render() {
    let tipe = this.props.route.params.url.split('.');
    tipe = tipe[tipe.length - 1];

    if (tipe == 'pdf') {
      return <this.pdfViewer />;
    } else {
      return <this.imageViewer />;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    // marginTop: 25,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
  },
});
