import PushNotificationIOS from "@react-native-community/push-notification-ios";
import messaging from '@react-native-firebase/messaging';
import axios from "axios";
import React from 'react';
import { Dimensions, FlatList, Image, RefreshControl, Text, TouchableOpacity, View, ScrollView, Pressable } from 'react-native';
import PushNotification from "react-native-push-notification";
import { IcSpecial, IcStarOff, IcStarOn, ProfileDummy } from '../../../assets';
import { Button, EmptyOrderNurse, Gap, HomeProfile, HomeProfileNurse, Loading, ModalBasic, TextInput } from '../../../components';
import ModalCenter from "../../../components/molecules/ModalCenter";
import { endpoint } from '../../../config/API/service';
import { COLOR_BASE_PRIMARY_MAIN, COLOR_DANGER, COLOR_DONE, COLOR_NEW, COLOR_ORANGE, COLOR_RED, COLOR_SUCCESS, COLOR_WARNING } from "../../../styles";
import { getData, showMessage } from "../../../utils";
import styles from './styles';
import { PermissionsAndroid } from 'react-native';

export default class Component extends React.Component {
  constructor() {
    super();
    this.state = {
      title: '',
      token: '',
      userProfile: {},
      services: [],
      data: [],
      onProcess: [],
      isLoading: false,
      modalError: false,
      modalReject: false,
      idClick: '',
      note: '',
      arrRate2 : [1,2,3,4,5]
    }
  }

  async componentDidMount() {
    this._getDataUser()
    this._getData()
    this.requestLocationPermission()
    // this._getIncoming()
    // this._getService()
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this._getDataUser()
      this._getData()
      // this._getService()
      // this._getIncoming()
    });
    await this._getFcm()
    this.pushNotification = setupPushNotification(this._handleNotificationOpen)
  }

  componentWillUnmount() {
    PushNotification.cancelLocalNotification('133965423413');
  }

  async requestLocationPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the location")
      } else {
        console.log("location permission denied")
      }
    } catch (err) {
      console.warn(err)
    }
  }

  async _getFcm() {
    const fcmToken = await messaging().getToken();
    getData('token').then((resToken) => {
      if (fcmToken) {
        const data = new FormData()
        data.append("token", fcmToken)
        console.log('ini tokennya', fcmToken);
        axios.put(endpoint.fcm + fcmToken, data, {
          headers: {
            Authorization: resToken.value,
          },
        }).then(res => {
          // console.log("uploaded", res.data.data);
        }).catch((err) => {
          // console.log("uploaded", err.response);
          // showMessage('Terjadi kesalahan');
        });
      }
    });
  }

  _getDataUser() {
    getData('token').then((resToken) => {
      console.log('token', resToken)
      this.setState({ isLoading: true })
      axios.get(endpoint.user, {
        headers: {
          Authorization: resToken.value,
        },
      }).then(res => {
        const profile = res.data.data.user;
        this.setState({userProfile :  profile})
        storeData('userProfile', profile);
      }).catch((err) => {
        const status = err.response.status;
      });
    });
  }

  _getData() {
    getData('token').then((resToken) => {
      console.log('token', resToken)
      this.setState({ isLoading: true })
      axios.get(endpoint.order_income_by_status(1), {
        headers: {
          Authorization: resToken.value,
        },
      }).then(res => {
        this.setState({ isLoading: false })
        this.setState({ data: res.data.data.orders })
        // console.log("success", res.data.data);
      }).catch((err) => {
        const status = err?.response?.status;
        this.setState({ isLoading: false })
        // console.log("failed", err.response.status);
        // showMessage('Terjadi kesalahan'+ err.response.status);
        if (status == 401) {
          this.handleModalerror()
        }
      });
    });
  }

  _getIncoming() {
    getData('token').then((resToken) => {
      this.setState({ isLoading: true })
      axios.get(endpoint.order_ongoing, {
        headers: {
          Authorization: resToken.value,
        },
      }).then(res => {
        this.setState({ isLoading: false })
        this.setState({ onProcess: res.data.data.orders })
        console.log("success ongoing", res.data.data.orders);
      }).catch((err) => {
        const status = err.response.status;
        this.setState({ isLoading: false })
        // console.log("failed", err.response.status);
        // showMessage('Terjadi kesalahan'+ err.response.status);
        if (status == 401) {
          this.handleModalerror()
        } else {
          showMessage('Terjadi kesalahan' + err.response.message);
        }
      });
    });
  }


  _getService() {
    getData('token').then((resToken) => {
      this.setState({ isLoading: true })
      axios.get(endpoint.service, {
        headers: {
          Authorization: resToken.value,
        },
      }).then(res => {
        this.setState({ isLoading: false })
        this.setState({ services: res.data.data.services })
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



  _onAccept = async (id) => {
    const data = {
      status: 'CANCELLED',
    };
    getData('token').then((resToken) => {
      axios.put(endpoint.acceptOrder(id), data, {
        headers: {
          Authorization: resToken.value,
        },
      })
        .then((res) => {
          this._getData()
        })
        .catch((err) => {
          showMessage(
            `${err?.response?.data?.message}` ||
            'Terjadi Kesalahan di Cancel Order API',
          );
        });
    });
  }

  _onReject = async (id, note) => {
    const data = {
      status: 'CANCELLED',
    };
    getData('token').then((resToken) => {
      axios.put(endpoint.rejectOrder(id, note), data, {
        headers: {
          Authorization: resToken.value,
        },
      })
        .then((res) => {
          this._getData()
        })
        .catch((err) => {
          showMessage(
            `${err?.response?.data?.message}` ||
            'Terjadi Kesalahan di Cancel Order API',
          );
        });
    });
  }


  handleModalerror() {
    this.setState({ modalError: !this.state.modalError })
  }

  _handleNotificationOpen = (notification) => {
    const { navigate } = this.props.navigation
    this._getData()
    // if (notification.data.type == "created") {
    // navigate('OrderDetail', { id: notification.data.order_id })
    showMessage(notification.message, 1)
    // }
    // { 'id': notification.data.id }
  }

  signOut() {
    // const { navigate } = this.props.navigation
    this.setState({ modalError: false })
    // const { reset } = this.props.navigation
    // AsyncStorage.removeItem(['token'])
    // reset({ index: 0, routes: [{ name: 'SplashScreen' }] })
    // navigate('Profile')
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
          <Text style={styles.txtContent}>{item.nurseUser.name}</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={styles.txtDate}> {item.createdAt}</Text>
            <Text style={styles.status(item.statusColorBackground, item.statusColorForeground)}>{item.statusText}</Text>
          </View>
          {item.statusText == 'Selesai' &&
            <View style={{ flexDirection: 'row'}}>
              {this.state.arrRate2.map(obj => {
                return (
                  obj <= item.rate ?
                    <IcStarOn height={12}/>
                    :
                    <IcStarOff height={15} />
                )
              })}
            </View>
          }
        </View>
      </TouchableOpacity>
    )
  }

  ListService = (item) => {
    return (
      <TouchableOpacity activeOpacity={0.7} onPress={
        () => this.props.navigation.navigate('Nurse', { service: item })
      }>
        <View style={[styles.itemVertical]}>
          <Image source={{ uri: item.icon }} style={{ height: 50, width: 50 }} />
          <Text style={styles.txtItem}>{item.name}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    const { data, isLoading, services, onProcess } = this.state
    return (
      <View style={styles.page}>
        {this.state.isLoading && <Loading />}
        <ScrollView>
          <HomeProfileNurse />
          <View style={styles.containerBody}>
            {data.length >= 1 ?
              <View>
                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                  <Text style={styles.txtTitle}>Pesanan Baru</Text>
                  <Pressable onPress={() => {
                    this.props.navigation.reset({
                      index: 0,
                      routes: [{ name: 'Order' }]
                    })
                  }}>
                    <Text style={styles.txtAll}>Lihat Semua</Text>
                  </Pressable>
                </View>
                <FlatList
                  data={data}
                  numColumns={1}
                  renderItem={({ item }) => this.ListItem(item)}
                  showsHorizontalScrollIndicator={false}
                  showsVerticalScrollIndicator={false}
                  refreshControl={
                    <RefreshControl
                      refreshing={isLoading}
                      onRefresh={() => _getData()}
                    />
                  }
                />
                <Gap height={30} />
              </View>
              :
              <EmptyOrderNurse />
            }

          </View>
        </ScrollView >
        <ModalCenter
          visible={this.state.modalError}
          onError={true}
          navigation={this.props.navigation}
          btnText={"Login Kembali"}
        />

        <ModalCenter
          visible={this.state.modalReject}
          onError={false}
          content={
            <View style={{ width: 250 }}>
              <Text style={styles.txtItem}>Berikan alasan kenapa tidak dapat mengambil orderan?</Text>
              <TextInput
                onChangeText={(value) => { this.setState({ note: value }) }}
                multiline={true}
              />
            </View>
          }
          navigation={this.props.navigation}
          btnText={"Kirim"}
          onPressButton={() => { this.setState({ modalReject: false }), this._onReject(this.state.idClick, this.state.note) }}
        />

      </View >
    )
  }
}


export function setupPushNotification(handleNotification) {
  PushNotification.configure({ // (required) Called when a remote or local notification is opened or received
    onNotification: function (notification) {
      console.log('NOTIFICATION:', notification);

      // if (notification.foreground) {
      // if (notification.userInteraction) {
      console.log('NOTIFICATION touched:', notification);
      handleNotification(notification)
      // } else {
      //   console.log('NOTIFICATION foreground userInteraction:', notification.userInteraction);
      //   handleNotification(notification)
      // }
      // } 
      // else {
      //   if (notification.userInteraction) {
      //     console.log('NOTIFICATION touched:', notification);
      //     handleNotification(notification)
      //   } else {
      //     console.log('NOTIFICATION userInteraction:', notification.userInteraction);
      //     handleNotification(notification)
      //   }

      // }

      // required on iOS only (see fetchCompletionHandler docs: https://facebook.github.io/react-native/docs/pushnotificationios.html)
      notification.finish(PushNotificationIOS.FetchResult.NoData);
    },

    // ANDROID ONLY: GCM Sender ID (optional - not required for local notifications, but is need to receive remote push notifications)
    senderID: "133965423413",

    // IOS ONLY (optional): default: all - Permissions to register.
    permissions: {
      alert: true,
      badge: true,
      sound: true
    },

    // Should the initial notification be popped automatically
    // default: true
    popInitialNotification: true
  });

  return PushNotification
}
