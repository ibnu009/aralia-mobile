import React, { Component } from 'react';
import { connect } from 'remx';
import { store } from '../../remx/Service/store';
import * as actions from '../../remx/Service/actions';
import { store as UserStore } from '../../remx/User/store';
import * as UserAction from '../../remx/User/actions';

/* Import Request List */
import LeaveList from '../SP/LeaveList';
import OvertimeList from '../SP/OvertimeList';
import EmployeeRequestList from '../SP/EmployeeRequestList';
import ApprovalDispensation from '../SP/DispensationList';
import ClaimList from '../SP/ClaimList';
import SuratTugasList from '../SP/SuratTugasList';
import HeaderLayout from '../HeaderLayout';
import NotFound from '../NotFound';

class WorklistList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
    };
  }

  componentDidMount() {
    UserAction.checkSession();
    actions.getWorklist(
      this.props.user.nip,
      this.props.route.params.jns_kasuskode,
    );
  }

  componentDidUpdate(prevProps) {
    if (prevProps.data != store.getWorklistData()) {
      this.setState({ isLoading: false });
    }
  }

  getContent = () => {
    let { title } = this.props.route.params

    if (new RegExp('cuti', 'i').exec(title)) {
      return <LeaveList {...this.props} />

    } else if (new RegExp('surat tugas', 'i').exec(title)) {
      return <SuratTugasList {...this.props} />

    } else if (new RegExp('klaim', 'i').exec(title)) {
      return <ClaimList {...this.props} />

    } else if (new RegExp('lembur', 'i').exec(title)) {
      return <OvertimeList {...this.props} />

    } else if (new RegExp('dispensasi absensi|absensi', 'i').exec(title)) {
      return <ApprovalDispensation {...this.props} />

    } else if (new RegExp('fppk', 'i').exec(title)) {
      return <EmployeeRequestList {...this.props} />

    } else {
      return (
        <>
          <HeaderLayout />
          <NotFound />
        </>
      );
    }
  };

  render() {
    return this.getContent()
  }
}

function mapStateToProps() {
  return {
    user: UserStore.getUserData(),
    data: store.getWorklistData(),
  };
}

export default connect(mapStateToProps)(WorklistList);
