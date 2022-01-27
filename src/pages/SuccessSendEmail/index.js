import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { IOrderSuccess } from '../../assets';
import { Gap } from '../../components';
import { getData } from '../../utils';

const SuccessSendEmail = ({ navigation }) => {
  useEffect(() => {
    setTimeout(() => {
      getData('token').then((res) => {
        if (res) {
          getData('userProfile').then((res) => {
            if (!res.isNurse) {
              navigation.reset({ index: 0, routes: [{ name: 'MainApp' }] });
            } else {
              navigation.reset({ index: 0, routes: [{ name: 'NurseApp' }] });
            }
          });
        }
      });
    }, 3000);
  }, []);

  return (
    <View style={styles.page}>
      <IOrderSuccess />
      <Gap height={30} />
      <Text style={styles.title}>Pesanan Berhasil Dibuat</Text>
      <Gap height={6} />
      <Text style={styles.subTitle}>tunggu konfirmasi dari perawat kami </Text>
      <Text style={styles.subTitle}>untuk dapat melanjutkan pembayaran</Text>
    </View>
  );
};

export default SuccessSendEmail;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  title: { fontSize: 20, fontFamily: 'Poppins-Regular', color: '#020202' },
  subTitle: { fontSize: 14, fontFamily: 'Poppins-Light', color: '#8D92A3' },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 80,
  },
});
