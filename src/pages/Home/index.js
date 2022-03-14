import PushNotificationIOS from "@react-native-community/push-notification-ios";
import messaging from '@react-native-firebase/messaging';
import axios from "axios";
import React from 'react';
import { AppState, FlatList, Image, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { ScrollView } from "react-native-gesture-handler";
import PushNotification from "react-native-push-notification";
import { IcAccepted, IcReject } from '../../assets';
import { Gap, HomeProfile, Loading, ModalBottom } from '../../components';
import ModalCenter from "../../components/molecules/ModalCenter";
import { endpoint } from '../../config/API/service';
import { getData } from "../../utils";
import styles from './styles';


export default class Component extends React.Component {
  constructor() {
    super();
    this.state = {
      title: '',
      token: '',
      userProfile: {},
      data: [],
      onProcess: [],
      isLoading: false,
      modalError: false,
      id: '',
      modalNotif: false,
      hasUnpaidOrder: false,
      canOrder: true,
      appState: AppState.currentState
    }
  }

  async componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
      this._getDataUser()
      this._getData()
      this._getIncoming()
     this.props.navigation.addListener('focus', () => {
        this._getDataUser()
        this._getData()
        this._getIncoming()
      });
      await this._getFcm()
      this.pushNotification = setupPushNotification(this._handleNotificationOpen)
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
    PushNotification.cancelLocalNotification('133965423413');
  }

  _handleAppStateChange = async (nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      this._getDataUser()
      this._getData()
      this._getIncoming()
      this.props.navigation.addListener('focus', () => {
        this._getDataUser()
        this._getData()
        this._getIncoming()
      });
      await this._getFcm()
      this.pushNotification = setupPushNotification(this._handleNotificationOpen)
    }
    this.setState({ appState: nextAppState });
  }


  async _getFcm() {
    const fcmToken = await messaging().getToken();
    getData('token').then((resToken) => {
      if (fcmToken) {
        const data = new FormData()
        data.append("fcm_token", fcmToken)
        axios.put(endpoint.fcm, data, {
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

  _getDataUser = () => {
    getData('token').then((resToken) => {
      console.log('token', resToken)
      this.setState({ isLoading: true })
      axios.get(endpoint.user, {
        headers: {
          Authorization: resToken.value,
        },
      }).then(res => {
        const profile = res.data.data.user;
        storeData('userProfile', profile);
        this.setState({ userProfile: res.data.data.user })
      }).catch((err) => {
        // const status = err.response.status;
        // console.log('error', err.response)
      });
    });
  }

  _getData = () => {
    getData('token').then((resToken) => {
      // console.log('profile', this.state.userProfile)
      this.setState({ isLoading: true })
      axios.get(endpoint.service, {
        headers: {
          Authorization: resToken.value,
        },
      }).then(res => {
        this.setState({ isLoading: false })
        this.setState({ hasUnpaidOrder: this.state.userProfile.hasUnpaidOrder })
        this.setState({ data: res.data.data.services })
      }).catch((err) => {
        const status = err.response.status;
        this.setState({ isLoading: false })
        if (status == 401) {
          this.handleModalerror()
        }
      });
    });
  }

  checkAge(order) {
    return order.status < 6
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
        if (res.data.data.orders.find(this.checkAge) != null) {
          this.setState({ canOrder: false })
        } else {
          this.setState({ canOrder: true })
        }
      }).catch((err) => {
        const status = err.response.status;
        this.setState({ isLoading: false })
      });
    });
  }


  handleModalerror() {
    this.setState({ modalError: !this.state.modalError })
  }

  _handleNotificationOpen = (notification) => {
    const { navigate } = this.props.navigation
    console.log("notification", notification)

    if (notification.data.type == "accepted") {
      // showMessage("Pesanan anda diterima", 1)
      if (notification.foreground)
        this.setState({ modalNotif: true, msgTitleNotif: "Order Disetujui!", msgNotif: notification.message, id: notification.data.order_id })
      else
        navigate('OrderDetail', { id: notification.data.order_id })
    } else if (notification.data.type == "rejected") {
      // showMessage("Pesanan anda ditolak", 0)

      if (notification.foreground)
        this.setState({ modalNotif: true, msgTitleNotif: "Order Ditolak!", msgNotif: notification.message, id: notification.data.order_id })
      else
        navigate('OrderDetail', { id: notification.data.order_id })
    } else if (notification.data.type == "assigned") {
      if (notification.userInteraction) {
        navigate('OrderDetail', { id: notification.data.order_id })
      } else {
        this.props.navigation.reset({
          index: 0,
          routes: [
            {
              name: 'SuccessPaid',
              params: {
                msg: notification.message,
                type: notification.data.type
              }
            }
          ]
        });
      }
    } else if (notification.data.type == "paid") {
      if (notification.userInteraction) {
        navigate('OrderDetail', { id: notification.data.order_id })
      } else {
        this.props.navigation.reset({
          index: 0,
          routes: [
            {
              name: 'SuccessPaid',
              params: {
                msg: notification.message,
                type: notification.data.type
              }
            }
          ]
        });
      }
    }
    // { 'id': notification.data.id }
  }

  ListItem = (item) => {
    return (
      <TouchableOpacity activeOpacity={0.7} onPress={
        () => {
          this.state.canOrder ?
            this.props.navigation.navigate('SetOrder', { 'service': item, 'userProfile': this.state.userProfile })
            :
            ToastAndroid.showWithGravity('Kamu memiliki pesananan yang belum dibayar', ToastAndroid.SHORT, ToastAndroid.BOTTOM)
        }
      }>
        <View style={[styles.itemVertical]}>
          <Image source={{ uri: item.icon }} style={{ height: 50, width: 50 }} />
          <Text style={styles.txtItem}>{item.name}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  ListOrder = (item) => {
    return (
      <TouchableOpacity
        onPress={
          () => { this.props.navigation.navigate('OrderDetail', { id: item.id }) }
        }
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
    )
  }

  render() {
    const { data, onProcess } = this.state
    return (
      <View style={styles.page}>
        {this.state.isLoading && <Loading />}
        <ScrollView>
          <HomeProfile />
          <View style={styles.containerBody}>
            {onProcess.length >= 1 &&
              <View>
                <Text style={styles.txtTitle}>Sedang Berlangsung  </Text>
                <FlatList
                  data={onProcess}
                  numColumns={1}
                  renderItem={({ item }) => this.ListOrder(item)}
                  showsHorizontalScrollIndicator={false}
                  showsVerticalScrollIndicator={false}
                />
                <Gap height={40} />
              </View>
            }
            <Text style={styles.txtTitle}>Jelajahi berdasarkan kategori</Text>
            <FlatList
              data={data}
              numColumns={3}
              renderItem={({ item }) => this.ListItem(item)}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}

            />
          </View>
        </ScrollView>
        <ModalCenter
          visible={this.state.modalError}
          onError={true}
          navigation={this.props.navigation}
          btnText={"Login Kembali"}
        />

        <ModalBottom
          visible={this.state.modalNotif}
          onError={false}
          content={
            <View style={{ margin: 10 }}>
              <View>
                <View style={{ alignSelf: 'center' }}>
                  {this.state.msgTitleNotif == "Order Disetujui!" ?
                    <IcAccepted />
                    :
                    <IcReject />
                  }
                </View>
                <Gap height={20} />
                <Text style={styles.txtTitleModal}>{this.state.msgTitleNotif}</Text>
                <Text style={styles.txtContent}>{this.state.msgNotif}</Text>
              </View>
            </View>
          }
          btnText={this.state.msgTitleNotif == "Order Disetujui!" ? "Lihat Pesanan Saya" : "Pesan lagi"}
          onPressButton={() => {
            this.setState({ modalNotif: false }),
              this.state.msgTitleNotif == "Order Disetujui!" && this.props.navigation.navigate('OrderDetail', { id: this.state.id })
          }}
        />

      </View>
    )
  }
}


export function setupPushNotification(handleNotification) {
  PushNotification.configure({ // (required) Called when a remote or local notification is opened or received
    onNotification: function (notification) {

      // if (notification.foreground) {
      // if (notification.userInteraction) {
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
    popInitialNotification: true,
    requestPermissions: true,
    playSound : true,
    sound : "default",
    priority : 'high',
    importance : 'high',
    vibrate : true,
    vibration : 5,
  });

  return PushNotification
}
