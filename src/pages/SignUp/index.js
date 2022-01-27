import React, { useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import { useDispatch } from 'react-redux';
import { Button, Gap, Header, TextInput } from '../../components';
import { showMessage, storeData, useForm } from '../../utils';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Axios from 'axios';
import { endpoint } from '../../config/API/service';
import { setLoading } from '../../redux/action';


const SignUp = ({ navigation }) => {
  const [form, setForm] = useForm({
    phone: '',
    email: '',
    password: '',
    confirmation_password: '',
  });
  const [errPhone, setErrPhone] = useState(null)
  const [errEmail, setErrEmail] = useState(null)
  const [errPsw, setErrPsw] = useState(null)
  const [errConfirmPassword, setErrConfirmPassword] = useState(null)

  const dispatch = useDispatch();

  const onSubmit = () => {
    if (form.email == '') {
      setErrEmail('Email tidak boleh kosong')
    }
    if (form.phone == '') {
      setErrPhone('No.Hp tidak boleh kosong')
    }
    if (form.password == '') {
      setErrPsw('Password tidak boleh kosong')
    }
    if (form.password != form.confirmation_password) {
      setErrConfirmPassword('Password tidak sama')
    }

    if (form.email != '' && form.name != '' && form.phone != '' && form.password != '' && form.password == form.confirmation_password) {
      setErrConfirmPassword(null)
      setErrPsw(null)
      setErrPhone(null)
      setErrEmail(null)
      const data = new FormData();
      data.append('phone', form.phone);
      data.append('email', form.email);
      data.append('password', form.password);
      dispatch(signUpAction(data, navigation));
    }
  };

  const signUpAction = (form, navigation) => (dispatch) => {
    dispatch(setLoading(true));
    Axios.post(endpoint.registration, form)
      .then((res) => {
        console.log('res', res.data)
        showMessage("Lengkapi profile anda terlebih untuk dapat melanjutkan ", 1);
        dispatch(setLoading(false));
        if (res.data.data.otpRequired) {
          navigation.navigate('OTP')
        } else {
          const token = `Bearer ${res.data.data.token}`;
          const profile = res.data.data.user;
          console.log('profile', profile)
          console.log('token', token)
          dispatch(setLoading(false));
          storeData('token', { value: token, id :  res.data.data.user.id });
          storeData('userProfile', profile);
          navigation.navigate('EditProfile', { profile: profile })
        }
      })
      .catch((err) => {
        dispatch(setLoading(false));
        // showMessage(err);
        console.log('err', err?.response.status)
        if ( err?.response.status == 302 && err?.response?.data.message == "No.HP sudah terdaftar. Silahkan klik Login.")
          setErrPhone(err?.response?.data.message)
        else if ( err?.response.status == 302 && err?.response?.data.message == "Email sudah terdaftar. Silahkan klik Login.")
          setErrEmail(err?.response?.data.message)
      });
  };



  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <View style={styles.page}>
        <Header
          title="Registrasi"
          onBack={() => navigation.goBack()}
        />
        <View style={styles.container}>
          <TextInput
            label="Email"
            value={form.email}
            errorMsg={errEmail}
            onChangeText={(value) => { setForm('email', value), setErrEmail(null) }}
          />
          <Gap height={5} />
          <TextInput
            label="No Hp"
            value={form.phone}
            keyboardType="phone-pad"
            errorMsg={errPhone}
            onChangeText={(value) => { setForm('phone', value), setErrPhone(null) }}
          />
          <Gap height={5} />
          <TextInput
            label="Password"
            value={form.password}
            errorMsg={errPsw}
            onChangeText={(value) => { setForm('password', value), setErrPsw(null) }}
            secureTextEntry
          />
          <Gap height={5} />
          <TextInput
            label="Konfirmasi Password"
            value={form.confirmation_password}
            onChangeText={(value) => { setForm('confirmation_password', value), setErrConfirmPassword(null) }}
            secureTextEntry
            errorMsg={errConfirmPassword}
          />
          <Gap height={24} />
          <Button text="Selanjutnya" onPress={onSubmit} />
        </View>
      </View>
    </ScrollView>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  scroll: { flexGrow: 1 },
  page: { flex: 1, backgroundColor: 'white' },
  container: {
    backgroundColor: 'white',
    paddingHorizontal: 24,
    paddingVertical: 26,
    marginTop: 24,
    flex: 1,
  },
  photo: { alignItems: 'center', marginTop: 26, marginBottom: 16 },
  borderPhoto: {
    borderWidth: 1,
    borderColor: '#8D92A3',
    width: 110,
    height: 110,
    borderRadius: 110,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoContainer: {
    width: 90,
    height: 90,
    borderRadius: 90,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPhoto: {
    fontSize: 14,
    fontFamily: 'Poppins-Light',
    color: '#8D92A3',
    textAlign: 'center',
  },
});
