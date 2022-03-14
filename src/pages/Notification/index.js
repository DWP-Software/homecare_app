import axios from 'axios';
import React from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { IcBullet, IcSpecial, ProfileDummy } from '../../assets';
import { Button, EmptyOrder, EmptyNotif, Header, Loading, ModalCenter } from '../../components';
import { endpoint } from '../../config/API/service';
import { COLOR_SHADOW, FONT_REGULAR } from '../../styles';
import { getData } from '../../utils';
import styles from './styles';

export default class Component extends React.Component {
  constructor() {
    super();
    this.state = {
      title: '',
      data: [],
      isLoading: false,
      modalError: false,
    }
  }

  async componentDidMount() {
    this._getData()
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this._getData()
    });
  }

  _getData() {
    getData('token').then((resToken) => {
      this.setState({ isLoading: true })
      axios.get(endpoint.activity, {
        headers: {
          Authorization: resToken.value,
        },
      }).then(res => {
        this.setState({ isLoading: false })
        this.setState({ data: res.data.data.activities })
        // console.log("success", res.data.data);
      }).catch((err) => {
        const status = err.response.status;
        this.setState({ isLoading: false })
        // console.log("failed", err.response.status);
        // showMessage('Terjadi kesalahan'+ err.response.status);
        if (status == 401) {
          this.handleModalerror()
        }
      });
    });
  }


  handleModalerror() {
    this.setState({ modalError: !this.state.modalError })
  }

  ListItem = (item) => {
    return (
      <TouchableOpacity
        onPress={
          () => this.props.navigation.navigate('OrderDetail', { 'id': item.order_id })}
      >
        <View style={styles.itemVertical}>
          <View style={{ marginTop: 7 }}>
            <IcBullet />
          </View>
          <Text style={styles.txtItem}>{item.description}</Text>
        </View>
        <Text style={{ fontSize: 12, fontFamily: FONT_REGULAR, alignSelf: 'flex-end' }}>{item.datetime}</Text>
        <View style={{ borderWidth: 0.5, borderColor: COLOR_SHADOW }} />
      </TouchableOpacity>
    );
  };

  render() {
    const { data } = this.state
    return (
      <View style={styles.page}>
        {this.state.isLoading && <Loading />}
        {data.length < 1 ? (
          <EmptyNotif />
        ) : (
          <View style={styles.content}>
            <Header title="Pemberitahuan" />
            <View style={styles.tabContainer}>
              <FlatList
                data={data}
                renderItem={({ item }) => this.ListItem(item)}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
              />
            </View>
          </View>
        )}

        <ModalCenter
          visible={this.state.modalError}
          onError={true}
          navigation={this.props.navigation}
          btnText={"Login Kembali"}
        />

      </View>
    )
  }
}

