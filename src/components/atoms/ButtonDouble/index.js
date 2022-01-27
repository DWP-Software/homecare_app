import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Gap } from '..';
import { COLOR_BASE_PRIMARY_MAIN } from '../../../styles';

const ButtonDouble = ({btnLeftText, btnRightText, btnLeftOnPress, btnRightOnPress}) => {
  return (
    // <View style={{flex : 1}}>
    <View style={styles.containerUp}>
    <Pressable activeOpacity={0.7} onPress={btnLeftOnPress} style={styles.containerLeft}>
      <View>
        <Text style={styles.textLeft}>{btnLeftText}</Text>
      </View>
    </Pressable>
    <Pressable activeOpacity={0.7} onPress={btnRightOnPress} style={styles.containerRight}>
      <View>
        <Text style={styles.text}>{btnRightText}</Text>
      </View>
    </Pressable>
    </View> 
    // </View>
  );
};

export default ButtonDouble;

const styles = StyleSheet.create({
  containerUp : {
    width : '80%',
    flexDirection: 'row',
    },
  containerLeft: {
    backgroundColor: 'white',
    borderWidth : 1,
    borderColor : COLOR_BASE_PRIMARY_MAIN,
    paddingHorizontal: 15,
    paddingVertical : 12,
    borderRadius: 8,
    width : '60%'
  },
  containerRight: {
    backgroundColor: COLOR_BASE_PRIMARY_MAIN,
    paddingHorizontal: 15,
    paddingVertical : 12,
    borderRadius: 8,
    width : '60%',
    marginLeft : 10
  },
  text:{
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: 'white',
    textAlign: 'center',
  },
  textLeft:{
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: COLOR_BASE_PRIMARY_MAIN,
    textAlign: 'center',
  },
});
