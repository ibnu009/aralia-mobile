import React, {Component} from 'react';
import {connect} from 'remx';
import HeaderLayout from '../HeaderLayout';
import {store as UserStore} from '../../remx/User/store';
import * as action from '../../remx/Service/actions';
import Spinner from 'react-native-loading-spinner-overlay';
import {
  Container,
  Content,
  List,
  ListItem,
  Text,
  Label,
  Button,
  Footer,
  FooterTab,
  Textarea,
  Toast,
} from 'native-base';
import styles from '../../styles';
import {Alert, Dimensions} from 'react-native';

/* Content */
import LeaveWorklistDetail from '../SP/LeaveDetail';
import OvertimeWorklistDetail from '../SP/OvertimeDetail';
import EmployeeRequestWorklistDetail from '../SP/EmployeeRequestDetail';
import DispensationWorklistDetail from '../SP/Dispensation';
import ClaimWorklistDetail from '../SP/Claim';
import SuratTugasWorklistDetail from '../SP/SuratTugas';
import {REST_URL, HEADERS_CONFIG} from '../../AppConfig';
import NotFound from '../NotFound';

class WorklistDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alasan_persetujuan: '',
      showLoading: false,
      data: {},
    };
  }

  componentDidMount() {
    const {data} = this.props.route.params;
    this.setState({data: data});
  }

  doFollowUp = (approve) => {
    this.setState({showLoading: true});

    let uri = `${REST_URL}/operasional/do_follow_up.php?approve=${approve}&nip=${this.props.user.nip}&kso_kasusnomor=${this.state.data.kso_kasusnomor}&alasan_persetujuan=${this.state.alasan_persetujuan}`;
    fetch(uri, HEADERS_CONFIG)
      .then((response) => response.json())
      .then((res) => {
        this.setState({showLoading: false});
        if (res.error) {
          Alert.alert('Error!', `${res.error_msg}`, [{text: 'OK'}]);
        } else if (res.success) {
          if (res.success_msg == null || res.success_msg == '') {
            this.props.navigation.goBack();
          } else {
            Alert.alert('Info', `${res.success_msg}`, [
              {
                text: 'OK',
                onPress: () => this.props.navigation.goBack(),
              },
            ]);
          }
        }
        action.getTodoList(this.state.nip);
      })
      .catch((err) => {
        Toast.show({
          text: `Error: ${err}`,
          type: 'danger',
        });
      });
  };

  getContent = () => {
    let {title} = this.props.route.params;
    if (new RegExp('cuti', 'i').exec(title)) {
      return <LeaveWorklistDetail {...this.props} />;
    } else if (new RegExp('surat tugas', 'i').exec(title)) {
      return <SuratTugasWorklistDetail {...this.props} />;
    } else if (new RegExp('klaim', 'i').exec(title)) {
      return <ClaimWorklistDetail {...this.props} />;
    } else if (new RegExp('lembur', 'i').exec(title)) {
      return <OvertimeWorklistDetail {...this.props} />;
    } else if (new RegExp('dispensasi absensi|absensi', 'i').exec(title)) {
      return <DispensationWorklistDetail {...this.props} />;
    } else if (new RegExp('fppk', 'i').exec(title)) {
      return <EmployeeRequestWorklistDetail {...this.props} />;
    } else {
      return <NotFound />;
    }
  };

  render() {
    let {title} = this.props.route.params;
    return (
      <Container>
        <Spinner
          visible={this.state.showLoading}
          overlayColor="rgba(0, 0, 0, 0.25)"
          size="large"
        />
        <HeaderLayout
          title={`${title} Detail`}
          navigation={this.props.navigation}
        />
        <Content>
          <this.getContent />

          <List>
            <ListItem
              style={{
                flexDirection: 'column',
                paddingTop: 10,
                paddingBottom: 10,
              }}
              last>
              <Label style={[styles.textInputLabel, {width: '100%'}]}>
                Alasan Persetujuan
              </Label>
              <Textarea
                onChangeText={(val) => this.setState({alasan_persetujuan: val})}
                style={{width: '90%'}}
                rowSpan={5}
                bordered
                placeholder="Ketik disini..."
              />
            </ListItem>
          </List>
        </Content>
        <Footer
          style={{backgroundColor: 'transparent', bottom: 20, marginTop: 20}}>
          {/* <Footer style={{backgroundColor: 'transparent', bottom: 20, marginTop: 20}}> */}
          <FooterTab style={{backgroundColor: '#fff'}}>
            <Button
              rounded
              bordered
              style={{
                borderColor: '#b71c1c',
                backgroundColor: '#b71c1c',
                borderWidth: 3,
                left: '30%',
                maxWidth: '50%',
                marginRight: '10%',
              }}
              onPress={() => this.doFollowUp('0')}>
              <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 15}}>
                Tidak Setuju
              </Text>
            </Button>

            <Button
              rounded
              style={[styles.buttonPrimay, {right: '30%', maxWidth: '50%'}]}
              onPress={() => this.doFollowUp('1')}>
              <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 15}}>
                Setuju
              </Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}
function mapStateToProps() {
  return {
    user: UserStore.getUserData(),
  };
}

export default connect(mapStateToProps)(WorklistDetail);
