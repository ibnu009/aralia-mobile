import React from 'react';
import {connect} from 'remx';
import HeaderLayout from '../HeaderLayout';
import styles, {normalize} from '../../styles';
import * as actions from '../../remx/Service/actions';
import {store} from '../../remx/Service/store';
import {store as UserStore} from '../../remx/User/store';
import {
  Image,
  View,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';

import {
  Container,
  Card,
  List,
  ListItem,
  Left,
  Thumbnail,
  Body,
  Text,
  Label,
  Right,
  Button,
  Icon,
} from 'native-base';

class EmployeeRequestList extends React.Component {
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
    let list = items.items;
    let {title} = this.props.route.params;
    return (
      <List>
        <ListItem avatar>
          <Left>
            <Thumbnail
              source={
                list.img ? {uri: list.img} : require('assets/default.png')
              }
            />
          </Left>
          <Body>
            <Text>{list.nm_peg ?? '-'}</Text>
            <Text note>
              {list.nip ?? '-'} | {list.nm_kantor ?? '-'}
            </Text>
          </Body>
        </ListItem>
        <ListItem>
          <Left style={{flexDirection: 'column'}}>
            <Card
              transparent
              style={{
                flexDirection: 'row',
                marginTop: 0,
                marginBottom: 0,
              }}>
              <Image
                source={require('assets/calendar.png')}
                style={styles.imageInputLabel}
              />
              <Label style={{top: 3}}>Tanggal Dibutuhkan</Label>
            </Card>
            <Text
              style={{
                width: '100%',
                left: 30,
                color: '#1274ce',
                fontStyle: 'italic',
              }}>
              {list.tanggal_dibutuhkan ?? '-'}
            </Text>
          </Left>
          <Right>{}</Right>
        </ListItem>
        <ListItem>
          <Left style={{flexDirection: 'column'}}>
            <Card
              transparent
              style={{
                flexDirection: 'row',
                marginTop: 0,
                marginBottom: 0,
              }}>
              <Image
                source={require('assets/calendar.png')}
                style={styles.imageInputLabel}
              />
              <Label style={{top: 3}}>Jumlah</Label>
            </Card>
            <Text
              style={{
                width: '100%',
                left: 30,
                color: '#1274ce',
                fontStyle: 'italic',
              }}>
              {list.jumlah ?? '-'}
            </Text>
          </Left>
          <Right>{}</Right>
        </ListItem>
        <ListItem last>
          <Left style={{flexDirection: 'column'}}>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 0,
                marginBottom: 0,
              }}>
              <Image
                source={require('assets/calendar.png')}
                style={styles.imageInputLabel}
              />
              <Label style={{top: 5, left: 5}}>Nama Jabatan</Label>
            </View>
            <Text
              style={{
                width: '100%',
                left: 30,
                color: '#1274ce',
                fontStyle: 'italic',
              }}>
              {list.posisi ?? '-'}
            </Text>
          </Left>
          <Right>
            <Button
              success
              iconRight
              small
              style={{borderRadius: 5}}
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

function mapStateToProps() {
  return {
    data: store.getWorklistData(),
    user: UserStore.getUserData(),
    isEndOfPage: store.isEndOfPage(),
  };
}

export default connect(mapStateToProps)(EmployeeRequestList);
