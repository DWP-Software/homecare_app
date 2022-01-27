import AsyncStorage from '@react-native-async-storage/async-storage';
import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import { color } from 'react-native-reanimated';
import { IcInvite, IcProfile, IcProfileOn, IcSetting, ProfileDummy } from '../../assets';
import { Button, Gap, SubMenuVertical } from '../../components';
import { API_HOST } from '../../config';
import { COLOR_BASE_PRIMARY_MAIN, COLOR_BASE_PRIMARY_TEXT, COLOR_BASE_SECOND_TEXT, FONT_LIGHT, FONT_MEDIUM } from '../../styles';
import { getData, showMessage, storeData } from '../../utils';

const Profile = ({navigation}) => {
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

  const onShare = () => {

  }

  const signOut = () => {
    AsyncStorage.multiRemove(['token']).then(() => {
      navigation.reset({ index: 0, routes: [{ name: 'SplashScreen' }] })
  })
  }

  const updatePhoto = () => {
    ImagePicker.launchImageLibrary(
      {
        quality: 0.7,
        maxWidth: 200,
        maxHeight: 200,
      },
      (response) => {
        if (response.didCancel || response.error) {
          showMessage('Anda tidak memilih photo');
        } else {
          const dataImage = {
            uri: response.uri,
            type: response.type,
            name: response.fileName,
          };

          const photoForUpload = new FormData();
          photoForUpload.append('file', dataImage);
          getData('token').then((resToken) => {
            Axios.post(`${API_HOST.url}/user/photo`, photoForUpload, {
              headers: {
                Authorization: resToken.value,
                'Content-Type': 'multipart/form-data',
              },
            })
              .then((res) => {
                getData('userProfile').then((resUser) => {
                  showMessage('Update Photo Berhasil', 'success');
                  resUser.profile_photo_url = `${API_HOST.storage}/${res.data.data[0]}`;
                  storeData('userProfile', resUser).then(() => {
                    updateUserProfile();
                  });
                });
              })
              .catch((err) => {
                showMessage(
                  `${err?.response?.data?.message} on Update Photo API` ||
                    'Terjadi kesalahan di API Update Photo',
                );
              });
          });
        }
      },
    );
  };

  return (
    <ScrollView style={styles.page}>
      <View style={styles.profileDetail}>
        <View style={styles.photo}>
          <TouchableOpacity onPress={updatePhoto}>
            <View style={styles.borderPhoto}>
              <Image
                source={{uri : userProfile.photo}}
                style={styles.photoContainer}
              />
            </View>
          </TouchableOpacity>
        </View>
        <Text style={styles.name}>{userProfile.name}</Text>
        <Text style={styles.email}>{userProfile.email}</Text>
      </View>
      <View style={{marginTop : 20, paddingHorizontal : 20}}>

      <View style={styles.profileDetail2}>
        <Text style={[styles.textLabel]}>Nama</Text>
        <Text style={[styles.textDetail]}>{userProfile.name ? userProfile.name : "-"}</Text>
        <Gap height={15}/>
        <Text style={[styles.textLabel]}>Jenis Kelamin</Text>
        <Text style={[styles.textDetail]}>{userProfile.sex == 1 ? "Laki-Laki" : userProfile.sex == 2 ? "Perempuan" : "-" }</Text>
        <Gap height={15}/>
        <Text style={[styles.textLabel]}>Umur</Text>
        <Text style={[styles.textDetail]}>{userProfile.age ? userProfile.age : "-"} Thn</Text>
        <Gap height={15}/>
        <Text style={[styles.textLabel]}>Email</Text>
        <Text style={styles.textDetail}>{userProfile.email}</Text>
        <Gap height={15}/>
        <Text style={[styles.textLabel]}>No. Handphone</Text>
        <Text style={styles.textDetail}>{userProfile.phone}</Text>
        <Gap height={15}/>
        <Text style={[styles.textLabel]}>Alamat</Text>
        <Text style={styles.textDetail}>{userProfile.addressText ? userProfile.addressText : '-'}</Text>
      </View>
      <Gap height={20} />
      <View style={styles.profileDetail2}>
      <SubMenuVertical
                svg={<IcProfile/>}
                title={"Edit Profil"}
                onPress={() => navigation.navigate('EditProfile')}
            />
            <Gap height={10} />
            <SubMenuVertical
                svg={<IcSetting/>}
                title={"Ubah Password"}
                onPress={() => navigation.navigate('ChangePassword')}
            />
      </View>
      </View>
      <Gap height={20} />
      <View style={{paddingHorizontal : 20, flex:1, justifyContent:'flex-end'}}>
                <Button 
                 text={"Logout"}  
                 color={COLOR_BASE_PRIMARY_MAIN} 
                 textColor={'white'}
                 onPress={signOut}/>
            </View>
            <Gap height={30} />
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  page: {flex: 1},
  content: {flex: 1, marginTop: 24},
  profileDetail: {backgroundColor: COLOR_BASE_PRIMARY_MAIN, borderBottomLeftRadius : 20, borderBottomRightRadius : 20, paddingBottom: 26},
  profileDetail2: {backgroundColor: 'white', borderRadius : 16, paddingHorizontal : 20, paddingVertical : 20},
  name: {
    fontSize: 18,
    fontFamily: FONT_MEDIUM,
    color: 'white',
    textAlign: 'center',
  },
  email: {
    fontSize: 13,
    fontFamily: FONT_LIGHT,
    color: 'white',
    textAlign: 'center',
  },
  textLabel : {
    fontSize: 10,
    fontFamily: FONT_MEDIUM,
    color : COLOR_BASE_SECOND_TEXT 
  },
  textDetail: {
    fontSize: 14,
    fontFamily: FONT_MEDIUM,
    color : COLOR_BASE_PRIMARY_TEXT 
  },
  photo: {alignItems: 'center', marginTop: 26, marginBottom: 16},
  borderPhoto: {
    borderWidth: 1,
    borderColor: 'white',
    width: 110,
    height: 110,
    borderRadius: 110,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoContainer: {
    width: 90,
    height: 90,
    borderRadius: 90,
    backgroundColor: '#F0F0F0',
    padding: 24,
  },
});
