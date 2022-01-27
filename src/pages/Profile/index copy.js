import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useEffect, useState } from 'react'
import { Image, Share, Text, View } from 'react-native'
import { IcInvite } from '../../assets'
import { Button, Header, SubMenuVertical } from '../../components'
import { getData, useForm } from '../../utils'
import styles from './styles'


const Profile = ({navigation}) => {
  const [profile, setProfile] = useState({})
  const [form, setForm] = useForm({
      avatar: 'https://refilmery.com/wp-content/uploads/2016/05/avatar-inside-a-circle.png'
  })
  useEffect(() => {
      // dispatch(getFoodData())
      getData('userProfile').then((res) => {
          setProfile(res)
          // console.log(res.name)
      })
  })

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
    <View style={styles.container}>
    <View style={{ backgroundColor: '#F4F4F4', paddingBottom: 20 }}>
        <Header
            color={'#F4F4F4'}
            title="Profil"
            onBack={() => navigation.goBack()}
        />
        <View style={{ alignItems: 'center' }}>
            <View style={styles.round}>
                <Image source={{ uri: form.avatar }} style={{ width: 80, height: 80 }} />
            </View>
            <Text style={styles.txtName}>{profile.name}</Text>
            <Text style={styles.txtDate}>{profile.email}</Text>
        </View>
    </View>
    <View style={{marginTop : 20, padding : 20}}>
    {/* <SubMenuVertical
        svg={<IcProfile/>}
        title={"Edit Profile"}
        // onPress={''}
        styleCustom={{ marginRight: 15 }}
    /> */}
    <SubMenuVertical
        svg={<IcInvite/>}
        title={"Invite a friend"}
        onPress={onShare}
        styleCustom={{ marginRight: 15, marginTop : 20 }}
    />
    {/* <SubMenuVertical
        svg={<IcSetting/>}
        title={"Settings"}
        // onPress={''}
        styleCustom={{ marginRight: 15, marginTop : 20 }}
    /> */}
    {/* <SubMenuVertical
        svg={<IcHelp/>}
        title={"Help Center"}
        // onPress={console.log('help')}
        styleCustom={{ marginRight: 15, marginTop : 20 }}
    /> */}
    </View>
    <View style={{padding : 24, flex:1, justifyContent:'flex-end'}}>
        <Button 
         text={"Logout"}  
         color={'#F0A113'} 
         textColor={'#FFFFFF'}
         onPress={signOut}/>
    </View>
</View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  page: {flex: 1},
  content: {flex: 1, marginTop: 24},
  profileDetail: {backgroundColor: 'white', paddingBottom: 26},
  name: {
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
    color: '#020202',
    textAlign: 'center',
  },
  email: {
    fontSize: 13,
    fontFamily: 'Poppins-Light',
    color: '#8D92A3',
    textAlign: 'center',
  },
  photo: {alignItems: 'center', marginTop: 26, marginBottom: 16},
  borderPhoto: {
    borderWidth: 1,
    borderColor: '#8D92A3',
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
