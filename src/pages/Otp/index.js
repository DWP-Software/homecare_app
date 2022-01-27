import Axios from 'axios';
import React, { useState } from 'react';
import {
  ScrollView, Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useDispatch } from 'react-redux';
import { IChecklist } from '../../assets';
import { Button, Gap, Header, TextInput } from '../../components';
import { endpoint } from '../../config/API/service';
import { setLoading } from '../../redux/action';
import { showMessage, useForm } from '../../utils';
import styles from './styles';


const Otp = ({ navigation }) => {
  const [form, setForm] = useForm({
    code: ''
  });
  const [errCode, setErrCode] = useState(null)

  const dispatch = useDispatch();

  const onSubmit = () => {
    if (form.code == '') {
      setErrCode('Kode Otp tidak boleh kosong')
    }


    if (form.code != '') {
      setErrCode(null)

      const data = new FormData();
      data.append('code', form.code);
      // dispatch(signUpAction(data, navigation));
    }
  };

  const signUpAction = (form, navigation) => (dispatch) => {
    dispatch(setLoading(true));
    Axios.post(endpoint.registration, form)
      .then((res) => {
        console.log('res', res.data)
        showMessage(res.data.message, res.data.status);
        dispatch(setLoading(false));
        if (res.data.status) {
          if (res.data.data.otpRequired) {
            navigation.navigate('OTP')
          } else {
            navigation.goBack()
          }
        }
      })
      .catch((err) => {
        dispatch(setLoading(false));
        showMessage(err);
        console.log('err', err)
      });
  };



  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <View style={styles.page}>
        <Header
          title="Verifikasi Nomor Telpon"
          onBack={() => navigation.goBack()}
        />
        <View style={styles.container}>
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.txtTitle}>Masukkan Kode Verifikasi</Text>
            <Text style={styles.txtSubTitle}>Kode verifikasi  sudah dikirimkan melalui</Text>
            <Text style={styles.txtSubTitle}>SMS ke nomor 0831******41</Text>
          </View>
          <Gap height={28} />
          <TextInput
            value={form.code}
            errorMsg={errCode}
            onChangeText={(value) => { setForm('code', value), setErrCode(null) }}
          />
          <Gap height={28} />
          <Button text="Verifikasi OTP" onPress={onSubmit} />
          <Gap height={120} />
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.txtTitle}>00:00</Text>
            <Gap height={28} />
            <Text style={styles.txtSubTitle}>Tidak Mendapatkan Kode?</Text>
            <TouchableOpacity onPress={() => console.log('')}>
              <Text style={styles.txtTitle}>Kirim Ulang</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.bottomContainer}>
          <View style={{ flexDirection: 'row', padding: 10, margin: 15 }}>
            <IChecklist />
            <Text style={[styles.txtFooter, { marginLeft: 20 }]}>Pastikan nomor kamu benar untuk dapat melanjutkan verifikasi</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Otp;
