import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { IEmptyNotif } from '../../../assets';
import { FONT_LIGHT, FONT_REGULAR } from '../../../styles';
import { Button, Gap } from '../../atoms';

const EmptyNotif = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.page}>
      <IEmptyNotif />
      <Gap height={50} />
      <Text style={styles.title}>Tidak ada Pemberitahuan</Text>
      <Gap height={6} />
      <Text style={styles.subTitle}>Anda belum memiliki aktivitas apapun</Text>
      {/* <View style={styles.buttonContainer}>
        <Button
          text=""
          onPress={() => navigation.replace('MainApp')}
        />
      </View> */}
    </View>
  );
};

export default EmptyNotif;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  title: {fontSize: 20, fontFamily: FONT_REGULAR, color: '#020202'},
  subTitle: {fontSize: 14, fontFamily: FONT_LIGHT, color: '#8D92A3'},
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 80,
  },
});
