import AsyncStorage from '@react-native-async-storage/async-storage';
import Axios from 'axios';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { FlatList, Modal, ScrollView, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { Button, Gap, Header, ModalBasic, ModalCenter, Select, TextChoose, TextInput } from '../../components';
import { API_HOST } from '../../config';
import { endpoint } from '../../config/API/service';
import { setLoading } from '../../redux/action';
import { COLOR_BASE_SECOND_TEXT, FONT_MEDIUM } from '../../styles';
import { getData, showMessage, storeData, useForm } from '../../utils';

const EditProfile = ({ navigation }) => {
  const [form, setForm] = useForm({
    name: '',
    sex: '',
    province: {},
    district: {},
    subdistrict: {},
    village: {},
    address: '',
  });

  const [name, setName] = useState('')
  const [sex, setSex] = useState(1)
  const [province, setprovince] = useState({id : null , name : null})
  const [district, setdistrict] = useState({id : null , name : null})
  const [subdistrict, setsubdistrict] = useState({id : null , name : null})
  const [village, setvillage] = useState({id : null , name : null})
  const [address, setaddress] = useState()

  const [dataSex, setDataSex] = useState([{ id: 1, value: "Laki-laki" }, { id: 2, value: "Perempuan" }])
  const [date, setDate] = useState(new Date())
  const [data, setData] = useState([])
  const [modalProvince, setModalProvince] = useState(false)
  const [modalDistrict, setModalDistrict] = useState(false)
  const [modalSubDistrict, setModalSubDistrict] = useState(false)
  const [modalVillage, setModalVillage] = useState(false)
  const [modalDate, setmodalDate] = useState(false)

  const [errName, setErrName] = useState('')
  const [errAge, setErrAge] = useState('')
  const [errSex, setErrSex] = useState('')
  const [errPhone, setErrPhone] = useState('')
  const [errProvince, setErrProvince] = useState('')
  const [errDistrict, setErrDistrict] = useState('')
  const [errSubDistrict, setErrSubDistrict] = useState('')
  const [errVillage, setErrVillage] = useState('')
  const [errAddress, setErrAddress] = useState('')

  useEffect(() => {

    // navigation.addListener('focus', () => {
    getData('userProfile').then((res) => {
      console.log('profile', res)

      setName(res.name ? res.name : '')
      setSex(res.sex ? res.sex : 1)
      setDate(new Date(res.birthdate))
      setprovince(res.province ? res.province : {id : null , name : null})
      setdistrict(res.district ? res.district : {id : null , name : null})
      setsubdistrict(res.subdistrict ? res.subdistrict : {id : null , name : null})
      setvillage(res.village ? res.village : {id : null , name : null})
      setaddress(res.address ? res.address : '')
    })
    // });
  }, [navigation]);


  const onSubmit = () => {
    if (name.length == 0)
    setErrName("Nama tidak boleh kosong")
  if (sex == '')
    setErrSex("Jenis Kelamin tidak boleh kosong")
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

  if (name.length > 0 && sex != "" && province.id != null && district.id != null && subdistrict.id != null && village.id != null && address != "") {
    setErrName('')
    setErrAge('')
    setErrSex('')
    setErrProvince('')
    setErrDistrict('')
    setErrSubDistrict('')
    setErrVillage('')
    setErrAddress('')

    getData('token').then((resToken) => {
      const formData = new FormData()
      formData.append('User[name]', name);
      formData.append('User[birthdate]', moment(date).format('YYYY-MM-DD'));
      formData.append('User[sex]', sex);
      formData.append('User[province_id]', province.id);
      formData.append('User[district_id]', district.id);
      formData.append('User[subdistrict_id]', subdistrict.id);
      formData.append('User[village_id]', village.id);
      formData.append('User[address]', address);
      Axios.put(endpoint.editProfile + resToken.id, formData, {
        headers: {
          Authorization: resToken.value,
        },
      })
        .then((res) => {
          showMessage('Update Success', 1);
          storeData('userProfile', res.data.data.user).then(() => {
            navigation.reset({ index: 0, routes: [{ name: 'MainApp' }] });
          });
        })
        .catch((err) => {
          showMessage(
            `${err?.response?.data?.message} on Update Profile API` ||
            'Terjadi kesalahan di API Update Profile',
          );
        });
    });
  }
  };

  const getProvince = () => {
    setLoading(true)
    Axios.get(endpoint.province)
      .then((res) => {
        setData(res.data.data.provinces)
        setLoading(false)
      })
      .catch((err) => {
        setLoading(true)
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
    if (province.id != undefined && district.id != undefined) {
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
    if (province.id != undefined) {
      getVillage(subdistrict.id)
      setModalVillage(!modalVillage)
    } else {
      ToastAndroid.showWithGravity(
        "Pilih Provinsi, Kabupaten/kota, & Kecamatan terlebih dahulu",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
    }
  }

  // const chooseProvince = (item) => {
  //   if(modalProvince){
  //   setForm('province', item)
  //   setModalProvince(!modalProvince)
  //   }else if(modalDistrict){
  //     setForm('district', item)
  //   setModalDistrict(!modalDistrict)
  //   }else if(modalSubDistrict){
  //     setForm('subdistrict', item)
  //   setModalSubDistrict(!modalSubDistrict)
  //   }else if(modalVillage){
  //     setForm('village', item)
  //   setModalVillage(!modalVillage)
  //   }
  // }

  const chooseProvince = (item) => {
    if (modalProvince) {
      setprovince(item)
      setModalProvince(!modalProvince)
      setdistrict('')
      setsubdistrict('')
      setvillage('')
    } else if (modalDistrict) {
      setdistrict(item)
      setModalDistrict(!modalDistrict)
      setsubdistrict('')
      setvillage('')
    } else if (modalSubDistrict) {
      setsubdistrict(item)
      setModalSubDistrict(!modalSubDistrict)
      setvillage('')
    } else if (modalVillage) {
      setvillage(item)
      setModalVillage(!modalVillage)
    }
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

  const openDate = () => {
    setmodalDate(!modalDate)
  }

  const renderModalDate = () => {
    return (
      <DatePicker
        modal
        open={modalDate}
        date={date}
        mode='date'
        onConfirm={(value) => {
          setmodalDate(false)
          setDate(value)
          console.log("Date", date)
        }}
        onCancel={() => {
          setmodalDate(false)
        }}
      />
    )
  }
  const renderModalProvince = () => {
    return (
      <ModalBasic
        title={"Pilih Provinsi"}
        visible={modalProvince}
        content={
          data.length > 0 ?
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
          />
          : <Text>Memuat</Text>
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
        onClosePress={() =>  setModalDistrict(!modalDistrict)}
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
        onClosePress={openModalVillage}
      />
    )
  }


  return (
    <View style={styles.page}>
      <ScrollView>
        <Header
          title={"Edit Profile"}
          subTitle={"Lengkapi data profil anda"}
          onBack={() => navigation.goBack()}
        />
        <View style={styles.container}>
          <TextInput
            label="Nama"
            placeholder="Masukkan nama lengkap anda"
            value={name}
            errorMsg={errName}
            onChangeText={(value) => { setName(value), setErrName('') }}
          />
          <Gap height={16} />
          <Select
            label="Jenis Kelamin"
            value={sex}
            data={dataSex}
            onSelectChange={(value) => { setSex(value), setErrSex('') }}
          />
          <Gap height={16} />
          <TextChoose
            label="Tanggal Lahir"
            placeholder="Masukkan tanggal lahir kamu"
            value={moment(date).format('DD-MM-YYYY')}
            onPress={openDate}
          // onChangeText={(value) => {setName(value), setErrName('')}}
          />
          <Gap height={16} />
          <TextChoose
            label="Provinsi"
            editable={false}
            onPress={openModal}
            errorMsg={errProvince}
            placeholder="Pilih Provinsi"
            value={province ? province.name : ''}
            onChangeText={(value) => { }}
          />
          <Gap height={16} />
          <TextChoose
            label="Kabupaten/Kota"
            errorMsg={errDistrict}
            onPress={openModalDistrict}
            editable={false}
            placeholder="Pilih Kabupaten/Kota"
            value={district ? district.name : ''}
            onChangeText={(value) => setForm('district', value)}
          />
          <Gap height={16} />
          <TextChoose
            label="Kecamatan"
            errorMsg={errSubDistrict}
            onPress={openModalSubDistrict}
            editable={false}
            placeholder="Pilih Kecamatan"
            value={subdistrict ? subdistrict.name : ''}
            onChangeText={(value) => setForm('subdistrict', value)}
          />
          <Gap height={16} />
          <TextChoose
            label="Desa/Kelurahan"
            errorMsg={errVillage}
            onPress={openModalVillage}
            editable={false}
            placeholder="Pilih Desa"
            value={village ? village.name : ''}
            onChangeText={(value) => setForm('village', value)}
          />
          <Gap height={16} />
          <TextInput
            label="Alamat"
            placeholder="Masukkan alamat anda"
            value={address}
            errorMsg={errAddress}
            onChangeText={(value) => { setaddress(value), setErrAddress('') }}
          />
          <Gap height={24} />
          <Button text="Update" onPress={onSubmit} />
        </View>
      </ScrollView>
      {renderModalProvince()}
      {renderModalDistrict()}
      {renderModalSubDistrict()}
      {renderModalVillage()}
      {renderModalDate()}
    </View>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  scroll: { flexGrow: 1 },
  page: { flex: 1, backgroundColor: 'white' },
  container: {
    backgroundColor: 'white',
    paddingHorizontal: 24,
    paddingVertical: 26,
    flex: 1,
  },
});
