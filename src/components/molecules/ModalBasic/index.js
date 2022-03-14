import React from "react";
import { Modal, StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { Header } from "..";
import { IcBack } from "../../../assets";
import { COLOR_BASE_PRIMARY_MAIN, FONT_REGULAR, FONT_TITLE } from "../../../styles";

const ModalBasic = ({ title, onClosePress, visible,content}) => {
    return (
        <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
      >
        <View style={styles.centeredView}>
          {/* <Header onBack={onClosePress} /> */}
          <View style={styles.container}>
          <TouchableOpacity activeOpacity={0.7} onPress={onClosePress}>
          <View style={styles.back}>
            <IcBack />
          </View>
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
        </View>
          <View style={styles.modalView}>
           {content}
          </View>
        </View>
      </Modal>
    )
}

export default ModalBasic;

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        backgroundColor : 'white',
      },
      modalView: {
        marginTop: 20,
        backgroundColor: "white",
        height: '100%'
      },
      button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
      },
      buttonOpen: {
        backgroundColor: "#F194FF",
      },
      buttonClose: {
        backgroundColor: "#2196F3",
      },
      textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
      },
      modalText: {
        marginBottom: 15,
        textAlign: "center"
      },

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