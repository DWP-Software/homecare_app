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


const ForgotPassword = ({ navigation, route }) => {
  const [form, setForm] = useForm({
    email: ''
  });
  const [errEmail, setErrEmail] = useState(null)

  const dispatch = useDispatch();

  const onSubmit = () => {
    if (form.email == '') {
      setErrEmail('Email tidak boleh kosong')
    }


    if (form.email != '') {
      setErrEmail(null)
      const data = new FormData();
      data.append('email', form.email);
      dispatch(forgotPswAction(form, data, navigation));
    }
  };

  const forgotPswAction = (form, data,navigation) => (dispatch) => {
    dispatch(setLoading(true));
    Axios.put(endpoint.forgotPassword(form.email), data)
      .then((res) => {
        console.log('res', res.data)
        showMessage(res.data.message, 1);
        dispatch(setLoading(false));
        navigation.navigate('SuccessSendEmail')
      })
      .catch((err) => {
        dispatch(setLoading(false));
        // showMessage(err);
        const status = err.response.status;
        console.log('err', err.response.status)
        if(status == 404){
          setErrEmail(err.response.data.message)
        }
        i
      });
  };



  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <View style={styles.page}>
        <Header
          title="Lupa Password?"
          onBack={() => navigation.goBack()}
        />
        <View style={styles.container}>
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.txtSubTitle}>Masukkan email anda untuk meriset password</Text>
          </View>
          <Gap height={28} />
          <TextInput
            value={form.email}
            errorMsg={errEmail}
            onChangeText={(value) => { setForm('email', value), setErrEmail(null) }}
          />
          <Gap height={28} />
          <Button text="Kirim Email" onPress={onSubmit} />
          <Gap height={120} />
        </View>
        <View style={styles.bottomContainer}>
          <View style={{ flexDirection: 'row', padding: 10, margin: 15 }}>
            <IChecklist />
            <Text style={[styles.txtFooter, { marginLeft: 20 }]}>Pastikan email kamu benar untuk dapat melanjutkan riset password</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default ForgotPassword;
