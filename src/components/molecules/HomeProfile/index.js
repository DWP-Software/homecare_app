import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import {ProfileDummy} from '../../../assets';
import { COLOR_BASE_PRIMARY_MAIN, COLOR_BASE_PRIMARY_TEXT, FONT_MEDIUM, FONT_REGULAR } from '../../../styles';
import {getData} from '../../../utils';

const HomeProfile = () => {
  const navigation = useNavigation();
  const [photo, setPhoto] = useState(ProfileDummy);

  const [userProfile, setUserProfile] = useState({});
  useEffect(() => {
    navigation.addListener('focus', () => {
      updateUserProfile();
    });
  }, [navigation]);

  const updateUserProfile = () => {
    getData('userProfile').then((res) => {
      setUserProfile(res);
    });
  };

  return (
    <View style={styles.profileContainer}>
      <View style={{flexDirection : 'row', alignItems : 'center'}}>
        <View style={styles.borderPhoto}>
      <Image source={userProfile.photo ? {uri : userProfile.photo} : ProfileDummy} style={styles.profile} />
        </View>
        <Text style={styles.appName}>Howdy, {userProfile.name}</Text>
      </View>
      <Text  style={styles.desc}>Temukan perawat yang anda butuhkan dengan cepat</Text>
    </View>
  );
};

export default HomeProfile;

const styles = StyleSheet.create({
  profileContainer: {
    paddingHorizontal: 24,
    paddingTop: 32,
    borderBottomLeftRadius : 16,
    borderBottomRightRadius : 16,
    paddingBottom: 24,
    backgroundColor: COLOR_BASE_PRIMARY_MAIN,
  },
  borderPhoto: {
    borderWidth: 1,
    borderColor: 'white',
    width: 52,
    height: 52,
    borderRadius: 110,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appName: {fontSize: 16, fontFamily: FONT_REGULAR, color: 'white', marginLeft : 12},
  desc: {fontSize: 20, fontFamily: FONT_MEDIUM, color: 'white', marginTop : 30},
  profile: {width: 47, height: 47, borderRadius: 50},
});
