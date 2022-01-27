import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Text, Dimensions, ToastAndroid, Platform } from 'react-native';
import {
  IcEmergency,
  IcHomeOff,
  IcHomeOn,
  IcNotifOff,
  IcNotifOn,
  IcOrderOff,
  IcOrderOn,
  IcProfileOff,
  IcProfileOn,
} from '../../../assets';
import { FONT_HEADLINE1_PRIMARY, FONT_MEDIUM } from '../../../styles';
import GetLocation from 'react-native-get-location'
import { PERMISSIONS, request } from "react-native-permissions";
import axios from 'axios';
import { endpoint } from '../../../config/API/service';
import { getData } from '../../../utils';


const Icon = ({ label, focus }) => {
  switch (label) {
    case 'Home':
      return focus ? <IcHomeOn /> : <IcHomeOff />;
    case 'Order':
      return focus ? <IcOrderOn /> : <IcOrderOff />;
    case 'Notif':
      return focus ? <IcNotifOn /> : <IcNotifOff />;
    case 'Profile':
      return focus ? <IcProfileOn /> : <IcProfileOff />;
    case 'Panic':
      return <IcEmergency />;
    default:
      return <IcOrderOn />;
  }
};

const BottomNavigator = ({ state, descriptors, navigation, Nurse }) => {
  const focusedOptions = descriptors[state.routes[state.index].key].options;

  const [lat, setLat] = useState("")
  const [lng, setLng] = useState("")
  const { width } = Dimensions.get('window')

  if (focusedOptions.tabBarVisible === false) {
    return null;
  }


  const checkPermisson = () => {
    try {
      request(
        Platform.select({
          android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
          ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        })
      ).then(res => {
        if (res == "granted") {
          getLocation();
        } else {
          sendLocation(0, 0)
        }
      })
    } catch (error) {
      console.log("location set error:", error);
    }
  }

  const getLocation = () => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
      .then(location => {
        console.log(location);
        sendLocation(location.latitude, location.longitude)
      })
      .catch(error => {
        const { code, message } = error;
        console.warn(code, message);
      })
  }

  const sendLocation = (latitude, longitude) => {
    getData('token').then((resToken) => {
      const form = new FormData();
      form.append("latitude", latitude)
      form.append("longitude", longitude)
      axios.post(endpoint.emergency, form, {
        headers: {
          Authorization: resToken.value,
        },
      })
        .then((res) => {
          ToastAndroid.showWithGravity(res.data.message, ToastAndroid.SHORT, ToastAndroid.BOTTOM)
        })
        .catch((err) => {
          ToastAndroid.showWithGravity(err?.response.message, ToastAndroid.SHORT, ToastAndroid.BOTTOM)
        });
    });
  }

  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;
        var click = 0
        var confirm = 3

        const onPress = () => {
          if (label == 'Panic') {
            if (click < 3) {
              click = click + 1;
              confirm = confirm - 1
              if (confirm >= 1)
                ToastAndroid.showWithGravity(`Tekan ${confirm} kali lagi untuk mengirim pesan darurat`, ToastAndroid.SHORT, ToastAndroid.BOTTOM)
              else {
                checkPermisson()
              }
            } else {
              click = 0
              confirm = 3
            }
          } else {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          }
        };

        const onLongPress = () => {
          console.log('panic uy')
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        if (label === 'Panic') {
          return (
            <TouchableOpacity
              key={index}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={[styles.btnPanic,
              { left: (width / 2) - 35 }
              ]}
            >
              {/* <Text style={styles.txtButton}>Panic Button</Text> */}
              <Icon label={label} focus={isFocused} />
            </TouchableOpacity>
          );
        }

        return (
          <TouchableOpacity
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            style={Nurse ? index == 1 ? { paddingRight: 50 } : index == 3 ? { marginLeft: 50 } : null : null}
            onLongPress={onLongPress}>
            <Icon label={label} focus={isFocused} />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default BottomNavigator;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingTop: 15,
    paddingBottom: 13,
    paddingHorizontal: 50,
    justifyContent: 'space-between',
  },
  btnPanic: {
    backgroundColor: '#FECF32',
    height: 70,
    width: 70,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 10,
    borderRadius: 50,
    position: 'absolute',
    zIndex: 99,
    elevation: 4
  },
  txtButton: {
    textAlign: 'center',
    fontFamily: FONT_MEDIUM,
    color: 'white'
  }
});
