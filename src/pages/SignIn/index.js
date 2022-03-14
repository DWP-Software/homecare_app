import Axios from 'axios';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { useDispatch } from 'react-redux';
import { IcAppKep, IcError, IRound, LineRound, Logo } from '../../assets';
import { Button, Gap, Header, ModalCenter, TextInput } from '../../components';
import { endpoint } from '../../config/API/service';
import { setLoading } from '../../redux/action';
import { showMessage, storeData, useForm } from '../../utils';
import styles from './styles';

const SignIn = ({ navigation }) => {
  const [form, setForm] = useForm({
    email: '',
    password: '',
    errEmail: '',
    errPsw: '',
  });
  const [errEmail, setErrEmail] = useState(null)
  const [errPsw, setErrPsw] = useState(null)
  const [modalError, setModalError] = useState(false)
  const [msgError, setMsgError] = useState('')
  const dispatch = useDispatch();

  const onSubmit = () => {
    if (form.email == '') {
      setErrEmail('Email tidak boleh kosong')
    }
    if (form.password == '') {
      setErrPsw('Password tidak boleh kosong')
    }

    if (form.password != '' && form.email != '') {
      setErrEmail(null)
      setErrPsw(null)
      const data = new FormData();
      data.append('phone', form.email);
      data.append('password', form.password);

      dispatch(signInAction(data, navigation));
    }
  };


  const signInAction = (form, navigation) => (dispatch) => {
    dispatch(setLoading(true));
    Axios.post(endpoint.login, form)
      .then((res) => {
        console.log("res", res)
        const token = `Bearer ${res.data.data.token}`;
        const profile = res.data.data.user;
        console.log('profile', profile)
        console.log('token', token)
        dispatch(setLoading(false));
        storeData('token', { value: token, id: res.data.data.user.id });
        storeData('userProfile', profile);
        if (!res.data.data.user.isNurse) {
          navigation.reset({ index: 0, routes: [{ name: 'MainApp' }] });
        } else {
          navigation.reset({ index: 0, routes: [{ name: 'NurseApp' }] });
        }
      })
      .catch((err) => {
        dispatch(setLoading(false));
        if (err?.response.data.status == 404)
          setErrEmail(err?.response?.data.message)
        else if (err?.response.data.status == 401) {
          setErrPsw(err?.response?.data.message)
        }else{
          setMsgError(err?.response?.message)
          setModalError(true)
        }
      });
  };

  return (
    <ScrollView style={styles.page}>
        <View>
          <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
            <Logo />
            <IRound />
          </View>
          <View style={{ paddingHorizontal: 24 }}>
            <Text style={styles.txtTitle}>LOGIN</Text>
            <View opacity={0.75}>
              <Text style={styles.txtSubTitle}>Silakan login menggunakan akun yang terdaftar</Text>
            </View>
          </View>
        </View>
        <View style={styles.container}>
          <TextInput
            label="No.Hp"
            value={form.email}
            onChangeText={(value) => { setForm('email', value), setErrEmail(null) }}
            errorMsg={errEmail}
          />
          <Gap height={5} />
          <TextInput
            label="Password"
            value={form.password}
            onChangeText={(value) => { setForm('password', value), setErrPsw(null) }}
            secureTextEntry
            errorMsg={errPsw}
          />
          <Gap height={10} />
          <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={[styles.txtReg, { alignSelf: 'flex-end' }]}>Lupa Password? </Text>
          </TouchableOpacity>
          <Gap height={16} />
          <Button text="Masuk" onPress={onSubmit} />
          <Gap height={12} />
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.txtSubTitle}>Belum mempunyai akun? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={styles.txtReg}>Registrasi disini </Text>
            </TouchableOpacity>
          </View>
          <Gap height={24} />
        </View>
      <View style={styles.bottomContainer}>
        <View style={{ flexDirection: 'row', bottom : 0 }}>
          <LineRound />
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Text style={styles.txtSubTitle}>Powered by</Text>
            <IcAppKep />
          </View>
        </View>
      </View>

      <ModalCenter
        visible={modalError}
        // onError={true}
        content={
          <View style={{ margin: 10, height: 200, alignContent: 'center' }}>
            <Text style={styles.txtTitleModal}>Internal Server Error</Text>
            <View style={{ width: 200, alignItems: 'center' }}>
              <IcError />
            </View>
            <Text style={styles.txtContent}>{msgError}</Text>
          </View>
        }
        onPressButton={() => setModalError(false)}
        btnText={"Ok"}
      />
      </ScrollView>
  );
};

export default SignIn;

