import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { IcBack } from '../../../assets';
import { COLOR_BASE_PRIMARY_MAIN, FONT_REGULAR, FONT_SUBTITLE, FONT_TITLE } from '../../../styles';

const Header = ({ title, subTitle, onBack }) => {
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
        <Text style={onBack ? styles.title : styles.title2}>{title}</Text>
        {subTitle ?
        <Text style={styles.desc}>{subTitle}</Text>
        : null}
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
    borderBottomRightRadius: 16,
    borderBottomLeftRadius: 16,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    elevation : 3
  },
  title: { ...FONT_TITLE, color: 'white' },
  title2: {
    ...FONT_TITLE, color: 'white', padding: 10,
    marginLeft: -10
  },
  desc: {
    fontFamily : FONT_REGULAR, fontSize : 12, color: 'white', paddingLeft : 10,
    marginLeft: -10
  },
  back: {
    padding: 10,
    marginLeft: -10,
  },
});
