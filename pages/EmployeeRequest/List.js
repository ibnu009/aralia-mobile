import React from 'react';
import {connect} from 'remx';
import {store as UserStore} from '../../remx/User/store';
import {store} from '../../remx/Service/store';
import * as actions from '../../remx/Service/actions';
import HeaderLayout from '../HeaderLayout';
import styles, {normalize} from '../../styles';
import {IMAGE_STATUS_OBJ} from '../../AppConfig';
import {
  Image,
  TouchableOpacity,
  StyleSheet,
  View,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';

import {
  Container,
  Content,
  List,
  ListItem,
  Left,
  Right,
  Label,
  Button,
  Icon,
  Text,
} from 'native-base';

import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Shine,
} from 'rn-placeholder';

class LeaveRequest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isLoadMore: false,
      data: [],
    };
  }

  componentDidMount() {
    this._resetState();
  }

  componentDidUpdate(prevProps) {
    const data = store.getMyRequestListData();
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
    store.setPaginationRequest(1);
    store.setEndOfPage(false);
    // clear before
    store.setMyRequestListData([]);
  }

  handleRefresh = () => {
    this._resetState();
    this.setState({isLoading: true});
    actions.getMyRequestList(
      this.props.user.nip,
      this.props.route.params.jns_kasuskode,
    );
  };

  handleLoadMore = () => {
    if (!this.state.isLoadMore && !this.props.isEndOfPage) {
      let page = store.getPaginationRequest();
      store.setPaginationRequest(page + 1);
      // this.handleRefresh()
      actions.getMyRequestList(
        this.props.user.nip,
        this.props.route.params.jns_kasuskode,
      );
      this.setState({isLoadMore: true});
    }
  };

  generateSkeleton() {
    return (
      <List>
        <ListItem>
          <Placeholder Animation={Shine} Left={PlaceholderMedia}>
            <PlaceholderLine width={60} />
            <PlaceholderLine width={95} />
            <PlaceholderLine width={95} />
          </Placeholder>
        </ListItem>
        <ListItem itemDivider />
      </List>
    );
  }

  generateList = (items) => {
    let list = items.item;
    let status =
      list.status.substr(0, 1).toUpperCase() +
      list.status.substr(1, list.status.length - 1);

    return (
      <TouchableOpacity>
        <List>
          <ListItem>
            <Left style={style.leftSide}>
              <Image
                source={IMAGE_STATUS_OBJ[status.toLowerCase()]}
                style={[styles.cardListImageItem, {width: 80, height: 80}]}
              />
              <Label
                style={[styles.cardTextTitle, {left: 10, fontWeight: 'bold'}]}>
                {list.nama_kasus ?? '-'}
              </Label>
            </Left>
            <Right>
              <Text style={styles.requestStatusLabel}>{status ?? '-'}</Text>
            </Right>
          </ListItem>
          <ListItem>
            <Left style={style.leftSide}>
              <Image
                source={require('assets/calendar.png')}
                style={styles.imageInputLabel}
              />
              <Text>Tanggal</Text>
            </Left>
            <Right>
              <Text>{list.tanggal ?? '-'}</Text>
            </Right>
          </ListItem>
          <ListItem style={{paddingBottom: 20}}>
            <Left style={{flexDirection: 'column'}}>
              <View style={[style.leftSide, {width: '100%'}]}>
                <Image
                  source={require('assets/purposetype.png')}
                  style={styles.imageInputLabel}
                />
                <Text>Tujuan</Text>
              </View>
              <Text
                style={{width: '100%', top: 10, color: '#1565c0', left: 20}}>
                {list.alasan ?? '-'}
              </Text>
            </Left>
            <Right>
              <Button
                success
                iconRight
                small
                style={{borderRadius: 5, width: 100}}
                onPress={() =>
                  this.props.navigation.push('MyRequestDetail', {
                    kso: list.kso_kasusnomor,
                  })
                }>
                <Text style={{fontSize: normalize(12)}}>Detail</Text>
                <Icon name="ios-arrow-forward" />
              </Button>
            </Right>
          </ListItem>
        </List>
        <ListItem itemDivider />
      </TouchableOpacity>
    );
  };

  render() {
    let {title, total} = this.props.route.params;
    let skeletonCount = [];
    for (var i = 0; i < total; i++) skeletonCount.push(i);

    return (
      <Container>
        <HeaderLayout title={title} navigation={this.props.navigation} />
        <FlatList
          data={this.props.data}
          renderItem={(item) => this.generateList(item)}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={true}
          initialNumToRender={10}
          ListEmptyComponent={
            <FlatList
              data={skeletonCount}
              renderItem={() => <this.generateSkeleton />}
              keyExtractor={(item, index) => index.toString()}
              showsVerticalScrollIndicator={false}
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
    user: UserStore.getUserData(),
    data: store.getMyRequestListData(),
    isEndOfPage: store.isEndOfPage(),
  };
}

export default connect(mapStateToProps)(LeaveRequest);
