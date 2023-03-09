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
  Thumbnail,
  Left,
  Body,
  Right,
  Input,
} from 'native-base';

export default class SearchPosisi extends Component {
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

    const uri = `${REST_URL}/penambahan_pegawai/posisi.php?format=json&query=${this.state.searchQuery}`;
    console.log(uri);
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
    const select = this.props.route.params.select;
    const {navigate} = this.props.navigation;

    if (select) {
      store.setSelectedPosisi(e);
      this.props.navigation.goBack();
    } else {
      navigate('SearchPosisi', {data: e});
    }
  }

  render() {
    return (
      <Container>
        <Header
          searchBar
          rounded
          style={{backgroundColor: '#0c342e'}}
          androidStatusBarColor="#0c342e">
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
                    onPress={() => this.presed(e)}>
                    <Body>
                      <Text>{e.posisi}</Text>
                    </Body>
                    <Right>
                      <Icon name="ios-arrow-forward" style={{top: 0}} />
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
