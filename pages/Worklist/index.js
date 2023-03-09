import React, { Component } from 'react';
import { connect } from 'remx';
import style from '../../styles';
import HeaderLayout from '../HeaderLayout';
import { store } from '../../remx/Service/store';
import * as UserAction from '../../remx/User/actions';
import {
  Container,
  Text,
  Card,
  CardItem,
  Left,
  Right,
  Badge,
  View,
} from 'native-base';
import { Image, TouchableOpacity, Dimensions, FlatList } from 'react-native';
import NotFound from "../NotFound";

class WorklistIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    UserAction.checkSession();
  }

  generateList = items => {
    const list = items.item;
    return (
      <Card style={style.cardListItem}>
        <CardItem>
          <TouchableOpacity
            style={{ flexDirection: 'row' }}
            onPress={() =>
              this.props.navigation.push('WorklistList', {
                title: list.nama_kasus,
                jns_kasuskode: list.jnk_jeniskasuskode,
              })
            }>
            <Image
              source={require('assets/file.png')}
              style={style.cardListImageItem}
            />
            <Left>
              <Text style={style.cardTextTitle}>{list.nama_kasus}</Text>
            </Left>
            <Right>
              <Badge>
                <Text>{list.total}</Text>
              </Badge>
            </Right>
          </TouchableOpacity>
        </CardItem>
      </Card>
    );
  };

  render() {
    let { data } = this.props;

    return (
      <Container>
        <HeaderLayout title="Worklist" navigation={this.props.navigation} />
        <View>
          <FlatList
            data={data}
            renderItem={item => this.generateList(item)}
            keyExtractor={(item, index) => index.toString()}
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
    data: store.getTodoListData(),
  };
}

export default connect(mapStateToProps)(WorklistIndex);
