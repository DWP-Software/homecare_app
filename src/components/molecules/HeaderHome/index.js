import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {IcBack} from '../../../assets';
import { COLOR_BASE_PRIMARY_MAIN, FONT_SUBTITLE, FONT_TITLE } from '../../../styles';

const Header = ({title, subTitle, onBack}) => {
  return (
    <View style={styles.container}>
      {onBack && (
        <TouchableOpacity activeOpacity={0.7} onPress={onBack}>
          <View style={styles.back}>
            <IcBack />
          </View>
        </TouchableOpacity>
      )}
      <View>
        <Text style={styles.title}>{title}</Text>
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLOR_BASE_PRIMARY_MAIN,
    paddingHorizontal: 24,
    paddingTop: 10,
    borderBottomRightRadius : 16,
    borderBottomLeftRadius : 16,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {...FONT_TITLE, color: 'white'},
  back: {
    padding: 10,
    marginLeft: -10,
  },
});
