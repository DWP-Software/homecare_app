import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Button, Gap, Header, TextInput } from '../../components'
import { endpoint } from '../../config/API/service'

const ChangePassword = ({ navigation }) => {
    const [password, setpassword] = useState('')
    const [confirmPassword, setconfirmPassword] = useState('')
    const [errPsw, seterrPsw] = useState('')
    const [errConfirmPassword, seterrConfirmPassword] = useState('')

    const onSubmit = () => {
        if(password.length == 0)
            seterrPsw('Password tidak boleh kosong')
        if(confirmPassword.length == 0)
        seterrConfirmPassword('Konfirmasi Password tidak boleh kosong')

        if(password.length > 0 && password.length <= 6)
            seterrPsw('password harus lebih dari 6 karakter')

        if(password != confirmPassword)
            seterrConfirmPassword('Password tidak sama')
        
        if(password.length > 6 && password == confirmPassword){
           _handleSubmit()
        }
    }

    const _handleSubmit = () => {
        const formData = new FormData()
      formData.append('password', password);
        getData('token').then((resToken) => {
        axios.put(endpoint.changePassword(password), formData, {
            headers: {
              Authorization: resToken.value,
            },
          }).then((res) => {
            showMessage('Password berhasil diubah', 1);
            AsyncStorage.multiRemove(['token']).then(() => {
                navigation.reset({ index: 0, routes: [{ name: 'SplashScreen' }] })
            })
          })
          .catch((err) => {
            showMessage(
              `${err?.response?.data?.message} on Update Profile API` ||
              'Terjadi kesalahan di API Update Profile',
            );
          });
        });
    }

    return (
        <View style={{ flex: 1, backgroundColor : 'white'}}>
            <Header title={"Ubah Password"} onBack={() => navigation.goBack()} />
            <View style={{padding : 16}}>
            <Gap height={30} />
            <TextInput 
                label={"Password baru"} 
                value={password} 
                secureTextEntry
                errorMsg={errPsw}
                onChangeText={(value) => {setpassword(value), seterrPsw('')}}/>
                 <Gap height={15} />
            <TextInput 
                label={"Konfirmasi Password"} 
                value={confirmPassword}  
                secureTextEntry
                errorMsg={errConfirmPassword}
                onChangeText={(value) => {setconfirmPassword(value), seterrConfirmPassword('')}}/>
            <Gap height={30} />
            <Button text={"Simpan"} onPress={onSubmit}/>
            </View>
        </View>
    )
}

export default ChangePassword

const styles = StyleSheet.create({})
