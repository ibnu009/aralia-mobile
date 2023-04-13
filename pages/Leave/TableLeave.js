import React, {Component} from 'react';
import HeaderLayout from '../HeaderLayout';
import {connect} from 'remx';
import {store} from '../../remx/ListLeave/store';
import {store as UserStore} from '../../remx/User/store';
import * as actions from '../../remx/ListLeave/actions';
import styles from '../../styles';
import {MONTH_ITEMS_OPTION} from '../../AppConfig';
import {Table, Row, Rows} from 'react-native-table-component';
import HeaderBack from '../HeaderBack';
import SelectDropdown from 'react-native-select-dropdown';

import {yearOptionItem} from '../../AppConfig';

import {
  StyleSheet,
  ActivityIndicator,
  Button,
  Dimensions,
  ScrollView,
  Text,
  FlatList,
  View,
  Platform,
  Alert,
} from 'react-native';

import Moment from 'moment';
import FileViewer from 'react-native-file-viewer';

// import {
//   Container,
//   Item,
//   Picker,
//   Button,
//   Text,
//   ListItem,
//   Grid,
//   Row,
//   Col,
//   Label,
// } from 'native-base';

import {PermissionsAndroid} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import AsyncStorage from '@react-native-community/async-storage';

class TableLeave extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = {
      nip: '',
      data: [],
      selectedYear: new Date().getFullYear(),
      selectedMonth: new Date().getMonth() + 1,
      // For selected
      canada: '',
      // For table
      tableHead: [
        'Tanggal Masuk',
        'Jam Masuk',
        'Tanggal Keluar',
        'Jam Keluar',
        'Jam kerja Efektif',
      ],
      widthArr: [70, 80, 80, 100, 120],
    };
  }

  componentDidMount() {
    try {
      const granted = PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Folder Permission',
          message: 'Aralia App needs access to your folder ',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
    } catch (err) {
      console.warn(err);
    }

    if ('' != UserStore.getUserData()) {
      var userData = UserStore.getUserData();
      var nip = userData['id_employee'];
      // store.setData([]);

      store.setLoading(true);
      actions.setMonth(this.state.selectedMonth);
      actions.setYear(this.state.selectedYear);
      this.readData()
      .then((data) => {
        actions.setToken(data);
        actions.getListLeave(
          this.state.selectedYear,
          this.state.selectedMonth,
        );
      });
    }
  }

  readData = async () => {
    try {
      const value = await AsyncStorage.getItem('tokk');
      if (value !== null) {
        // saveData(value);
        return value;
      }
    } catch (e) {
      console.log(e);
      alert('Failed to fetch the input from storage');
    }
  };

  submitButton = () => {
    store.setData([]);
    store.setLoading(true);
    actions.setMonth(this.state.selectedMonth);
    actions.setYear(this.state.selectedYear);
    actions.getListLeave(
      this.state.selectedYear,
      this.state.selectedMonth,
    );
  };

  fileNameFromUrl = (url) => {
    var matches = url.match(/\/([^\/?#]+)[^\/]*$/);
    if (matches.length > 1) {
      return matches[1];
    }
    return null;
  };

  downloadPDFAttendance = () => {
    const url = `https://aralia.pegadaian.co.id/webservice_api/leave_request/get_by_employee_id?page=1&limit=5&${this.state.selectedMonth}=11&year=${this.state.selectedYear}`;
    // const url = `https://api-aralia.abera.id/attendance/download?id_employee=${this.state.nip}&year=${this.state.selectedYear}&month=${this.state.selectedMonth}`;
    // const url = `http://localhost/backend-abera-aralia-pegadaian/attendance/download?id_employee=${this.state.nip}&year=${this.state.selectedYear}&month=${this.state.selectedMonth}`;
    let dirs =
      Platform.OS == 'ios'
        ? RNFetchBlob.fs.dirs.DownloadDir
        : RNFetchBlob.fs.dirs.DownloadDir;

    // =================================================================
    // DOWNLOAD DENGAN HTML RESPONSE TO PDF
    // =================================================================
    fetch(url) // Call the fetch function passing the url of the API as a parameter
      .then((res) => {
        return res.text();
      })
      .then((data) => {
        let fileName = Moment().format('d_m_Y_hh_mm_ss');
        let options = {
          html: data,
          fileName: fileName,
          directory: 'Download',
        };

        // try {
        //   let ffile = RNHTMLtoPDF.convert(options);
        //   console.log(ffile.filePath);
        // } catch (e) {
        //   console.log(e);
        // }

        Alert.alert(
          'Info',
          `Apakah anda ingin lihat laporan yang telah di unduh didalam direktori ${dirs}/${fileName}.pdf ?`,
          [
            // {
            //   text: "Ask me later",
            //   onPress: () => console.log("Ask me later pressed")
            // },
            {
              text: 'Tutup',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {
              text: 'Lihat File',
              onPress: () => {
                FileViewer.open(`${dirs}/${fileName}.pdf`)
                  .then(() => {
                    // success
                  })
                  .catch((error) => {
                    // error
                  });
              },
            },
          ],
          {cancelable: false},
        );
      });

    // =================================================================
    // DOWNLOAD DENGAN FILE URL http://www.xxxx.com/file.pdf
    // =================================================================
    // let dirs =
    //   Platform.OS == 'ios'
    //     ? RNFetchBlob.fs.dirs.DownloadDir
    //     : RNFetchBlob.fs.dirs.DownloadDir;
    // RNFetchBlob
    // .config({
    //   // add this option that makes response data to be stored as a file,
    //   // this is much more performant.
    //   fileCache : true,
    //   path: dirs + `/${new Date().getTime()}.xls`,
    // })
    // .fetch('GET', url, {
    //   //some headers ..
    // })
    // .then((res) => {
    //   if (Platform.OS === "ios") {
    //     RNFetchBlob.ios.openDocument(resp.data);
    //   }
    //   // Alert.alert('Info', `File anda berada di folder ${res.path()}`);

    //   Alert.alert(
    //     "Info",
    //     "Apakah anda ingin lihat laporan yang telah di unduh?",
    //     [
    //       // {
    //       //   text: "Ask me later",
    //       //   onPress: () => console.log("Ask me later pressed")
    //       // },
    //       {
    //         text: "Tutup",
    //         onPress: () => console.log("Cancel Pressed"),
    //         style: "cancel"
    //       },
    //       {
    //         text: "Lihat File",
    //         onPress: () => {
    //           FileViewer.open(res.path())
    //           .then(() => {
    //             // success
    //           })
    //           .catch(error => {
    //             // error
    //           });
    //         }
    //       }
    //     ],
    //     { cancelable: false }
    //   );
    // })
  };

  generateList(items) {
    const v = items.item;
    return (
      <View
        style={{
          backgroundColor:
            v.color != ''
              ? '#' + v.color
              : items.index % 2 == 0
              ? '#DBEDFC'
              : '#fff',
          paddingTop: 10,
          paddingBottom: 10,
        }}>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={{textAlign: 'center'}}>
          <View size={33} style={style.centerCol}>
            <Text style={{color: 'black'}}>{v.start_date}</Text>
          </View>
          <View size={33} style={style.centerCol}>
            <Text style={{color: 'black'}}>{v.end_date}</Text>
          </View>
          <View size={33} style={style.centerCol}>
            <Text style={{color: 'black'}}>{v.reason}</Text>
          </View>
        </ScrollView>
      </View>
    );
  }

  yearOptionItems = () => {
    var arr = [];
    let a = new Date().getFullYear();
    for (let i = a; i > a - 5; i--) {
      arr.push(`${i}`);
    }
    return arr;
  };

  render() {
    const {data} = this.props;
    const state = this.state;
    return (
      <View>
        <HeaderBack title="Daftar Cuti" />
        <View
          style={{
            flexDirection: 'row',
            borderBottomColor: 'gray',
            borderBottomWidth: 1,
          }}>
          <SelectDropdown
            defaultButtonText={'Month'}
            buttonStyle={{
              width: 150,
            }}
            data={MONTH_ITEMS_OPTION}
            onSelect={(selectedItem, index) => {
              console.log(selectedItem, index);
            }}
          />
          <SelectDropdown
            defaultButtonText={'Year'}
            buttonStyle={{
              width: 100,
            }}
            data={yearOptionItem()}
            onSelect={(selectedItem, index) => {
              console.log(selectedItem, index);
            }}
          />
          <Button
            color="green"
            style={[
              styles.buttonSuccess,
              {
                height: '100%',
                borderRadius: 0,
                width: 100,
                marginRight: 0.3,
              },
            ]}
            title="Tambah pengajuan"
            onPress={() => this.props.navigation.navigate('Leave')}></Button>
        </View>
        {this.props.isLoading && (
          <ActivityIndicator
            size="large"
            style={{height: (60 / 100) * Dimensions.get('screen').height}}
            color={styles.loading.color}
          />
        )}
        <View
          style={{
            flexDirection: 'row',
          }}>
           <View
              size={28}
              style={{
                flex: 1,
                height: 50,
                marginLeft: 18,
              }}>
              <Text style={{color: 'black'}}>Tanggal Mulai</Text>
            </View>
            <View
              size={28}
              style={{
                flex: 1,
                height: 50,
              }}>
              <Text style={{color: 'black'}}>Tanggal Berakhir</Text>
            </View>
            <View
              size={28}
              style={{
                flex: 1,
                height: 50,
                alignItems: 'center',
              }}>
              <Text style={{color: 'black'}}>Alasan</Text>
            </View>
        </View>
        <View
          style={{
            borderBottomColor: 'black',
            borderBottomWidth: StyleSheet.hairlineWidth,
          }}
        />
        <FlatList
          data={data}
          renderItem={(item) => this.generateList(item)}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
          }}
          initialNumToRender={6}
        />
      </View>
    );
  }
}

const style = StyleSheet.create({
  centerCol: {
    alignItems: 'center',
    padding: 10,
    marginHorizontal: 18
  },
  headerLabel: {
    fontWeight: 'bold',
    color: '#000',
    fontSize: 13,
    textAlign: 'center',
  },
  header: {
    height: 50,
    backgroundColor: '#537791',
  },
  text: {textAlign: 'center', fontWeight: '100'},
  dataWrapper: {marginTop: -1},
  row: {height: 40, backgroundColor: '#E7E6E1'},
});

function mapStateToProps(ownProps) {
  return {
    data: store.getData(),
    isLoading: store.isLoading(),
    year: store.getYear(),
    month: store.getMonth(),
  };
}

export default connect(mapStateToProps)(TableLeave);
