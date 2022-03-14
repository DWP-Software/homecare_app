import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { Modal, StyleSheet, Text, View } from "react-native";
import { Button } from "../..";
import { IcClose, IcError } from "../../../assets";
import { COLOR_BASE_PRIMARY_TEXT, FONT_BOLD, FONT_REGULAR } from "../../../styles";

const ModalCenter = ({ onPressButton, onError = false, btnText, onPressClose, visible, content, navigation, button = true }) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    {content ? content
                        :
                        <View style={{ margin: 10, height: 200, alignContent: 'center' }}>
                            <Text style={styles.txtTitleModal}>Internal Server Error</Text>
                            <View style={{ width: 200, alignItems: 'center' }}>
                                <IcError />
                            </View>
                            <Text style={styles.txtContent}>{"Anda terlogout, \n Silahkan login kembali"}</Text>
                        </View>
                    }
                    {onError ?
                        <Button text={btnText} onPress={() =>
                            AsyncStorage.multiRemove(['token']).then(() => {
                                navigation.reset({ index: 0, routes: [{ name: 'SplashScreen' }] })
                            })
                        } />
                        : button ? 
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
                            <Button color="black" text={'Close'} onPress={onPressClose} />
                            <View style={{ marginRight: 10 }} />
                            <Button text={btnText} onPress={onPressButton} />
                        </View>
                         : null
                    }
                </View>
            </View>
        </Modal>
    )
}

export default ModalCenter;

const styles = StyleSheet.create({
    centeredView: {
        backgroundColor: 'rgba(8, 29, 67, 0.3)',
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
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
    txtTitleModal: {
        textAlign: 'center',
        fontFamily: FONT_BOLD,
        fontSize: 20,
        color: COLOR_BASE_PRIMARY_TEXT
    },
    txtContent: {
        fontFamily: FONT_REGULAR,
        fontSize: 15,
        marginTop: 20,
        textAlign: 'center',
        color: COLOR_BASE_PRIMARY_TEXT
    },
});