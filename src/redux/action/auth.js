import Axios from 'axios';
import {API_HOST} from '../../config';
import { endpoint } from '../../config/API/service';
import {showMessage, storeData} from '../../utils';
import {setLoading} from './global';


export const signUpAction = (form, navigation) => (dispatch) => {
  dispatch(setLoading(true));
  Axios.post(endpoint.registration, form)
    .then((res) => {
      console.log('res', res.data)
      showMessage(res.data.message, res.data.status);
      dispatch(setLoading(false));
      if(res.data.status){
        if(res.data.data.otpRequired){
          navigation.navigate('OTP')
        }else{
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

export const signInAction = (form, navigation) => (dispatch) => {
  dispatch(setLoading(true));
  Axios.post(endpoint.login, form)
    .then((res) => {
      if(res.data.status){
      const token = `Bearer ${res.data.data.token}`;
      const profile = res.data.data.user;
      console.log('profile', profile)
      console.log('token', token)
      dispatch(setLoading(false));
      storeData('token', {value: token});
      storeData('userProfile', profile);
      navigation.reset({index: 0, routes: [{name: 'MainApp'}]});
      }else{
        dispatch(setLoading(false));
        showMessage(res.data.message);
      }
    })
    .catch((err) => {
      dispatch(setLoading(false));
      showMessage(err?.response?.data);
    });
};
