import React, {Component} from 'react';
import styles from '../styles';
import {store} from '../remx/Service/store';
import {REST_URL, HEADERS_CONFIG} from '../AppConfig';
import {TouchableOpacity, ActivityIndicator} from 'react-native';

import {
  Container,
  Content,
  Item,
  Text,
  Icon,
  Header,
  List,
  ListItem,
  Body,
  Right,
  Input,
} from 'native-base';

export default class SearchEmployee extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      nip: '',
      searchQuery: '',
      data: [],
      isLoading: false,
    };
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  submitButton = () => {
    if (this.state.searchQuery == '') return false;

    const uri = `${REST_URL}/rest/?method=carikota&format=json&query=${this.state.searchQuery}`;
    this.setState({isLoading: true, data: []});
    fetch(uri, HEADERS_CONFIG)
      .then((response) => response.json())
      .then((res) => {
        this.setState({data: res.data, isLoading: false});
      })
      .catch((err) => {
        Toast.show({
          text: `Error: ${err}`,
          type: 'danger',
        });
      });
  };

  resetSearchQuery = () => {
    if (this.state.searchQuery != '') {
      this.setState({searchQuery: '', data: []});
    }
  };

  presed(e) {
    const type = this.props.route.params.target;
    const {navigate} = this.props.navigation;

    if (type == 'origin') {
      store.setSelectedCity({origin: e});
      this.props.navigation.goBack();
    } else if (type == 'destination') {
      store.setSelectedCity({destination: e});
      this.props.navigation.goBack();
    }
  }

  render() {
    return (
      <Container>
        <Header
          searchBar
          rounded
          style={styles.statusbar}
          androidStatusBarColor={styles.statusbarAccent.backgroundColor}>
          <TouchableOpacity
            onPress={() => this.props.navigation.goBack()}
            style={{width: 20}}>
            <Icon
              active
              name="ios-arrow-back"
              style={{color: '#fff', top: 15}}
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
              name={this.state.searchQuery != '' ? 'close' : 'home'}
              onPress={() => this.resetSearchQuery()}
            />
          </Item>
        </Header>
        <Content>
          {/* search result */}
          {this.state.isLoading && (
            <ActivityIndicator
              size="large"
              style={styles.loading}
              color={styles.loading.color}
            />
          )}
          <List>
            {this.state.data.map((e, i) => {
              return (
                <ListItem avatar key={i}>
                  <TouchableOpacity
                    style={{flexDirection: 'row'}}
                    onPress={() => this.presed(e.kota)}>
                    <Body>
                      <Text>{e.kota}</Text>
                    </Body>
                    <Right>
                      <Icon name="ios-arrow-forward" style={{top: 15}} />
                    </Right>
                  </TouchableOpacity>
                </ListItem>
              );
            })}
          </List>
        </Content>
      </Container>
    );
  }
}
