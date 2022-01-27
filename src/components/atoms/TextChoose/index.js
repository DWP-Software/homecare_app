import React from 'react';
import { StyleSheet, Text, View, TextInput as TextInputRN } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { COLOR_BASE_PRIMARY_TEXT, COLOR_RED, COLOR_SHADOW, FONT_REGULAR } from '../../../styles';

const TextChoose = ({ label, value, errorMsg, onPress, ...restProps }) => {
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
    <View>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.input}>{value}</Text>
      <Text style={{color : COLOR_RED, fontSize : 12}}>{errorMsg}</Text>
    </View>
      </TouchableOpacity>
  );
};

export default TextChoose;

const styles = StyleSheet.create({
  label: { fontSize: 14, fontFamily: FONT_REGULAR, color: COLOR_BASE_PRIMARY_TEXT },
  input: { borderWidth: 1, borderColor: COLOR_SHADOW, borderRadius: 8, paddingHorizontal : 10, paddingVertical : 15, backgroundColor : 'white' },
});
