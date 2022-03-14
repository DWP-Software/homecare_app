import Axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { AppState, Dimensions, Image, Modal, Pressable, ScrollView, StyleSheet, Text, ToastAndroid, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import WebView from 'react-native-webview';
import { IcBack, IcMin, IcStarOff, IcStarOn, ProfileDummy } from '../../assets';
import { Button, ButtonDouble, Gap, Header, ItemListFood, ItemValue, Loading, ModalBottom, ModalCenter, TextInput } from '../../components';
import ModalConfirm from '../../components/molecules/ModalConfirm';
import { API_HOST } from '../../config';
import { endpoint } from '../../config/API/service';
import { setLoading } from '../../redux/action';
import { COLOR_BASE_PRIMARY_DARK, COLOR_BASE_PRIMARY_MAIN, COLOR_BASE_PRIMARY_TEXT, COLOR_BASE_SECOND_TEXT, COLOR_DANGER, COLOR_DONE, COLOR_NEW, COLOR_RED, COLOR_SHADOW, COLOR_SUCCESS, COLOR_WARNING, FONT_BOLD, FONT_LIGHT, FONT_MEDIUM, FONT_REGULAR } from '../../styles';
import { getData, showMessage } from '../../utils';

const OrderDetail = ({ route, navigation }) => {
  const id = route.params.id;
  const prev = route.params.prev

  const [userProfile, setUserProfile] = useState({})
  const [modalConfirm, setModalConfirm] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [modalError, setmodalError] = useState(false)
  const [isLoading, setisLoading] = useState(false)
  const [rate, setRate] = useState(0)
  const [arrRate, setArrRate] = useState([{ id: 1, cickk: false }, { id: 2, cickk: false }, { id: 3, cickk: false }, { id: 4, cickk: false }, { id: 5, cickk: false }])
  const [arrRate2, setArrRate2] = useState([1, 2, 3, 4, 5])
  const [modalRate, setModalRate] = useState(false);
  const [modalReject, setModalReject] = useState(false)
  const [report, setReport] = useState('')
  const [idClick, setIdClick] = useState('')
  const [note, setNote] = useState('')
  const [paymentURL, setPaymentURL] = useState('');
  const [midtransId, setMidtransId] = useState('')
  const [item, setItem] = useState({
    nurseUser: {},
    user: {},
    orderServices: []
  })

  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const [inputs, setInputs] = useState([{ key: '', value: '' }]);
  const [modalResult, setModalResult] = useState(false)

  useEffect(() => {
    get_detail()
    _getUserProfile()
    AppState.addEventListener("change", nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        console.log("App has come to the foreground!");
        get_detail()
        _getUserProfile()
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      console.log("AppState", appState.current);


    });
  }, []);

  // useEffect(() => {
  //   const subscription = AppState.addEventListener("change", nextAppState => {
  //     if (
  //       appState.current.match(/inactive|background/) &&
  //       nextAppState === "active"
  //     ) {
  //       console.log("App has come to the foreground!");
  //       get_detail()
  //       _getUserProfile()

  //     }

  //     appState.current = nextAppState;
  //     setAppStateVisible(appState.current);
  //     console.log("AppState", appState.current);

  //     get_detail()
  //     _getUserProfile()

  //     // navigation.addListener('focus', () => {
  //     //   get_detail()
  //     //   _getUserProfile()
  //     // });

  //   });

  // return () => {
  //   subscription.remove();
  // };
  // }, []);

  const _getUserProfile = () => {
    getData('userProfile').then((res) => {
      setUserProfile(res)
    })
  }

  const onRate = (id) => {
    setRate(id)
    if (id == 5) {
      setArrRate([{ id: 1, cickk: true }, { id: 2, cickk: true }, { id: 3, cickk: true }, { id: 4, cickk: true }, { id: 5, cickk: true }])
    } else if (id == 4) {
      setArrRate([{ id: 1, cickk: true }, { id: 2, cickk: true }, { id: 3, cickk: true }, { id: 4, cickk: true }, { id: 5, cickk: false }])
    } else if (id == 3) {
      setArrRate([{ id: 1, cickk: true }, { id: 2, cickk: true }, { id: 3, cickk: true }, { id: 4, cickk: false }, { id: 5, cickk: false }])
    } else if (id == 2) {
      setArrRate([{ id: 1, cickk: true }, { id: 2, cickk: true }, { id: 3, cickk: false }, { id: 4, cickk: false }, { id: 5, cickk: false }])
    } else if (id == 1) {
      setArrRate([{ id: 1, cickk: true }, { id: 2, cickk: false }, { id: 3, cickk: false }, { id: 4, cickk: false }, { id: 5, cickk: false }])
    }
  }

  const handleModalerror = () => {
    setmodalError(!modalError)
  }

  const get_detail = () => {
    setisLoading(true)
    getData('token').then((resToken) => {
      Axios.get(endpoint.order_detail(id), {
        headers: {
          Authorization: resToken.value,
        },
      })
        .then((res) => {
          console.log("data",res.data.data.order )
          setItem(res.data.data.order)
          setisLoading(false)
        })
        .catch((err) => {
          const status = err?.response?.status
          setisLoading(false)
          if (status == 401)
            handleModalerror()
          else {
            showMessage(
              `${err?.response?.data?.message}`,
            );
          }
        });
    });
  }

  const _onAccept = async (id) => {
    const data = {
      status: 'CANCELLED',
    };
    getData('token').then((resToken) => {
      Axios.put(endpoint.acceptOrder(id), data, {
        headers: {
          Authorization: resToken.value,
        },
      })
        .then((res) => {
          get_detail()
        })
        .catch((err) => {
          const status = err?.response?.status
          setisLoading(false)
          if (status == 401)
            handleModalerror()
          else {
            showMessage(
              `${err?.response?.data?.message}`,
            );
          }
        });
    });
  }

  const onCancel = () => {
    setModalConfirm(!modalConfirm)
    setisLoading(true)
    const data = {
      status: 'CANCELLED',
    };
    getData('token').then((resToken) => {
      Axios.put(endpoint.cancelOrder(id), data, {
        headers: {
          Authorization: resToken.value,
        },
      })
        .then((res) => {
          console.log('cancel', res.data.data.order)
          setItem(res.data.data.order)
          setisLoading(false)
        })
        .catch((err) => {
          setisLoading(false)
          const status = err?.response?.status
          if (status == 401)
            handleModalerror()
          else {
            console.log(err.response.data)
            get_detail()
            showMessage(
              `${err?.response?.data?.message}`,
            );
          }
        });
    });
  };

  const onDone = () => {
    console.log('rate', rate)
    const data = {
      'rate': rate,
    };
    setisLoading(true)
    getData('token').then((resToken) => {
      Axios.put(endpoint.doneOrder(id), data, {
        headers: {
          Authorization: resToken.value,
        },
      })
        .then((res) => {
          setisLoading(false)
          setModalRate(!modalRate)
          showMessage('Terimakasih Atas penilaian anda', 1);
          get_detail()
        })
        .catch((err) => {
          setisLoading(false)
          setModalRate(!modalRate)
          console.log('err', err)
          const status = err?.response?.status
          if (status == 401)
            handleModalerror()
          else {
            showMessage(
              `${err?.response?.data?.message}`,
            );
          }
        });
    });
  };

  const onPayment = () => {
    const data = {
      status: 'CANCELLED',
    };
    getData('token').then((resToken) => {
      Axios.put(endpoint.checkout(id), data, {
        headers: {
          Authorization: resToken.value,
        },
      })
        .then((res) => {
          let url = res.data.data.order.midtrans_payment_url
          console.log("url", res.data.data.order)
          setIsPaymentOpen(true)
          setPaymentURL(url)
          setMidtransId(res.data.data.order.midtrans_payment_token)
        })
        .catch((err) => {
          const status = err?.response?.status
          if (status == 401)
            handleModalerror()
          else {
            showMessage(
              `${err?.response?.data?.message}`,
            );
          }
        });
    });
  };

  const _onReject = async (id, note) => {
    const data = {
      rejection_note: note,
    };
    getData('token').then((resToken) => {
      Axios.put(endpoint.rejectOrder(id), data, {
        headers: {
          Authorization: resToken.value,
        },
      })
        .then((res) => {
          get_detail()
        })
        .catch((err) => {
          const status = err?.response?.status
          if (status == 401)
            handleModalerror()
          else {
            showMessage(
              `${err?.response?.data?.message}`,
            );
          }
        });
    });
  }


  const sendReport = async (id) => {
    const data = {
      report: report,
    };
    getData('token').then((resToken) => {
      Axios.put(endpoint.report(id), data, {
        headers: {
          Authorization: resToken.value,
        },
      })
        .then((res) => {
          get_detail()
        })
        .catch((err) => {
          const status = err?.response?.status
          setisLoading(false)
          if (status == 401)
            handleModalerror()
          else {
            showMessage(
              `${err?.response?.data?.message}`,
            );
          }
        });
    });
  }


  const onNavChange = (state) => {
    // TODO: Use This For Production
    const urlSuccess = "http://example.com/"
    let endpoint = state.url.split(/[\\?/]+/)[1];
    console.log("endpoint", endpoint)

    if (endpoint == 'example.com' || endpoint == 'homecare-api.remorac.com') {
      setTimeout(() => {
        setIsPaymentOpen(false)
        get_detail()
      }, 100)
    }
  };

  if (isPaymentOpen) {
    return (
      <>
        <Header title="Pembayaran"
          onBack={
            () => setIsPaymentOpen(false)
          } />
        <WebView source={
          { uri: paymentURL }
        }
          startInLoadingState={true}
          renderLoading={
            () => <Loading />
          }
          // onLoadProgress={({ nativeEvent }) => {
          //   console.log('log', nativeEvent.url)
          //   if (endpoint == 'example.com') {
          //     setTimeout(() => {
          //    setIsPaymentOpen(false)
          //     }, 2000)
          //   }
          //   // if (nativeEvent.url != `${config.msBaseUrl}/lupa-password`) {
          //   //   this.setState({ modalResetPassword: false })
          //   // }
          // }}
          onNavigationStateChange={onNavChange} />
      </>
    );
  }

  const renderCustomer = () => {
    return (
      <View style={styles.content}>
        <Text style={styles.label}>Data Pasien</Text>
        <View style={{ borderWidth: 0.5, borderColor: COLOR_SHADOW, marginVertical: 10 }} />
        <ItemValue
          layout={'vertical'}
          label={"Nama Pasien"}
          value={item.user.name}
        />

        <ItemValue
          layout={'vertical'}
          label={"Umur"}
          value={item.user.age}
        />

        <ItemValue
          layout={'vertical'}
          label={"No. Handphone"}
          value={item.user.phone}
        />

        {item.orderServices.map(obj => {
          return (
            <ItemValue
              layout={'vertical'}
              label={"Catatan"}
              value={obj.remark ? obj.remark : '-'}
            />
          )
        })}

        <ItemValue
          layout={'vertical'}
          label={"Alamat"}
          value={item.addressText}
        />

      </View>
    )
  }

  const renderNurse = () => {
    return (
      <View style={styles.content}>
        <Text style={styles.label}>Data Perawat</Text>
        <View style={{ borderWidth: 0.5, borderColor: COLOR_SHADOW, marginVertical: 10 }} />
        <View style={{ flexDirection: 'row' }}>
          <View>
            <Image source={{ uri: 'https://homecare-api.remorac.com/assets/user-photo-placeholder.jpg' }} style={{ width: 100, height: 100 }} />
            <View style={{ flexDirection: 'row', justifyContent: 'center', width : 100 }}>
              {arrRate2.map(obj => {
                return (
                  obj <= item.nurseUser.rate ?
                    <IcStarOn height={15} width={15}/>
                    :
                    <IcStarOff height={15} width={15}/>
                )
              })}
            </View>
          </View>
          <View style={{ width: '70%', marginLeft: 10 }}>
            <ItemValue
              // layout={'vertical'}
              label="Nama Perawat"
              value={item.nurseUser.name}
            />
            <ItemValue
              // layout={'vertical'}
              label="Alamat"
              value={item.nurseUser.addressText}
            />
          </View>
        </View>
      </View>
    )
  }

  const renderTransactionDetail = () => {
    return (
      <View style={styles.content}>
        <Text style={styles.label}>Detail Transaksi</Text>
        <View style={{ borderWidth: 0.5, borderColor: COLOR_SHADOW, marginVertical: 10 }} />
        {item.orderServices.map(obj => {
          return (
            <View>
              <ItemValue
                layout={'vertical'}
                label={"Layanan"}
                value={obj.service.name}
              />

              <ItemValue
                layout={'vertical'}
                label={"Jumlah"}
                value={`${obj.quantity} ${obj.service.base_unit}`}
              />

              <ItemValue layout={'vertical'} label="Harga" value={obj.price} type="currency" />

            </View>
          )
        })}

        <ItemValue
          layout={'vertical'}
          bold={true}
          label="Total Pembayaran"
          value={item.total_price}
          valueColor="#1ABC9C"
          type="currency"
        />

      </View>
    )
  }

  const renderStatus = () => {
    return (
      <View style={styles.content}>
        <Text style={styles.label}>Status Pesanan:</Text>
        <View style={{ borderWidth: 0.5, borderColor: COLOR_SHADOW, marginVertical: 10 }} />
        <ItemValue
          layout={'vertical'}
          type={'status'}
          label={`#${item.id}`}
          value={item.statusText}
          bgColor={item.statusColorBackground}
          valueColor={item.statusColorForeground}
        />
        <ItemValue
          layout={'vertical'}
          label={''}
          value={item.statusTime}
        />

        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          {arrRate2.map(obj => {
            return (
              obj <= item.rate ?
                <IcStarOn />
                :
                <IcStarOff />
            )
          })}
        </View>
      </View>
    )
  }

  const renderReport = () => {
    return (
      <View style={styles.content}>
        <Text style={styles.label}>Hasil Perawatan:</Text>
        <View style={{ borderWidth: 0.5, borderColor: COLOR_SHADOW, marginVertical: 10 }} />
        <ItemValue
          label={''}
          value={item.report}
        />
      </View>
    )
  }

  const renderHistory = () => {
    return (
      <View style={styles.content}>
        <ItemValue
          layout={'vertical'}
          label={'Dibuat Pada'}
          value={item.createdAt}
        />
        {item.cancelledAt &&
          <ItemValue
            layout={'vertical'}
            label={'Dibatalkan Pada'}
            value={item.cancelledAt}
          />
        }
        {item.rejectedAt &&
          <ItemValue
            layout={'vertical'}
            label={'Ditolak Pada'}
            value={item.rejectedAt}
          />
        }
        {item.checkedOutAt &&
          <ItemValue
            layout={'vertical'}
            label={'Checkout Pada'}
            value={item.checkedOutAt}
          />
        }
        {item.paidAt &&
          <ItemValue
            layout={'vertical'}
            label={'Dibayar Pada'}
            value={item.paidAt}
          />
        }
        {item.doneAt &&
          <ItemValue
            layout={'vertical'}
            label={'Selesai Pada'}
            value={item.doneAt}
          />
        }
      </View>
    )
  }

  const renderButton = () => {
    return (
      <View style={styles.button}>
        {(item.canBeCancelled) && (
          <>
            <Gap height={10} />
            <Button
              text="Batalkan Pesanan Saya"
              onPress={() => setModalConfirm(!modalConfirm)}
              color="#D9435E"
              textColor="white"
            />
          </>
        )}
        {(item.canBeCheckedOut || item.canBePaid) && (
          <>
            <Gap height={10} />
            <Button
              text="Bayar Sekarang"
              onPress={onPayment}
              color={COLOR_BASE_PRIMARY_MAIN}
              textColor="white"
            />
          </>
        )}
        {(item.canBeDone) && (
          <>
            <Gap height={10} />
            <Button
              text="Selesai"
              onPress={() => setModalRate(!modalRate)}
              color={COLOR_BASE_PRIMARY_MAIN}
              textColor="white"
            />
          </>
        )}
        {item.canBeReported && (
          <>
            <Gap height={10} />
            <Button
              text="Hasil Perawatan"
              onPress={() => setModalResult(!modalRate)}
              color={COLOR_BASE_PRIMARY_MAIN}
              textColor="white"
            />
          </>
        )}
        {item.canBeAccepted && (
          <>
            <Gap height={10} />
            <View style={[styles.button, { justifyContent: 'flex-end' }]}>
              <ButtonDouble
                btnLeftText={'Tolak'}
                btnRightText={'Terima'}
                btnLeftColor={'white'}
                btnRightColor={COLOR_RED}
                btnRightTextColor={'white'}
                btnLeftOnPress={() => { setModalReject(true) }}
                btnRightOnPress={() => _onAccept(id)} />

            </View>
          </>
        )}

      </View>
    )
  }

  const addHandler = () => {
    const _inputs = [...inputs];
    _inputs.push({ key: '', value: '' });
    setInputs(_inputs);
  }

  const deleteHandler = (key) => {
    const _inputs = inputs.filter((input, index) => index != key);
    setInputs(_inputs);
  }

  const inputHandler = (text, key) => {
    const _inputs = [...inputs];
    _inputs[key].value = text;
    _inputs[key].key = key;
    setInputs(_inputs);

  }

  const dinamicForm = () => {
    return (
      // <ScrollView>
      <View style={styles.containerForm}>
        {inputs.map((input, key) => (
          <View style={styles.inputContainer}>
            <View style={{ width: '80%' }}>
              <TextInput placeholder={"Hasil Perawatan"} value={input.value} onChangeText={(text) => inputHandler(text, key)} multiline />
            </View>
            <Pressable onPress={() => deleteHandler(key)}>
              <IcMin />
            </Pressable>
          </View>
        ))}
        <Button text="Tambah" onPress={addHandler} />
      </View>
      // </ScrollView>
    );
  }

  const reportForm = () => {
    return (
      <View style={styles.containerForm}>
        <TextInput
          placeholder={"Hasil Perawatan"}
          value={report}
          onChangeText={(text) => setReport(text)}
          multiline
          numberOfLines={4} />
      </View>
    )
  }

  return (
    <View style={{ flex: 1 }}>
      <Header
        title="Detail Pesanan"
        // subTitle="You deserve better meal"
        onBack={() => prev == "screenSuccess" ?
          navigation.reset({ index: 0, routes: [{ name: 'MainApp' }] })
          : navigation.goBack()}
      />
      <ScrollView>

        {renderCustomer()}
        {item.nurseUser != null ? renderNurse() : null}
        {renderTransactionDetail()}
        {renderStatus()}
        {item.report != null &&
          renderReport()
        }
        {/* {renderHistory()} */}

        <Gap height={100} />
      </ScrollView>
      {isLoading && <Loading />}
      <View style={{ borderWidth: 0.5, borderColor: COLOR_SHADOW }} />
      {renderButton()}


      <ModalConfirm
        visible={modalResult}
        btnLeftText={"Batal"}
        btnRightText={"Kirim"}
        content={
          // <ScrollView showsVerticalScrollIndicator={false}
          // showsHorizontalScrollIndicator={false}>
          <View style={{ alignItems: 'center', width: '100%' }}>
            <Text style={styles.label}>Hasil Perawatan</Text>
            {/* {dinamicForm()} */}
            {reportForm()}
          </View>
          // </ScrollView>
        }
        onPressBtnLeft={() => setModalResult(!modalResult)}
        onPressBtnRight={() => {
          setModalResult(!modalResult)
          sendReport(id)
        }
        }
      />

      <ModalConfirm
        visible={modalConfirm}
        btnLeftText={"Tidak"}
        btnRightText={"Ya"}
        content={
          <View>
            <Text style={styles.label}>Konfirmasi Pembatalan</Text>
            <Gap height={10} />
            <Text style={[styles.labelValue, { textAlign: 'center' }]}>Apakah anda yakin untuk membatalkan pesanan?</Text>
            <Gap height={20} />
          </View>
        }
        onPressBtnLeft={() => setModalConfirm(!modalConfirm)}
        onPressBtnRight={() =>
          onCancel()
        }
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalRate}
      >
        <View style={styles.centeredView}>
          <Pressable onPress={() => setModalRate(false)}>
            <IcBack />
          </Pressable>
          <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
            {isLoading && <Loading />}
            <Text style={styles.txtTop}>Semoga kamu merasa lebih baik sekarang!</Text>
            <Gap height={70} />
            {item.nurseUser &&
              <>
                <View style={{ width: 150, height: 150, borderRadius: 100, borderWidth: 2, borderColor: '#B0D6E3', padding: 5 }}>
                  <Image source={{ uri: item.nurseUser.photo }} style={{ width: 137, height: 137, borderRadius: 100 }} />
                </View>
                <Gap height={16} />
                <Text style={[styles.txtItem]}>{item.nurseUser.name}</Text>
              </>
            }
            <Gap height={30} />
            <View style={{ flexDirection: 'row' }}>
              {arrRate.map(obj => {
                return (
                  <Pressable onPress={() => onRate(obj.id)}>
                    {obj.cickk ?
                      <IcStarOn />
                      :
                      <IcStarOff />
                    }
                  </Pressable>
                )
              })}
            </View>
            <Gap height={50} />
            <Button text={"    Nilai   "} onPress={onDone} />
          </View>
        </View>
      </Modal>


      <ModalConfirm
        visible={modalReject}
        onError={false}
        content={
          <View style={{ width: 250 }}>
            <Text style={styles.label}>Konfirmasi Pembatalan</Text>
            <Gap height={10} />
            <Text style={styles.labelValue}>Berikan alasan kenapa tidak dapat mengambil orderan?</Text>
            <TextInput
              value={note}
              onChangeText={(value) => setNote(value)}
              multiline={true}
            />
          </View>
        }
        navigation={navigation}
        btnLeftText={"Batal"}
        btnRightText={"Kirim"}
        onPressBtnLeft={() => setModalReject(false)}
        onPressBtnRight={() => { setModalReject(false), _onReject(id, note) }}
      />
      <ModalCenter
        visible={modalError}
        onError={true}
        navigation={navigation}
        btnText={"Login Kembali"}
      />
    </View>
  );
};

export default OrderDetail;

const styles = StyleSheet.create({
  containerForm: {
    width: '100%',
    marginBottom: 30,
  },
  inputsContainer: {
    marginBottom: 20,
    backgroundColor: 'green'
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: COLOR_SHADOW
  },
  content: {
    backgroundColor: 'white',
    paddingHorizontal: 24,
    paddingVertical: 16,
    marginTop: 24,
    marginHorizontal: 16,
    borderRadius: 10
  },
  labelBreak: {
    marginTop: 20,
    fontSize: 16,
    marginBottom: 10,
    fontFamily: FONT_MEDIUM,
    color: COLOR_BASE_PRIMARY_TEXT,
  },
  label: {
    fontSize: 16,
    fontFamily: FONT_BOLD,
    color: COLOR_BASE_PRIMARY_TEXT,
  },
  labelService: {
    fontSize: 14,
    fontFamily: FONT_LIGHT,
    color: COLOR_BASE_PRIMARY_TEXT,
  },
  label_: { fontSize: 14, fontFamily: FONT_REGULAR, color: '#8D92A3', },
  labelValue: {
    flexShrink: 1,
    fontSize: 14,
    color: COLOR_BASE_PRIMARY_TEXT,
    fontFamily: FONT_REGULAR,
    alignSelf: 'flex-end',
  },
  button: {
    paddingHorizontal: 24,
    marginBottom: 10,
    // bottom: 0,
    // position: 'absolute',
    width: '100%'
  },
  centeredView: {
    backgroundColor: 'white',
    flex: 1,
    padding: 16
  },
  txtTop: {
    fontSize: 32,
    fontFamily: FONT_MEDIUM,
    textAlign: 'center'
  },
  txtItem: {
    fontSize: 20,
    fontFamily: FONT_REGULAR,
    textAlign: 'center'
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  txtTitleModal: {
    textAlign: 'center',
    fontFamily: FONT_BOLD,
    fontSize: 20,
    color: COLOR_BASE_PRIMARY_TEXT
  },
  txtContent: {
    fontFamily: FONT_REGULAR,
    fontSize: 15,
    marginTop: 20,
    textAlign: 'center',
    color: COLOR_BASE_PRIMARY_TEXT
  },
  textLabel: {
    fontSize: 14,
    fontFamily: FONT_REGULAR,
    color: COLOR_BASE_SECOND_TEXT
  },
  textDetail: {
    fontSize: 14,
    fontFamily: FONT_MEDIUM,
    color: COLOR_BASE_PRIMARY_TEXT
  },
});
