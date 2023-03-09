import React, {Component} from 'react';
import {connect} from 'remx';
import styles from '../../styles';
import {store} from '../../remx/Service/store';
import * as action from '../../remx/Service/actions';
import * as UserAction from '../../remx/User/actions';
import {store as UserStore} from '../../remx/User/store';
import NotFound from '../NotFound';
import {
  Container,
  Text,
  Card,
  CardItem,
  Left,
  Right,
  Label,
  Badge,
} from 'native-base';

import {
  Image,
  TouchableOpacity,
  RefreshControl,
  View,
  Dimensions,
  FlatList,
} from 'react-native';

class TabRequest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
    };
  }

  componentDidMount() {
    // UserAction.checkSession();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.data != store.getMyRequestData()) {
      this.setState({refreshing: false});
    }
  }

  doRefresh = () => {
    this.setState({refreshing: true});
    store.setMyRequestData([]);
    action.getMyRequest(this.props.user.nip);
    store.getMyRequestData();
  };

  generateCardItem = (items) => {
    const list = items.item;
    return (
      <Card style={styles.cardListItem}>
        <CardItem>
          <TouchableOpacity
            style={{flexDirection: 'row'}}
            onPress={() =>
              this.props.navigation.push('MyRequestList', {
                title: list.nama_kasus,
                jns_kasuskode: list.jnk_jeniskasuskode,
                total: list.total,
              })
            }>
            <Image
              source={require('assets/file.png')}
              style={styles.cardListImageItem}
            />
            <Left>
              <Text style={styles.cardTextTitle}>{list.nama_kasus}</Text>
            </Left>
            <Right>
              <Badge>
                <Text style={{top: 2}}>{list.total}</Text>
              </Badge>
            </Right>
          </TouchableOpacity>
        </CardItem>
      </Card>
    );
  };

  render() {
    let {data} = this.props;

    return (
      <Container>
        <View
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.doRefresh}
              title="Loading..."
            />
          }>
          <FlatList
            data={data}
            renderItem={(item) => this.generateCardItem(item)}
            keyExtractor={(item, index) => `card-${index}`}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <NotFound marginTop={Dimensions.get('screen').height * 0.3} />
            }
          />
        </View>
      </Container>
    );
  }
}

function mapStateToProps() {
  return {
    data: store.getMyRequestData(),
    featureData: store.getFeatureData(),
    user: UserStore.getUserData(),
  };
}

export default connect(mapStateToProps)(TabRequest);
