import React from 'react';
import {connect} from 'remx';
import HeaderLayout from '../HeaderLayout';
import styles, {normalize} from '../../styles';
import * as actions from '../../remx/Service/actions';
import {store} from '../../remx/Service/store';
import {store as UserStore} from '../../remx/User/store';

import {
  Image,
  TouchableOpacity,
  StyleSheet,
  View,
  ActivityIndicator,
  RefreshControl,
  FlatList,
} from 'react-native';

import {
  Container,
  List,
  ListItem,
  Left,
  Right,
  Button,
  Icon,
  Text,
} from 'native-base';

class ClaimWorklist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isLoadMore: false,
    };
  }

  componentDidMount() {
    this._resetState();
  }

  componentDidUpdate(prevProps) {
    const data = store.getWorklistData();
    if (prevProps.data != data) {
      this.setState({isLoading: false, isLoadMore: false});
    }

    const isEndOfPage = store.isEndOfPage();
    if (prevProps.isEndOfPage !== isEndOfPage) {
      this.setState({isLoading: false, isLoadMore: false});
    }
  }

  _resetState() {
    // set default page 1
    store.setPaginationWorklist(1);
    store.setEndOfPage(false);
    // clear before
    store.setWorklistData([]);
  }

  handleRefresh = () => {
    this._resetState();
    this.setState({isLoading: true});
    actions.getWorklist(
      this.props.user.nip,
      this.props.route.params.jns_kasuskode,
    );
  };

  handleLoadMore = () => {
    if (!this.state.isLoadMore && !this.props.isEndOfPage) {
      let page = store.getPaginationWorklist();
      store.setPaginationWorklist(page + 1);
      actions.getWorklist(
        this.props.user.nip,
        this.props.route.params.jns_kasuskode,
      );
      this.setState({isLoadMore: true});
    }
  };

  generateList = items => {
    let list = items.item;
    let {title} = this.props.route.params;
    return (
      <TouchableOpacity>
        <List>
          <ListItem>
            <Text style={{width: '50%'}}>Nama Aktifitas</Text>
            <Text style={{width: '50%'}}>{list.nama_aktifitas ?? '-'}</Text>
          </ListItem>
          <ListItem>
            <Text style={{width: '50%'}}>Nama Pegawai</Text>
            <Text style={{width: '50%'}}>{list.nm_peg ?? '-'}</Text>
          </ListItem>
          <ListItem style={{paddingBottom: 20}}>
            <Left style={{flexDirection: 'column'}}>
              <View style={[style.leftSide, {width: '100%'}]}>
                <Image
                  source={require('assets/calendar.png')}
                  style={styles.imageInputLabel}
                />
                <Text>Tanggal Pengajuan</Text>
              </View>
              <Text
                style={{width: '100%', top: 10, color: '#1565c0', left: 25}}>
                {list.tgl_pengajuan ?? '-'}
              </Text>
            </Left>
            <Right>
              <Button
                success
                iconRight
                small
                style={{borderRadius: 5, width: 100}}
                onPress={() =>
                  this.props.navigation.push('WorklistDetail', {
                    title: title,
                    data: list,
                  })
                }>
                <Text style={{fontSize: normalize(12)}}>Detail</Text>
                <Icon name="ios-arrow-forward" />
              </Button>
            </Right>
          </ListItem>
        </List>
      </TouchableOpacity>
    );
  };

  render() {
    let {title} = this.props.route.params;

    return (
      <Container>
        <HeaderLayout title={title} navigation={this.props.navigation} />
        <FlatList
          data={this.props.data}
          renderItem={item => this.generateList(item)}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={true}
          initialNumToRender={10}
          ItemSeparatorComponent={() => <ListItem itemDivider />}
          ListEmptyComponent={
            <ActivityIndicator
              size="large"
              style={styles.loading}
              color={styles.loading.color}
            />
          }
          refreshControl={
            <RefreshControl
              refreshing={this.state.isLoading}
              onRefresh={this.handleRefresh}
              title="Loading..."
            />
          }
          onEndReached={() => this.handleLoadMore()}
          onEndReachedThreshold={0}
          ListFooterComponent={() => {
            if (!this.state.isLoadMore) return null;
            return (
              <ActivityIndicator
                size="large"
                color={styles.statusbarAccent.backgroundColor}
              />
            );
          }}
        />
      </Container>
    );
  }
}

const style = StyleSheet.create({
  leftSide: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

function mapStateToProps() {
  return {
    data: store.getWorklistData(),
    user: UserStore.getUserData(),
    isEndOfPage: store.isEndOfPage(),
  };
}

export default connect(mapStateToProps)(ClaimWorklist);
