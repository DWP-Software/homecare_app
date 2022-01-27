import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Picker } from '@react-native-community/picker';
import { COLOR_BASE_PRIMARY_TEXT, COLOR_SHADOW, FONT_REGULAR } from '../../../styles';

const Select = ({ label, value, onSelectChange, data, onPress}) => {
  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
      <View style={styles.input}>
        <Picker
          selectedValue={value}
          style={{fontFamily : FONT_REGULAR, fontSize : 11}}
          onValueChange={(itemValue) => onSelectChange(itemValue)}>
          {data.map(obj => {
            return(
            <Picker.Item label={obj.value} value={obj.id}/>
            )
          })}
        </Picker>
      </View>
      </TouchableOpacity>
    </View>
  );
};

export default Select;

const styles = StyleSheet.create({
  label: { fontSize: 14, fontFamily: FONT_REGULAR, color: COLOR_BASE_PRIMARY_TEXT },
  input: {
    borderWidth: 1,
    borderColor: COLOR_SHADOW,
    borderRadius: 8,
    fontSize : 12
  },
});
