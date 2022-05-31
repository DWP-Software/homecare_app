import AsyncStorage from '@react-native-async-storage/async-storage';
import { default as axios, default as Axios } from 'axios';
import React, { useEffect, useState } from 'react';
import { Image, Pressable, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import { IcClose, IcProfile, IcSetting, IcStarOff, IcStarOn } from '../../assets';
import { Button, Gap, Loading, ModalCenter, SubMenuVertical } from '../../components';
import { endpoint } from '../../config/API/service';
import { COLOR_BASE_PRIMARY_MAIN, COLOR_BASE_PRIMARY_TEXT, COLOR_BASE_SECOND_TEXT, FONT_LIGHT, FONT_MEDIUM } from '../../styles';
import { getBase64FromUrl, getData, showMessage, storeData } from '../../utils';

const Profile = ({ navigation }) => {
  const [userProfile, setUserProfile] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [arrRate, setArrRate] = useState([1, 2, 3, 4, 5])
  const [token, setToken] = useState('')
  const [photo64, setPhoto64] = useState('')
  const [modalPhoto, setModalPhoto] = useState(false)

  useEffect(() => {
    navigation.addListener('focus', () => {
      _getDataUser()
    });
  }, [navigation]);

  const _getDataUser = () => {
    setIsLoading(true)
    getData('token').then((resToken) => {
      console.log('token', resToken)
      setToken(resToken.value)
      axios.get(endpoint.user, {
        headers: {
          Authorization: resToken?.value,
        },
      }).then(res => {
        const profile = res.data.data.user

        getPhoto(profile.photoUrl)

        storeData('userProfile', profile);
        setUserProfile(res.data.data.user)

        setIsLoading(false)

      }).catch((error) => {
        showMessage(error.response, 0)
        setIsLoading(false)
      });
    });
  }


  const getPhoto = (url) => {
    getData('token').then((resToken) => {
      getBase64FromUrl(url, resToken.value).then((res) => {
        setPhoto64(res)
      })
    })
  }

  const signOut = () => {
    AsyncStorage.multiRemove(['token']).then(() => {
      navigation.reset({ index: 0, routes: [{ name: 'SplashScreen' }] })
    })
  }

  const updatePhoto = () => {
    setModalPhoto(false)
    ImagePicker.launchImageLibrary(
      {
        quality: 0.7,
        maxWidth: 200,
        maxHeight: 200,
      },
      (response) => {
        if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.didCancel || response.error) {
          showMessage('Anda tidak memilih photo');
        } else {
          const dataImage = {
            uri: response.uri,
            type: response.type,
            name: response.fileName,
          };

          const photoForUpload = new FormData();
          photoForUpload.append('photo', dataImage);
          getData('token').then((resToken) => {
            Axios.post(endpoint.uploadfoto, photoForUpload, {
              headers: {
                Authorization: resToken.value,
                'Content-Type': 'multipart/form-data',
              },
            })
              .then((res) => {
                showMessage('Update Photo Berhasil', 1);
                const profile = res.data.data.user
                _getDataUser()

                setIsLoading(false)
              })
              .catch((err) => {
                setIsLoading(false)
                console.log(err.response)
                showMessage(`ini ${err.response}`);
              });
          });
        }
      },
    );
  };

  const cameraLaunch = () => {
    setModalPhoto(false)
    let options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.launchCamera(options, (res) => {
      console.log('Response = ', res);
      if (res.didCancel) {
        showMessage('Anda tidak memilih photo');
      } else if (res.error) {
        showMessage('ImagePicker Error:' + res.error);
      } else if (res.customButton) {
        showMessage('User tapped custom button: ' + res.customButton);
        alert(res.customButton);
      } else {
        const dataImage = {
          uri: res.uri,
          type: res.type,
          name: res.fileName,
        };

        const photoForUpload = new FormData();
        photoForUpload.append('photo', dataImage);
        getData('token').then((resToken) => {
          Axios.post(endpoint.uploadfoto, photoForUpload, {
            headers: {
              Authorization: resToken.value,
              'Content-Type': 'multipart/form-data',
            },
          })
            .then((res) => {
              showMessage('Update Photo Berhasil', 1);
              const profile = res.data.data.user
              _getDataUser()

              setIsLoading(false)
            })
            .catch((err) => {
              setIsLoading(false)
              console.log(err.response)
              showMessage(`ini ${err.response}`);
            });
        });
      }
    });
  }


  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

  const onRefresh = React.useCallback(() => {
    wait(2000).then(() =>
      _getDataUser())
  }, []);

  return (
    <ScrollView style={styles.page} refreshControl={
      <RefreshControl
        refreshing={isLoading}
        onRefresh={onRefresh}
      />
    }>
      <View style={styles.profileDetail}>
        <View style={styles.photo}>
          <TouchableOpacity onPress={() => setModalPhoto(true)}>
            <View style={styles.borderPhoto}>
              <Image
                source={{
                  uri: photo64
                  //  headers: {
                  //   Authorization: 'Bearer p1IsWrxMoTXL6U2Zxqhwte-1kvBSiPWA'
                  // }
                }}
                style={styles.photoContainer}
              />
              {/* <Image
                source={{
                  uri: photo64
                }}
                style={styles.photoContainer}
              /> */}
            </View>
          </TouchableOpacity>
        </View>
        <Text style={styles.name}>{userProfile.name}</Text>
        {userProfile.isNurse ?
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            {arrRate.map(obj => {
              return (
                obj <= userProfile.rate ?
                  <IcStarOn />
                  :
                  <IcStarOff />
              )
            })}
          </View>
          : <Text style={styles.email}>{userProfile.email}</Text>}
      </View>
      <View style={{ marginTop: 20, paddingHorizontal: 20 }}>

        <View style={styles.profileDetail2}>
          <Text style={[styles.textLabel]}>Nama</Text>
          <Text style={[styles.textDetail]}>{userProfile.name ? userProfile.name : "-"}</Text>
          <Gap height={15} />
          <Text style={[styles.textLabel]}>Jenis Kelamin</Text>
          <Text style={[styles.textDetail]}>{userProfile.sex == 1 ? "Laki-Laki" : userProfile.sex == 2 ? "Perempuan" : "-"}</Text>
          <Gap height={15} />
          <Text style={[styles.textLabel]}>Umur</Text>
          <Text style={[styles.textDetail]}>{userProfile.age ? userProfile.age : "-"} Thn</Text>
          <Gap height={15} />
          <Text style={[styles.textLabel]}>Email</Text>
          <Text style={styles.textDetail}>{userProfile.email}</Text>
          <Gap height={15} />
          <Text style={[styles.textLabel]}>No. Handphone</Text>
          <Text style={styles.textDetail}>{userProfile.phone}</Text>
          <Gap height={15} />
          <Text style={[styles.textLabel]}>Alamat</Text>
          <Text style={styles.textDetail}>{userProfile.addressText ? userProfile.addressText : '-'}</Text>
        </View>
        <Gap height={20} />
        <View style={styles.profileDetail2}>
          <SubMenuVertical
            svg={<IcProfile />}
            title={"Edit Profil"}
            onPress={() => navigation.navigate('EditProfile', { 'register': false })}
          />
          <Gap height={10} />
          <SubMenuVertical
            svg={<IcSetting />}
            title={"Ubah Password"}
            onPress={() => navigation.navigate('ChangePassword')}
          />
        </View>
      </View>
      <Gap height={20} />
      <View style={{ paddingHorizontal: 20, flex: 1, justifyContent: 'flex-end' }}>
        <Button
          text={"Logout"}
          color={COLOR_BASE_PRIMARY_MAIN}
          textColor={'white'}
          onPress={signOut} />
      </View>
      <Gap height={30} />
      {isLoading &&
        <Loading />}

      <ModalCenter
        visible={modalPhoto}
        button={false}
        content={
          <View>
            <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end', marginBottom: 15 }}>
              <Pressable onPress={() => setModalPhoto(false)}>
                <IcClose height={15} width={15} />
              </Pressable>
            </View>
            <Pressable onPress={updatePhoto} style={styles.boxImage}>
              <Text style={styles.textDetail}>Pilih Foto</Text>
            </Pressable>
            <Pressable onPress={cameraLaunch} style={styles.boxImage} >
              <Text style={styles.textDetail}>Ambil Foto</Text>
            </Pressable>
          </View>
        } />
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  page: { flex: 1 },
  content: { flex: 1, marginTop: 24 },
  profileDetail: { backgroundColor: COLOR_BASE_PRIMARY_MAIN, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, paddingBottom: 26 },
  profileDetail2: { backgroundColor: 'white', borderRadius: 16, paddingHorizontal: 20, paddingVertical: 20 },
  name: {
    fontSize: 18,
    fontFamily: FONT_MEDIUM,
    color: 'white',
    textAlign: 'center',
  },
  boxImage: { width: 200, alignItems: 'center', padding: 10, borderWidth: 1, borderColor: COLOR_BASE_PRIMARY_MAIN, marginBottom: 5, borderRadius: 5, borderStyle: 'dashed' },
  email: {
    fontSize: 13,
    fontFamily: FONT_LIGHT,
    color: 'white',
    textAlign: 'center',
  },
  textLabel: {
    fontSize: 10,
    fontFamily: FONT_MEDIUM,
    color: COLOR_BASE_SECOND_TEXT
  },
  textDetail: {
    fontSize: 14,
    fontFamily: FONT_MEDIUM,
    color: COLOR_BASE_PRIMARY_TEXT
  },
  photo: { alignItems: 'center', marginTop: 26, marginBottom: 16 },
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
