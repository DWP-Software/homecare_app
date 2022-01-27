import axios from 'axios';
import React from 'react';
import { Dimensions, FlatList, Image, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import { IcSpecial, ProfileDummy } from '../../assets';
import { Button, EmptyOrder, Header, Loading, ModalCenter, OrderTabSection } from '../../components';
import { endpoint } from '../../config/API/service';
import { COLOR_BASE_PRIMARY_MAIN, COLOR_DANGER, COLOR_DONE, COLOR_NEW, COLOR_ORANGE, COLOR_RED, COLOR_SUCCESS, COLOR_WARNING } from '../../styles';
import { getData } from '../../utils';
import styles from './styles';

export default class Component extends React.Component {
  constructor() {
    super();
    this.state = {
      title: '',
      data: [],
      dataNurse : [],
      isLoading: false,
      userProfile: {},
      modalError: false,
    }
  }

  componentDidMount() {
    this._getUserProfile()
    this._getOrder()
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this._getUserProfile()
      this._getOrder()
    });
  }

  _getUserProfile() {
    getData('userProfile').then((res) => {
      this.setState({ userProfile: res })
    })
  }

  _getOrder() {
    getData('token').then((resToken) => {
      this.setState({ isLoading: true })
      axios.get(this.state.userProfile.isNurse ? endpoint.order_income : endpoint.order, {
        headers: {
          Authorization: resToken.value,
        },
      }).then(res => {
        this.setState({ isLoading: false })
        this.setState({ data: res.data.data.orders })
        // console.log("success", res.data.data.orders);
        console.log("token", resToken.value);
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
          () => this.props.navigation.navigate('OrderDetail', { id: item.id })}
      >
        <View style={styles.conterItem}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={styles.txtName}>{item.orderServices[0].service.name}</Text>
            <Text style={styles.txtPrice}>{item.orderServices[0].quantity} {item.orderServices[0].service.base_unit}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={styles.txtDate}> {item.createdAt}</Text>
            <Text style={styles.status(item.statusColorBackground, item.statusColorForeground)}>{item.statusText}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    const { data, isLoading, userProfile } = this.state
    return (
      <View style={styles.page}>
        <View style={styles.content}>
          <Header title={userProfile.isNurse ? "Riwayat Pesanan Masuk" : "Riwayat Pesanan"} />
          {isLoading && <Loading />}
            {data.length < 1 ? (
              <EmptyOrder />
            ) : (
              <View style={styles.tabContainer}>
                <FlatList
                  data={data}
                  renderItem={({ item }) => this.ListItem(item)}
                  showsHorizontalScrollIndicator={false}
                  showsVerticalScrollIndicator={false}
                  refreshControl={
                    <RefreshControl
                      refreshing={isLoading}
                      onRefresh={() => this._getData()}
                    />
                  }
                />
              </View>
            )}
        </View>
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

