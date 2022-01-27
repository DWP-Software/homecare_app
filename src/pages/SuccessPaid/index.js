import React from 'react';
import { useEffect } from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {IAssigned, IlSuccessOrder, IOrderSuccess, IPaidSuccess} from '../../assets';
import {Button, Gap} from '../../components';
import { getData } from '../../utils';

const SuccessOrder = ({navigation, route}) => {
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
    }, 5000);
  }, []);

  return (
    <View style={styles.page}>
      {route.type == "paid" ?
      <IPaidSuccess />
      :
      <IAssigned />
      }
      <Gap height={30} />
      <Text style={styles.title}>{route.params.msg}</Text>
    </View>
  );
};

export default SuccessOrder;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding : 26
  },
  title: {fontSize: 20, fontFamily: 'Poppins-Regular', color: '#020202', textAlign : 'center'},
  subTitle: {fontSize: 14, fontFamily: 'Poppins-Light', color: '#8D92A3'},
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 80,
  },
});
