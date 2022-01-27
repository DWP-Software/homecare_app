import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import { COLOR_BASE_PRIMARY_TEXT, COLOR_BASE_SECOND_TEXT, COLOR_SHADOW, FONT_BOLD, FONT_MEDIUM, FONT_REGULAR } from '../../../styles';
import Number from '../Number';

const ItemValue = ({label, value, valueColor = COLOR_BASE_PRIMARY_TEXT, bgColor = 'white', type, layout, bold}) => {
  return (
    (layout == 'vertical') ? 
    <View>
    <View style={[styles.container,{marginTop : 5}]}>
      <Text style={bold ? [styles.label, {fontFamily : FONT_BOLD}] : styles.label}>{label}</Text>
      {type === 'currency' ? (
        <Number number={value} style={bold ? [styles.valueVer(valueColor), {fontFamily : FONT_BOLD}] : styles.valueVer(valueColor)} />
      ) : type === 'status' ?
      <Text style={styles.status(bgColor,valueColor)}>{value}</Text>
      : (
        <Text style={bold ? styles.label : [styles.valueVer(valueColor),{textAlign : 'right'}]}>{value}</Text>
      )}
    </View>
    <View style={{ borderWidth: 0.5, borderColor: COLOR_SHADOW, marginVertical: 10 }} />
    </View>
    :
    <View style={{marginTop : 5}}>
      <Text style={styles.label}>{label}</Text>
      {type === 'currency' ? (
        <Number number={value} style={styles.value(valueColor)} />
      )
      : type === 'status' ?
      <Text style={styles.status(bgColor,valueColor)}>{value}</Text>
       : (
        <Text style={styles.value(valueColor)}>{value}</Text>
      )}
      <View style={{ borderWidth: 0.5, borderColor: COLOR_SHADOW, marginVertical: 10 }} />
    </View>
  );
};

export default ItemValue;

const styles = StyleSheet.create({
  container: {flexDirection : 'row',justifyContent: 'space-between', marginRight : 10},
  label: {fontSize: 14,
    fontFamily: FONT_REGULAR,
    color: COLOR_BASE_SECOND_TEXT},
  value: (color) =>({
    flexShrink: 1,
    fontSize: 14,
    color : color,
    fontFamily:FONT_REGULAR,
    // alignSelf: 'flex-end',
  }),
  valueVer: (color) =>({
    flexShrink: 1,
    fontSize: 14,
    color : color,
    marginLeft : 16,
    fontFamily:FONT_REGULAR,
    alignSelf: 'flex-end',
  }),
  status: (bgColor, txtColor) => ({ backgroundColor: bgColor, color: txtColor, paddingHorizontal : 20, paddingVertical : 5 , borderRadius: 10, alignSelf: 'flex-end' }),

});
