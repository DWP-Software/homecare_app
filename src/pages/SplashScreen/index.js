import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { IcAppKep, LineRound, Logo } from '../../assets';
import { endpoint } from '../../config/API/service';
import { getData } from '../../utils';
import styles from './styles';

const SplashScreen = ({ navigation }) => {
  const [isLoggin, setIsLoggin] = useState(false)
  useEffect(() => {
    setTimeout(() => {
      _getDataUser()
    }, 2000);
  }, []);


  const _getDataUser = () => {
    getData('token').then((resToken) => {
      console.log('token', resToken)
      axios.get(endpoint.user, {
        headers: {
          Authorization: resToken?.value,
        },
      }).then(res => {

        getData('userProfile').then((res) => {
          if (!res.isNurse) {
            navigation.reset({ index: 0, routes: [{ name: 'MainApp' }] });
          } else {
            navigation.reset({ index: 0, routes: [{ name: 'NurseApp' }] });
          }
        }).catch((err) => {
            AsyncStorage.multiRemove(['token']).then(() => {
              navigation.replace('SignIn');
            })
        })

      }).catch((error) => {
        navigation.replace('SignIn');
      });
    });
  }

  return (
    <View style={styles.container}>
      <View style={{ alignItems: 'center' }}>
        <Logo />
      </View>
      <View style={styles.bottomContainer}>
        <View style={{ flexDirection: 'row' }}>
          <LineRound />
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Text style={styles.txtSubTitle}>Powered by</Text>
            <IcAppKep />
          </View>
        </View>
      </View>
    </View>
  );
};

export default SplashScreen;

