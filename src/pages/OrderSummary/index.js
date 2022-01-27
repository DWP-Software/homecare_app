import Axios from 'axios';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { useDispatch } from 'react-redux';
import { ProfileDummy } from '../../assets';
import {
  Button,
  Gap,
  Header,
  ItemListFood,
  ItemValue,
  Loading
} from '../../components';
import ModalCenter from '../../components/molecules/ModalCenter';
import { API_HOST } from '../../config';
import { endpoint } from '../../config/API/service';
import { setLoading } from '../../redux/action';
import { COLOR_BASE_PRIMARY_TEXT, COLOR_BASE_SECOND_TEXT, FONT_BOLD, FONT_REGULAR } from '../../styles';
import { getData, showMessage } from '../../utils';

const OrderSummary = ({ navigation, route }) => {
  const {
    item,
    service,
    userProfile,
    fulladdress,
    qty
  } = route.params;
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [paymentURL, setPaymentURL] = useState('https://google.com');
  const [modalError, setModalError] = useState(false)
  const dispatch = useDispatch();

  const total = qty * item.price

  console.log("service", service)
  const onCheckout = () => {
    const formData = new FormData()
    formData.append('Order[nurse_user_id]', item.id)
    formData.append('Order[name]', userProfile.name)
    formData.append('Order[sex]', userProfile.sex)
    formData.append('Order[age]', userProfile.age)
    formData.append('Order[province_id]', fulladdress.province.id)
    formData.append('Order[district_id]', fulladdress.district.id)
    formData.append('Order[subdistrict_id]', fulladdress.subdistrict.id)
    formData.append('Order[village_id]', fulladdress.village.id)
    formData.append('Order[address]', fulladdress.address)
    formData.append('OrderService[0][service_id]', service.id)
    formData.append('OrderService[0][quantity]', qty)
    formData.append('OrderService[0][remark]', fulladdress.remark)

    dispatch(createOrder(formData, navigation));
  }

  const createOrder = (formData, navigation) => (dispatch) => {
    dispatch(setLoading(true));

    getData('token').then((resToken) => {
      Axios.post(endpoint.order, formData, {
        headers: {
          Authorization: resToken.value
        }
      }).then((res) => {
        dispatch(setLoading(false));
        // showMessage("Pesanan Berhasil dibuat, tunggu konfirmasi dari perawat kami untuk dapat melanjutkan pembayaran", 1)

        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'SuccessOrder',
              params : {
                msg : res.data.message
              }
            }
          ]
        });
      }).catch((err) => {
        dispatch(setLoading(false));
        const status = err.response.status;
        if (status == 401) {
          handleModalerror()
        } else {
          showMessage(`${err?.response?.data?.message
            } on Checkout API` || 'Terjadi Kesalahan di API Checkout');
        }
      });
    });
  };

  const handleModalerror = () => {
    setModalError(!modalError)
  }

  const onNavChange = (state) => {
    // TODO: Use This For Production
    // const urlSuccess =
    // 'http://foodmarket-backend.buildwithangga.id/midtrans/success?order_id=574&status_code=201&transaction_status=pending';
    const titleWeb = 'Laravel';
    if (state.title === titleWeb) {
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'SuccessOrder'
          }
        ]
      });
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
          onNavigationStateChange={onNavChange} />
      </>
    );
  }
  return (
    <ScrollView>
      <Header title="Ringkasan Pesanan"
        onBack={
          () => navigation.goBack()
        } />

      <View style={styles.content}>
        <Text style={styles.label}>Layanan</Text>
        <ItemValue
          label={"Nama Layanan"}
          value={service.name}
        />
        <ItemValue
          label={"Harga"}
          value={item.price}
          type="currency"
        />

        <ItemValue
          label={"Jumlah"}
          value={`${qty} ${service.base_unit}`}
        />

      </View>

      <View style={
        styles.content
      }>
        <Text style={
          styles.label
        }>Perawat yang dipilih</Text>
        <ItemListFood type="order-summary"
          name={
            item.name
          }
          price={
            item.price
          }
          item={qty}
          base_unit={
            service.base_unit
          }
          image={{uri : item.photo}}/>
        <Text style={
          styles.label
        }>Profil Perawat</Text>
        <ItemValue label={"No. Handphone"}
          value={
            `${item.phone
            }`
          } />
        <ItemValue label={"Alamat"}
          value={
            `${item.village.name
            }, ${item.subdistrict.name
            }`
          } />
        <ItemValue label="Jenis Kelamin"
          value={
            item.sex == 1 ? 'Laki-Laki' : 'Perempuan'
          } />

      </View>

      <View style={
        styles.content
      }>
        <Text style={
          styles.label
        }>Data Pasien</Text>
        <ItemValue label="Nama"
          value={
            userProfile.name
          } />
          <ItemValue label="Umur"
          value={
            userProfile.age + ' Tahun'
          } />
        <ItemValue label="No.Handphone."
          value={
            userProfile.phone
          } />
          <ItemValue label="Alamat" value={ `${fulladdress.address
            }, ${fulladdress.village.name
            }, \n ${fulladdress.subdistrict.name
            },  ${fulladdress.district.name
            },  ${fulladdress.province.name
            }`} />
        <ItemValue label="Catatan."
          value={
            fulladdress.remark
          } />
      </View>

      <View style={
        styles.content
      }>
        <Text style={
          styles.label
        }>Detail Pembayaran</Text>
        <ItemValue label="Jumlah"
          value={
            `${qty} ${service.base_unit
            }`
          } />
        <ItemValue label="Harga."
          value={
            item.price
          }
          type={'currency'} />
        <ItemValue label="Total Pembayaran"
          value={total}
          type={'currency'} />
      </View>
      <View style={
        styles.button
      }>
        <Button text="Buat Pesanan"
          onPress={onCheckout} />
      </View>
      <Gap height={40} />

      <ModalCenter
        visible={modalError}
        onError={true}
        navigation={navigation}
        btnText={"Login Kembali"}
      />
    </ScrollView>
  );
};

export default OrderSummary;

const styles = StyleSheet.create({
  content: {
    backgroundColor: 'white',
    paddingHorizontal: 24,
    paddingVertical: 16,
    marginTop: 24
  },
  label: {
    fontSize: 14,
    fontFamily: FONT_BOLD,
    color: COLOR_BASE_PRIMARY_TEXT,
  },
  button: {
    paddingHorizontal: 24,
    marginTop: 24
  },
  label_: { fontSize: 14, fontFamily: FONT_REGULAR, color: '#8D92A3', },
  labelValue: {
    flexShrink: 1,
    fontSize: 14,
    color: COLOR_BASE_PRIMARY_TEXT,
    fontFamily: FONT_REGULAR,
    alignSelf: 'flex-end',
  },
});
