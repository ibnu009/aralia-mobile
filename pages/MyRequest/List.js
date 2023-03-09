import React from 'react';
import { connect } from 'remx';
import { store } from '../../remx/Service/store';
import { store as UserStore } from '../../remx/User/store';
import * as actions from '../../remx/Service/actions';
import HeaderLayout from '../HeaderLayout';
import NotFound from '../NotFound';

/* Import Request List */
import LeaveRequest from '../Leave/List';
import EmployeeRequest from '../EmployeeRequest/List';
import SppdRequest from '../SPPD/List';
import ClaimRequestList from '../Claim/List';
import DispensationRequest from '../Attendance/DispensationRequest';

import AsyncStorage from '@react-native-community/async-storage';

class MyRequestList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
    };
  }

  componentDidMount() {
    let { jns_kasuskode } = this.props.route.params;
    actions.getMyRequestList(this.props.user.nip, jns_kasuskode);
    // actions.getJenisTugas();
  }

  componentDidUpdate(prevProps) {
    const data = store.getMyRequestListData();
    if (prevProps.data != data) {
      this.setState({ isLoading: false, data: data });
    }
  }

  getContent() {
    let { title } = this.props.route.params

    if (new RegExp('cuti', 'i').exec(title)) {
      return <LeaveRequest {...this.props} />;
    } else if (new RegExp('fppk', 'i').exec(title)) {
      return <EmployeeRequest {...this.props} />;
    } else if (new RegExp('surat tugas', 'i').exec(title)) {
      return <SppdRequest {...this.props} />;
    } else if (new RegExp('klaim', 'i').exec(title)) {
      return <ClaimRequestList {...this.props} />;
    } else if (new RegExp('dispensasi absensi|konfirmasi', 'i').exec(title)) {
      return <DispensationRequest {...this.props} />;
    } else {
      return (
        <>
          <HeaderLayout />
          <NotFound />
        </>
      );
    }
  }

  render() {
    return this.getContent();
  }
}

function mapStateToProps() {
  return {
    user: UserStore.getUserData(),
    data: store.getMyRequestListData(),
  };
}

export default connect(mapStateToProps)(MyRequestList);
