import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { Dimensions, Modal, StyleSheet, Text, View } from "react-native";
import { Button } from "../..";
import { IcError } from "../../../assets";
import { COLOR_BASE_PRIMARY_TEXT, FONT_BOLD, FONT_REGULAR } from "../../../styles";

const ModalBottom = ({ onPressButton, onError = false, btnText, visible, content, navigation }) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    {content}
                    <View>
                        <Button text={btnText} onPress={onPressButton} />
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export default ModalBottom;

const styles = StyleSheet.create({
    centeredView: {
        backgroundColor: 'rgba(8, 29, 67, 0.3)',
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "flex-end",
    },
    modalView: {
        backgroundColor: "white",
        borderRadius: 20,
        width : '100%',
        padding: 35,
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