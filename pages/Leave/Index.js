import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Platform,
  Pressable,
  Alert,
  Image
} from 'react-native';
import React, {useState, useEffect} from 'react';

import {styles} from './Style';
import axios from 'axios';

// import {Card, Paragraph} from 'react-native-paper';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {TextInput} from 'react-native-gesture-handler';
import Spinner from 'react-native-loading-spinner-overlay';

// Import File Viewer to View Files in Native File Viewer
import FileViewer from 'react-native-file-viewer';
// Import DocumentPicker to pick file to view
import DocumentPicker from 'react-native-document-picker';
import {REST_URL, HEADERS_CONFIG} from '../../AppConfig';
import AsyncStorage from '@react-native-community/async-storage';
import { FlatList } from 'native-base';

// const baseUrl = 'https://reqres.in';
const baseUrl = 'https://aralia.pegadaian.co.id/webservice_api';
// const baseUrl = 'https://api-aralia.abera.id';
// const baseUrl = 'http://localhost/backend-abera-aralia-pegadaian';

const ButtonMenu = (props) => {
  return (
    <View>
      <Text style={styles.text}>{props.name}</Text>
    </View>
  );
};

const ButtonMenuFailed = (props) => {
  return (
    <View>
      <Text style={{
                  width: '100%',
                  backgroundColor: 'red',
                  padding: 10,
                  color: 'white',
                  borderRadius: 5,
                  textAlign: 'center',
                  marginBottom: 16,
                  marginTop: 16
                }}>{props.name}</Text>
    </View>
  );
};

const ButtonMenuModal = (props) => {
  return (
    <View>
      <Text style={styles.textModal}>{props.name}</Text>
    </View>
  );
};

Date.prototype.toShortFormat = function () {
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const day = this.getDate();

  const monthIndex = this.getMonth();
  const monthName = monthNames[monthIndex];

  const year = this.getFullYear();

  return `${day} ${monthName} ${year}`;
};


function formatDate(date, isEndDate) {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  if (date == '') {
    if (isEndDate) {
      return 'Sampai Tanggal';
    } else {
      return 'Mulai Tanggal';
    }
  }

  return [year, month, day].join('-');
}

function formatDateNew(date, isEndDate) {
  var d = new Date(date);

  if (date == '') {
    if (isEndDate) {
      return 'Sampai Tanggal';
    } else {
      return 'Mulai Tanggal';
    }
  }

  return d.toShortFormat();
}

const readData = async () => {
  try {
    const value = await AsyncStorage.getItem('tokk');
    console.log('TOKEN ADALAH');
    console.log(value);
    if (value !== null) {
      // saveData(value);
      return value;
    }
  } catch (e) {
    console.log(e);
    alert('Failed to fetch the input from storage');
  }
};

const renderItem = ({ item }) => {
  return (
    <TouchableOpacity
    onPress={() => toggleModalVisibility(item.attendance_type, item.id_attendance_type)}>
    <ButtonMenuModal name={item.attendance_type} />
  </TouchableOpacity>
  );
}

const Index = ({navigation}) => {
  
  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalDocs, setModalDocs] = useState(false);
  const [isTanggalMulai, setIsTanggalMulai] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isShowModalFailed, setIsShowModalFailed] = useState(false);
  const [modalFailedMessage, setModalFailedMessage] = useState('');


  const [cutiType, setCutiType] = useState('Pilih Cuti');
  const [cutiId, setCutiId] = useState('');

  const [cutiBalance, setCutiBalance] = useState(0);
  
  const [token, setToken] = useState('');
  const [cutiResponse, setCutiResponse] = useState('');

  const [date, setDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [mUri, setUri] = useState('');
  const [fileName, setFileName] = useState('Upload Dokumen');

  useEffect(() => {
    readData()
    .then((data) => {
      setToken(data);
      setIsLoading(true);

      console.log('TOKEN DALAM ADALAH');
      console.log(data);

      let url = `${baseUrl}/attendance_type/get_all?page=1&limit=10`;
      // let access_token =
      //   'ZW1wXzIwMDczMDAyMjBfMDc3MTUvLy8xNjY5NzE4NzQ3Ly8vJDJ5JDEwJE9XQUMxaGtUcWJ1azNVYUZDY0hzZWVjQ1M4VXEweEp4VmdxSVVhY3k1cWlGOFJWNzVVV0xh';
      fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${data}`,
          // ...HEADERS_CONFIG.headers,
        },
      })
      .then((response) => response.json())
      .then((responseJSON) => {
        console.log('response is');
        console.log(responseJSON);
        setIsLoading(false);
        setCutiResponse(responseJSON);
      });
    })
    .catch((err) => console.log(err));
  }, []);


  const toggleModalVisibility = (cuti, cutiId, cutiBalance) => {
    setModalVisible(!isModalVisible);
    if (cuti != '') {
      setCutiType(cuti);
      setCutiId(cutiId);
      setCutiBalance(cutiBalance);
    }
  };

  const toggleModalDoc = () => {
    setModalDocs(!isModalDocs);
  };

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = (mIsTanggalMulai) => {
    setIsTanggalMulai(mIsTanggalMulai);
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (mDate) => {
    if (isTanggalMulai) {
      setDate(mDate);
    } else {
      setEndDate(mDate);
    }
    hideDatePicker();
  };

  const calculateDaysBetween = (dateStart, dateEnd) => {
    var date1 = new Date(dateStart);
    var date2 = new Date(dateEnd);
  
    var diffInTime = date2.getTime() - date1.getTime();
    var diffInDays = diffInTime / (1000 * 3600 * 24);
    return diffInDays;
  }

  const BtnSubmit = async () => {
    if (cutiType == '') {
      Alert.alert('Info', 'Belum memilih jenis Cuti');
      return;
    }

    if (date == '') {
      Alert.alert('Info', 'Belum memilih waktu mulai cuti');
      return;
    }

    if (endDate == '') {
      Alert.alert('Info', 'Belum memilih waktu berakhir cuti');
      return;
    }

    console.log('Days is ');
    console.log(calculateDaysBetween(date, endDate));

    if (calculateDaysBetween(date, endDate) < 0) {
      Alert.alert(
        'Info',
        'Waktu berakhir cuti tidak boleh dibawah waktu mulai cuti',
      );
      return;
    }
    if (calculateDaysBetween(date, endDate) > cutiBalance) {
      Alert.alert('Info', 'Pengajuan cuti tidak boleh melebihi balance cuti');
      return;
    }

    if (mUri == '') {
      Alert.alert('Info', 'Belum mengupload dokumen');
      return;
    }

    setIsLoading(true);

    let name = mUri.split('/');
    name = name[name.length - 1];
    const contentType = 'application/pdf';

    console.log('Type is ');
    console.log(cutiId);

    const formData = new FormData();
    formData.append('reason', cutiType);
    formData.append('start_date', formatDate(date, false));
    formData.append('end_date', formatDate(endDate, true));
    formData.append('id_attendance_type', cutiId);
    formData.append('days_count', calculateDaysBetween(date, endDate));
    formData.append('file', {
      name: fileName,
      type: contentType,
      uri: mUri,
    });
    console.log('URL FILE');
    console.log(fileName);
    let url = `${baseUrl}/leave_request/create`;

    console.log('STARTDATE');
    console.log(formatDate(date));
    console.log('ENDDATE');
    console.log(formatDate(endDate));

    readData()
    .then((data) => {
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${data}`
        },
        body: formData,
      })
        .then((response) => response.json())
        .then((responseJSON) => {
          setIsLoading(false);
          console.log('response is')
          console.log(responseJSON.message);
          
          if (responseJSON.message != undefined) {
            setIsShowModalFailed(true);
            setModalFailedMessage(responseJSON.message);
            return;
          }
  
          navigation.navigate('LeaveSuccess');
        })
        .catch((err) => {
          console.log(err);
          navigation.navigate('LeaveFailed');
        });
    })
    .catch((err) => console.log(err));
    
  };

  const selectOneFile = async () => {
    try {
      const res = await DocumentPicker.pick({
        // Provide which type of file you want user to pick
        type: [DocumentPicker.types.pdf],
      });
      if (res) {
        let uri = res.uri;
        if (Platform.OS === 'ios') {
          uri = res.uri.replace('file://', '');
        }
        setUri(uri);
        setFileName(res.name);
        console.log('My URI : ' + res.name);
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // If user canceled the document selection
        alert('Canceled');
      } else {
        // For Unknown Error
        alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
      onPress={() => toggleModalVisibility(item.attendance_type, item.id_attendance_type)}>
      <ButtonMenuModal name={item.attendance_type} />
    </TouchableOpacity>
    );
  }

  return (
    <>
      <View style={styles.container}>
      <Spinner
            visible={isLoading}
            color={styles.statusbarAccent.backgroundColor}
            size="large"
          />
        <TouchableOpacity
          onPress={() => toggleModalVisibility('')}
          style={{width: '85%'}}>
          <View>
            <Text style={styles.text}>{cutiType}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => showDatePicker(true)}
          style={{width: '85%'}}>
          <ButtonMenu name={formatDateNew(date, false)} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => showDatePicker(false)}
          style={{width: '85%'}}>
          <ButtonMenu name={formatDateNew(endDate, true)} />
        </TouchableOpacity>
        <TouchableOpacity onPress={selectOneFile} style={{width: '85%'}}>
          <ButtonMenu name={fileName} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => BtnSubmit()}>
          <Text
            style={{
              fontSize: 16,
              lineHeight: 21,
              color: 'white',
              fontWeight: 'bold',
              letterSpacing: 0.25,
            }}>
            Submit
          </Text>
        </TouchableOpacity>

        <Modal
          animationType="slide"
          transparent
          visible={isModalVisible}
          presentationStyle="overFullScreen"
          onDismiss={() => toggleModalVisibility('', '')}
          style={{flex: 1, justifyContent: 'center', width: '100%'}}>
          <View style={styles.viewWrapper}>
            <View style={styles.modalView}>
                <FlatList
              style={{width: '80%', marginTop: 16}}
                      data={cutiResponse}
                      renderItem={renderItem}
                      keyExtractor={(item, index) => index.toString()}
              />
              <Pressable
                style={styles.buttonNew}
                onPress={() => toggleModalVisibility('', '')}>
                <Text
                  style={{
                    fontSize: 16,
                    lineHeight: 21,
                    fontWeight: 'bold',
                    letterSpacing: 0.25,
                    color: 'white',
                  }}>
                  Oke
                </Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />

        <Modal
          animationType="slide"
          transparent
          visible={isModalDocs}
          presentationStyle="overFullScreen"
          onDismiss={toggleModalDoc}
          style={{flex: 1, justifyContent: 'center', width: '100%'}}>
          <View style={styles.viewWrapper}>
            <View style={styles.modalView}>
              <Text variant="headlineSmall">Upload Dokumen</Text>
              <View style={{height: 250, width: '80%', marginTop: 20}}>
                <TouchableOpacity
                  style={styles.buttonStyle}
                  activeOpacity={0.5}
                  onPress={selectOneFile}>
                  <Text style={styles.buttonTextStyle}>
                    Select File to View
                  </Text>
                </TouchableOpacity>
              </View>
              <Pressable style={styles.button} onPress={toggleModalDoc}>
                <Text
                  style={{
                    fontSize: 16,
                    lineHeight: 21,
                    fontWeight: 'bold',
                    letterSpacing: 0.25,
                    color: 'white',
                  }}>
                  Oke
                </Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        <View style={styles.centeredView}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={isShowModalFailed}
            onRequestClose={() => {
              setIsShowModalFailed(false);
            }}>

              <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'white',
                marginHorizontal: 20,
                marginVertical: 20,
                marginTop: 250,
                borderRadius: 20,
              }}>
              <Image source={require('assets/failed.png')} style={styles.logo} />

              <Text style={{fontSize: 18, color: 'black', marginTop: 16, marginBottom: 16, textAlign: 'center'}}>{modalFailedMessage}</Text>

              <TouchableOpacity
              onPress={() => {
                setIsShowModalFailed(false);
              }}
              style={{width: '85%'}}>
              <ButtonMenuFailed name='Oke' />
            </TouchableOpacity>
            </View>
            
          </Modal>
        </View>
      </View>
    </>
  );
};

export default Index;
