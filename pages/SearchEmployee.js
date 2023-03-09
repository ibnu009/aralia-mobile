import React, {Component} from 'react';
import styles from '../styles';
import {store} from '../remx/Service/store';
import {encode} from 'base-64';
import {REST_URL, HEADERS_CONFIG} from '../AppConfig';
import {TouchableOpacity, Platform, View, FlatList} from 'react-native';

import {
  Container,
  Item,
  Text,
  Icon,
  Header,
  List,
  ListItem,
  Thumbnail,
  Left,
  Body,
  Right,
  Input,
} from 'native-base';

import {
  Placeholder,
  Shine,
  PlaceholderMedia,
  PlaceholderLine,
} from 'rn-placeholder';

export default class SearchEmployee extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nip: '',
      searchQuery: '',
      data: [],
      isLoading: false,
    };
  }

  submitButton = () => {
    if (this.state.searchQuery == '') return false;

    let uri = `${REST_URL}/rest/?method=caripegawai&format=json&query=${this.state.searchQuery}`;
    if (this.props.route.params) {
      uri += `&nip=${this.props.route.params.nip}`;
    }
    this.setState({isLoading: true, data: []});
    fetch(uri, HEADERS_CONFIG)
      .then((response) => response.json())
      .then((responseJSON) => {
        // console.log(responseJSON.data)
        this.setState({data: responseJSON.data, isLoading: false});
      });
  };

  resetSearchQuery = () => {
    if (this.state.searchQuery != '') {
      this.setState({searchQuery: '', data: []});
    }
  };

  presed(e) {
    if (this.props.route.params) {
      store.setSelectedPeg(e);
      this.props.navigation.goBack();
    } else {
      this.props.navigation.push('EmployeeInfo', {data: e});
    }
  }

  loadingComponent() {
    const component = (
      <ListItem>
        <Placeholder Animation={Shine} Left={PlaceholderMedia}>
          <PlaceholderLine width={70} height={15} />
          <PlaceholderLine width={25} height={15} />
        </Placeholder>
      </ListItem>
    );

    return (
      <FlatList
        data={[0, 1, 2, 3]}
        keyExtractor={(item, index) => index.toString()}
        renderItem={() => component}
        showsVerticalScrollIndicator={false}
      />
    );
  }

  generateItems = (items) => {
    let list = items.item;
    return (
      <ListItem avatar>
        <TouchableOpacity
          style={{flexDirection: 'row'}}
          onPress={() => this.presed(list)}>
          <Left>
            <Thumbnail source={{uri: list.picture}} />
          </Left>
          <Body>
            <Text>{list.nm_peg}</Text>
            <Text note>{list.nip}</Text>
          </Body>
          <Right>
            <Icon name="ios-arrow-forward" style={{top: 15}} />
          </Right>
        </TouchableOpacity>
      </ListItem>
    );
  };

  render() {
    const me = this;

    return (
      <Container>
        <Header
          searchBar
          rounded
          style={[styles.statusbar, {height: 80, paddingTop: 20}]}
          androidStatusBarColor={styles.statusbarAccent.backgroundColor}
          iosBarStyle="light-content">
          <TouchableOpacity
            onPress={() => this.props.navigation.goBack()}
            style={{width: 20}}>
            <Icon
              active
              name="ios-arrow-back"
              style={{color: '#fff', top: 15, left: 2}}
            />
          </TouchableOpacity>
          <Item>
            <Icon name="search" />
            <Input
              placeholder="Ketik sesuatu.."
              value={this.state.searchQuery}
              onChangeText={(text) => this.setState({searchQuery: text})}
              onSubmitEditing={this.submitButton}
            />
            <Icon
              name={this.state.searchQuery != '' ? 'close' : 'people'}
              onPress={() => this.resetSearchQuery()}
            />
          </Item>
        </Header>
        <View>
          {/* search result */}
          <List>
            {this.state.isLoading && <this.loadingComponent />}
            <FlatList
              data={this.state.data}
              keyExtractor={(item, index) => `hasil-${index}`}
              renderItem={(items) => this.generateItems(items)}
              showsVerticalScrollIndicator={false}
              initialNumToRender={10}
            />
          </List>
        </View>
      </Container>
    );
  }
}
