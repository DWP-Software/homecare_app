import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { IOrderSuccess } from '../../assets';
import { Gap } from '../../components';
import styles from './styles';

const SuccessOrder = ({ navigation, route }) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'OrderDetail',
            params : {
              id : route.params.id,
              prev : 'screenSuccess'
            }
          }
        ]
      });
    }, 5000);
  }, []);

  return (
    <View style={styles.page}>
      <IOrderSuccess />
      <Gap height={30} />
      <Text style={styles.title}>{route.params.msg}</Text>
    </View>
  );
};

export default SuccessOrder;


