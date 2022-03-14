import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Dimensions, FlatList, Pressable, ScrollView, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { useDispatch } from 'react-redux';
import { IcMin, IcPlus, IcRadioOff, IcRadioOn } from '../../assets';
import {
  Button,
  Gap,
  Header, ItemValue,
  Loading,
  ModalBasic,
  Select,
  TextChoose,
  TextInput,
  ButtonDouble
} from '../../components';
import { endpoint } from '../../config/API/service';
import { setLoading } from '../../redux/action';
import { COLOR_BASE_PRIMARY_TEXT, COLOR_BASE_SECOND_TEXT, COLOR_SHADOW, FONT_BOLD, FONT_MEDIUM, FONT_REGULAR } from '../../styles';
import { getData, showMessage, useForm } from '../../utils';

const OrderSet = ({ navigation, route }) => {
  const [dataSex, setDataSex] = useState([{ id: 0, value: "Semua" }, { id: 1, value: "Laki-laki" }, { id: 2, value: "Perempuan" }])

  const { service, userProfile } = route.params;
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [paymentURL, setPaymentURL] = useState('https://google.com');
  const [qty, setQty] = useState('1')
  const [name, setName] = useState(userProfile.name)
  const [age, setAge] = useState()
  const [sex, setSex] = useState(userProfile.sex)
  const [phone, setPhone] = useState(userProfile.phone)
  const [province, setprovince] = useState({ id: null, name: null })
  const [district, setdistrict] = useState({ id: null, name: null })
  const [subdistrict, setsubdistrict] = useState({ id: null, name: null })
  const [village, setvillage] = useState({ id: null, name: null })
  const [address, setaddress] = useState()

  const [subTotal, setSubTotal] = useState(0)
  const [step, setStep] = useState(1)

  const [nurseSex, setNurseSex] = useState(0)
  const [exMin, setExMin] = useState()
  const [exMax, setExMax] = useState()

  const [remark, setremark] = useState('')
  const [data, setData] = useState([])
  const [modalProvince, setModalProvince] = useState(false)
  const [modalDistrict, setModalDistrict] = useState(false)
  const [modalSubDistrict, setModalSubDistrict] = useState(false)
  const [modalVillage, setModalVillage] = useState(false)

  const [errName, setErrName] = useState('')
  const [errAge, setErrAge] = useState('')
  const [errSex, setErrSex] = useState('')
  const [errPhone, setErrPhone] = useState('')
  const [errProvince, setErrProvince] = useState('')
  const [errDistrict, setErrDistrict] = useState('')
  const [errSubDistrict, setErrSubDistrict] = useState('')
  const [errVillage, setErrVillage] = useState('')
  const [errAddress, setErrAddress] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const [orderNurseCriteria, setOrderNurseCriteria] = useState([])
  const [form, setForm] = useForm({})

  const dispatch = useDispatch();
  const width = Dimensions.get('window');

  useEffect(() => {
    // navigation.addListener('focus', () => {
    _getInfo()
    getData('userProfile').then((res) => {
      setName(res.name)
      setPhone(res.phone)
      setSex(res.sex)
      setAge(res.age + '')
      setprovince(res.province ? res.province : { id: null, name: null })
      setdistrict(res.district ? res.district : { id: null, name: null })
      setsubdistrict(res.subdistrict ? res.subdistrict : { id: null, name: null })
      setvillage(res.village ? res.village : { id: null, name: null })
      setaddress(res.address)
    });

    setSubTotal(service.default_price * qty)
  }, [navigation]);

  const _getInfo = () => {
    setLoading(true)
    Axios.get(endpoint.info).then(res => {
      const data = res.data.data.orderNurseCriteria
      console.log(data)
      setOrderNurseCriteria(data)
      setIsLoading(false)
    }).catch((error) => {
      showMessage(error.response, 0)
      setIsLoading(false)
    });
  }

  const stepButton = () => {

    if (step == 2) {
      if (name == null)
        setErrName("Nama Pasien tidak boleh kosong")
      if (age == "" || age.length == 0)
        setErrAge("Umur Pasien tidak boleh kosong")
      if (sex == '')
        setErrSex("Jenis Kelamin tidak boleh kosong")
      if (phone == "")
        setErrPhone('No Handphone tidak boleh kosong')
      if (province.id == null)
        setErrProvince('Provinsi tidak boleh kosong')
      if (district.id == null)
        setErrDistrict('Kabupaten/Kota tidak boleh kosong')
      if (subdistrict.id == null)
        setErrSubDistrict('Kecamatan tidak boleh kosong')
      if (village.id == null)
        setErrVillage('Desa tidak boleh kosong')
      if (address == "")
        setErrAddress('Alamat tidak boleh kosong')

      if (name != "" && age != "" && sex != "" && phone != "" && province.id != null && district.id != null && subdistrict.id != null && village.id != null && address != "") {
        setErrName('')
        setErrPhone('')
        setErrAge('')
        setErrSex('')
        setErrProvince('')
        setErrDistrict('')
        setErrSubDistrict('')
        setErrVillage('')
        setErrAddress('')

        let s = step + 1
        setStep(s)
      }
    } else {
      let s = step + 1
      setStep(s)
    }
  }

  const stepBackButton = () => {
    let s = step - 1
    if (step == 2) { }
    setStep(s)
  }
  const onCheckout = () => {
    const formData = new FormData()
    formData.append('Order[name]', name)
    formData.append('Order[sex]', sex)
    formData.append('Order[age]', age)
    formData.append('Order[province_id]', province.id)
    formData.append('Order[district_id]', district.id)
    formData.append('Order[subdistrict_id]', subdistrict.id)
    formData.append('Order[village_id]', village.id)
    formData.append('Order[address]', address)
    formData.append('OrderService[0][service_id]', service.id)
    formData.append('OrderService[0][quantity]', qty)
    formData.append('OrderService[0][remark]', remark)
    // formData.append('OrderNurseCriteria[rate_min]', 0)

    const ob = Object.keys(form)
    ob.map(item => {
      formData.append(`OrderNurseCriteria[${item}]`, form[item])
      // fil = `${fil}&NurseSearch[${item}]=${form[item]}`
    })

    // console.log('fomrData', formData)
    dispatch(createOrder(formData, navigation));
  };

  const createOrder = (formData, navigation) => (dispatch) => {
    dispatch(setLoading(true));

    getData('token').then((resToken) => {
      Axios.post(endpoint.order, formData, {
        headers: {
          Authorization: resToken.value
        }
      }).then((res) => {
        dispatch(setLoading(false));
        console.log("res", res.data.data.order.id)
        // showMessage("Pesanan Berhasil dibuat, tunggu konfirmasi dari perawat kami untuk dapat melanjutkan pembayaran", 1)
        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'SuccessOrder',
              params: {
                msg: res.data.message,
                id: res.data.data.order.id
              }
            }
          ]
        });
      }).catch((err) => {
        dispatch(setLoading(false));
        const status = err?.response?.status;
        console.log('status', err?.response)
        if (status == 401) {
          handleModalerror()
        } else {
          showMessage(`${err?.response.data.message}`);
        }
      });
    });
  };

  const onNavChange = (state) => {
    // TODO: Use This For Production
    // const urlSuccess =
    //   'http://foodmarket-backend.buildwithangga.id/midtrans/success?order_id=574&status_code=201&transaction_status=pending';
    const titleWeb = 'Laravel';
    if (state.title === titleWeb) {
      navigation.reset({ index: 0, routes: [{ name: 'SuccessOrder' }] });
    }
  };

  const getProvince = () => {
    Axios.get(endpoint.province)
      .then((res) => {
        setData(res.data.data.provinces)
        console.log(res.data.data.provinces)
      })
      .catch((err) => {
        console.log(err.response)
        showMessage('terjadi kesalahan');
      });
  }

  const getDistrict = (province_id) => {
    Axios.get(endpoint.district + province_id)
      .then((res) => {
        setData(res.data.data.districts)
      })
      .catch((err) => {
        showMessage('terjadi kesalahan');
      });
  }

  const getSubDistrict = (province_id) => {
    Axios.get(endpoint.subdistrict + province_id)
      .then((res) => {
        setData(res.data.data.subdistricts)
      })
      .catch((err) => {
        showMessage('terjadi kesalahan');
      });
  }

  const getVillage = (province_id) => {
    Axios.get(endpoint.village + province_id)
      .then((res) => {
        setData(res.data.data.villages)
      })
      .catch((err) => {
        showMessage('terjadi kesalahan');
      });
  }

  const openModal = () => {
    getProvince()
    setModalProvince(!modalProvince)
  }
  const openModalDistrict = () => {
    if (province.id != undefined) {
      getDistrict(province.id)
      setModalDistrict(!modalDistrict)
    } else {
      ToastAndroid.showWithGravity(
        "Pilih Provinsi terlebih dahulu",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
    }
  }
  const openModalSubDistrict = () => {
    if (district.id != undefined) {
      getSubDistrict(district.id)
      setModalSubDistrict(!modalSubDistrict)
    } else {
      ToastAndroid.showWithGravity(
        "Pilih Provinsi & Kabupaten/Kota terlebih dahulu",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
    }
  }
  const openModalVillage = () => {
    if (subdistrict.id == undefined) {
      ToastAndroid.showWithGravity(
        "Pilih Provinsi, Kabupaten/kota, & Kecamatan terlebih dahulu",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
    } else {
      console.log('pov', district)
      getVillage(subdistrict.id)
      setModalVillage(!modalVillage)
    }
  }

  const chooseProvince = (item) => {
    if (modalProvince) {
      setprovince(item)
      setModalProvince(!modalProvince)
      setdistrict('')
      setsubdistrict('')
      setvillage('')

      setErrProvince('')
    } else if (modalDistrict) {
      setdistrict(item)
      setModalDistrict(!modalDistrict)
      setsubdistrict('')
      setvillage('')
      setErrDistrict('')
    } else if (modalSubDistrict) {
      setsubdistrict(item)
      setModalSubDistrict(!modalSubDistrict)
      setvillage('')
      setErrSubDistrict('')
    } else if (modalVillage) {
      setvillage(item)
      setModalVillage(!modalVillage)
      setErrVillage('')
    }
  }

  const renderModalProvince = () => {
    return (
      <ModalBasic
        title={"Pilih Provinsi"}
        visible={modalProvince}
        content={
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
          />
        }
        onClosePress={() => setModalProvince(!modalProvince)}
      />
    )
  }

  const renderModalDistrict = () => {
    return (
      <ModalBasic
        title={"Pilih Kabupaten/Kota"}
        visible={modalDistrict}
        content={
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
          />
        }
        onClosePress={() => setModalDistrict(!modalDistrict)}
      />
    )
  }

  const renderModalSubDistrict = () => {
    return (
      <ModalBasic
        title={"Pilih Kecamatan"}
        visible={modalSubDistrict}
        content={
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
          />
        }
        onClosePress={() => setModalSubDistrict(!modalSubDistrict)}
      />
    )
  }

  const renderModalVillage = () => {
    return (
      <ModalBasic
        title={"Pilih Desa"}
        visible={modalVillage}
        content={
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
          />
        }
        onClosePress={() => setModalVillage(!modalVillage)}
      />
    )
  }

  const renderItem = ({ item }) => {
    return (
      <View style={{ padding: 10 }}>
        <TouchableOpacity onPress={() => chooseProvince(item)}>
          <Text style={{ fontFamily: FONT_MEDIUM }}>{item.name}</Text>
        </TouchableOpacity>
        <View style={{ height: 1, backgroundColor: COLOR_BASE_SECOND_TEXT, marginTop: 10 }} />
      </View>
    );
  };


  const onPlus = () => {
    var q = parseInt(qty) + 1
    setQty(`${q}`)
    setSubTotal(service.default_price * q)
    console.log('penjumlahan', parseInt(qty) + 1)
  }

  const onMin = () => {
    if (qty > 1) {
      var q = parseInt(qty) - 1
      setQty(`${q}`)
      setSubTotal(service.default_price * q)
    } else {
      ToastAndroid.showWithGravity('Jumlah Tidak boleh kurang dari 1', ToastAndroid.LONG, ToastAndroid.BOTTOM)
    }
  }

  const onChangeQty = (q) => {
    if (q > 1) {
      setQty(`${q}`)
      setSubTotal(service.default_price * q)
    } else {
      setQty(`1`)
      ToastAndroid.showWithGravity('Jumlah Tidak boleh kurang dari 1', ToastAndroid.LONG, ToastAndroid.BOTTOM)
    }
  }

  const renderStep = () => {
    return (
      <View style={styles.content2}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
          <View style={{ alignItems: 'center', width: '30%' }}>
            <View style={step == 1 ? styles.roundActive : styles.round}>
              <Text style={step == 1 ? styles.txtStepActive : styles.txtStep}>1</Text>
            </View>
            <Text style={styles.labelStep}>Layanan</Text>
          </View>
          <View style={{ alignItems: 'center', width: '30%' }}>
            <View style={step == 2 ? styles.roundActive : styles.round}>
              <Text style={step == 2 ? styles.txtStepActive : styles.txtStep}>2</Text>
            </View>
            <Text style={styles.labelStep}>Data Pelanggan</Text>
          </View>
          <View style={{ alignItems: 'center', width: '30%' }}>
            <View style={step == 3 ? styles.roundActive : styles.round}>
              <Text style={step == 3 ? styles.txtStepActive : styles.txtStep}>3</Text>
            </View>
            <Text style={styles.labelStep}>Kriteria Perawat</Text>
          </View>
        </View>
      </View>
    )
  }

  const renderFormService = () => {
    return (
      <View style={styles.content2}>
        <Text style={styles.label}>Layanan</Text>
        <Gap height={15} />
        <ItemValue
          layout={'vertical'}
          label={"Nama Layanan"}
          value={service.name}
        />
        <ItemValue
          label={"Harga"}
          layout={'vertical'}
          value={service.default_price}
          type="currency"
        />

        {service.is_multipliable ?
          <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>

            <Text style={[styles.labelJml, { color: '#8D92A3' }]}>Jumlah ({service.base_unit})</Text>

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: 120 }}>
              <Pressable onPress={() => onMin()}>
                <IcMin />
              </Pressable>
              <TextInput placeholder='1' value={qty} onChangeText={(value) => { onChangeQty(value) }} keyboardType="numeric" maxLength={3} />
              <Pressable onPress={() => onPlus()}>
                <IcPlus />
              </Pressable>
            </View>
          </View>
          :
          <ItemValue
            label={`Jumlah (${service.base_unit})`}
            layout={'vertical'}
            value={1}
          />
        }
        {service.is_multipliable ? <View style={{ borderWidth: 0.5, borderColor: COLOR_SHADOW, marginVertical: 10 }} /> : null}
        <ItemValue
          label={"Sub Total"}
          bold={true}
          layout={'vertical'}
          value={subTotal}
          type="currency"
        />

      </View>
    )
  }

  const renderCriteria = () => {
    return (
      <View style={styles.content2}>
        <Text style={styles.label}>Kriteria Perawat</Text>
        <Gap height={10} />
        {/* <Select
          label="Jenis Kelamin"
          value={nurseSex}
          data={dataSex}
          errorMsg={errNurseSex}
          onSelectChange={(value) => { setNurseSex(value), setErrNurseSex('') }}
        /> */}
        {/* <Gap height={10} />
        <Text style={[styles.labelJml, { color: COLOR_BASE_PRIMARY_TEXT }]}>Pengalaman</Text>
        <Gap height={5} />
        <View style={{ paddingLeft: 10 }}>
          <TextInput
            label="Minimal"
            placeholder="0 thn"
            value={exMin}
            onChangeText={(value) => { setExMin(value) }}
          />
          <TextInput
            label="Maximal"
            placeholder="2 thn"
            value={exMax}
            onChangeText={(value) => { setExMax(value) }}
          />
        </View> */}
        {orderNurseCriteria.map(obj => {
          return (
            <View style={styles.containerFilter}>
              <Text style={[styles.labelJml, { color: COLOR_BASE_PRIMARY_TEXT }]}>{obj.label}</Text>
              {obj.type == 'radio' ?
                Array.isArray(obj.value) &&
                obj.value.map((radio, index) => {
                  return (
                    <Pressable onPress={() => setForm(obj.attribute, index)}>
                      <View style={{ flexDirection: 'row', marginLeft: 10, paddingBottom: 5 }}>
                        {form[obj.attribute] == index ?
                          <IcRadioOn />
                          :
                          <IcRadioOff />
                        }
                        <Text style={[styles.txtFilter, { fontSize: 14, marginLeft: 10 }]}>{radio}</Text>
                      </View>
                    </Pressable>
                  )
                })
                :
                (obj.type == 'number' || obj.type == 'text') ?
                  <TextInput
                    value={form[obj.attribute]}
                    keyboardType={obj.type == 'number' ? 'numeric' : 'text'}
                    onChangeText={(value) => { { setForm(obj.attribute, value) } }}
                  />
                  :
                  obj.type == 'group' ?
                    <View style={obj.layout != 'horizontal' && {flexDirection : 'row'}}>
                      {obj.items.map((item, index) => {
                        return (
                          (item.type == "number" || item.type == "text" || item.type == "integer") ?
                            <View style={{ padding: 5, width: '50%' }}>
                              <TextInput
                                label={item.label}
                                keyboardType={item.type == 'number' || item.type == 'integer' ? 'numeric' : 'text'}
                                value={form[item.attribute]}
                                onChangeText={(value) => { setForm(item.attribute, value) }}
                              />
                            </View>
                            :
                            item.type == "radio" ?
                              item.value.map((radio, index) => {
                                return(
                                <Pressable onPress={() => setForm(item.attribute, index)}>
                                  <View style={{ flexDirection: 'row', marginLeft: 10, paddingBottom: 5 }}>
                                    {form[item.attribute] == index ?
                                      <IcRadioOn />
                                      :
                                      <IcRadioOff />
                                    }
                                    <Text style={[styles.txtFilter, { fontSize: 14, marginLeft: 10 }]}>{radio}</Text>
                                  </View>
                                </Pressable>
                                )
                              })
                              : <Text>NOr</Text>
                        )
                      })}
                    </View>
                    :
                    null}
            </View>
          )
        })}
      </View>
    )
  }

  const renderFormCustomer = () => {
    return (
      <View style={styles.content2}>
        <Text style={styles.label}>Data Pelanggan</Text>
        <Gap height={10} />
        <TextInput
          label="Nama"
          placeholder="Nama Pasien"
          value={name}
          errorMsg={errName}
          onChangeText={(value) => { setName(value), setErrName('') }}
        />

        <Gap height={10} />
        <Select
          label="Jenis Kelamin"
          value={sex}
          data={dataSex}
          errorMsg={errSex}
          onSelectChange={(value) => { setSex(value), setErrSex('') }}
        />
        <Gap height={15} />
        <TextInput
          label="Umur"
          placeholder="Umur Pasien"
          value={age}
          errorMsg={errAge}
          onChangeText={(value) => { setAge(value), setErrAge('') }}
        />
        <Gap height={10} />
        <TextInput
          label="No.Hp"
          placeholder="Nomor Handphone"
          value={phone}
          errorMsg={errPhone}
          onChangeText={(value) => { setPhone(value), setErrPhone('') }}
        />
        <Gap height={10} />
        <TextChoose
          label="Provinsi"
          // editable={false}
          onPress={openModal}
          placeholder="Pilih Provinsi"
          value={province ? province.name : ''}
          errorMsg={errProvince}
          onChangeText={(value) => { setprovince(value), setErrProvince('') }}
        />
        <Gap height={10} />
        <TextChoose
          label="Kabupaten/Kota"
          onPress={openModalDistrict}
          placeholder="Pilih Kabupaten/Kota"
          value={district ? district.name : ''}
          errorMsg={errDistrict}
          onChangeText={(value) => { setdistrict(value), setErrDistrict('') }}
        />
        <Gap height={10} />
        <TextChoose
          label="Kecamatan"
          onPress={openModalSubDistrict}
          editable={false}
          placeholder="Pilih Kecamatan"
          value={subdistrict ? subdistrict.name : ''}
          errorMsg={errSubDistrict}
          onChangeText={(value) => { setsubdistrict(value), setErrSubDistrict('') }}
        />
        <Gap height={10} />
        <TextChoose
          label="Desa/Kelurahan"
          onPress={openModalVillage}
          editable={false}
          placeholder="Pilih Desa"
          value={village ? village.name : ''}
          errorMsg={errVillage}
          onChangeText={(value) => { setvillage(value), setErrVillage('') }}
        />

        <Gap height={10} />
        <TextInput
          label="Alamat"
          placeholder="Masukkan alamat anda"
          value={address}
          errorMsg={errAddress}
          onChangeText={(value) => { setaddress(value), setErrAddress('') }}
        />
        <TextInput
          label="Catatan"
          placeholder="Masukkan Catatan"
          value={remark}
          multiline
          onChangeText={(value) => setremark(value)}
        />
      </View>
    )
  }

  if (isPaymentOpen) {
    return (
      <>
        <Header
          title="Pembayaran"
          onBack={() => setIsPaymentOpen(false)}
        />
        <WebView
          source={{ uri: paymentURL }}
          startInLoadingState={true}
          renderLoading={() => <Loading />}
          onNavigationStateChange={onNavChange}
        />
      </>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <Header
          title="Pesanan"
          onBack={() => navigation.goBack()}
        />
        <Gap height={10} />
        {renderStep()}
        <Gap height={10} />

        {step == 1 ? renderFormService() : step == 2 ? renderFormCustomer() : renderCriteria()}

      </ScrollView>
      {/* {renderFormCustomer()} */}
      <View style={{ borderWidth: 0.5, borderColor: COLOR_SHADOW }} />
      <Gap height={5} />
      <View style={styles.button}>
        {step == 1 ?
          <Button text="Lanjutkan" onPress={stepButton} />
          :
          <ButtonDouble
            btnLeftText={'Sebelumnya'}
            btnRightText={step == 3 ? 'Kirim' : 'Lanjutkan'}
            btnLeftOnPress={stepBackButton}
            btnRightOnPress={step == 3 ? onCheckout : stepButton}
          />

        }
      </View>
      <Gap height={60} />
      {renderModalProvince()}
      {renderModalDistrict()}
      {renderModalSubDistrict()}
      {renderModalVillage()}

      {isLoading &&
        <Loading />
      }
    </View>
  );
};

export default OrderSet;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    backgroundColor: 'white',
    paddingHorizontal: 24,
    paddingVertical: 16,
    marginTop: 24,
  },
  content2: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 16
  },
  label: {
    fontSize: 16,
    fontFamily: FONT_BOLD,
    color: COLOR_BASE_PRIMARY_TEXT,
  },
  labelJml: {
    fontSize: 14,
    fontFamily: FONT_REGULAR,
    color: COLOR_BASE_SECOND_TEXT
  },
  labelStep: {
    fontSize: 11,
    marginTop: 10,
    fontFamily: FONT_MEDIUM,
    color: COLOR_BASE_PRIMARY_TEXT
  },
  button: { paddingHorizontal: 24, position: 'absolute', bottom: 10, width: '100%' },
  round:
    { padding: 10, backgroundColor: COLOR_SHADOW, borderRadius: 50, width: 40, height: 40, justifyContent: 'center' },
  roundActive:
    { padding: 10, backgroundColor: '#0CBC8B', borderRadius: 50, width: 40, height: 40, justifyContent: 'center' },
  txtStep:
    { color: COLOR_BASE_PRIMARY_TEXT, fontFamily: FONT_BOLD, textAlign: 'center' },
  txtStepActive:
    { color: 'white', fontFamily: FONT_BOLD, textAlign: 'center' }
});
