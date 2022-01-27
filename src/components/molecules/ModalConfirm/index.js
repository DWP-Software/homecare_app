import React from "react";
import { Modal, StyleSheet, View } from "react-native";
import { ButtonDouble } from "../..";
import { COLOR_BASE_PRIMARY_TEXT, COLOR_RED, FONT_BOLD, FONT_REGULAR } from "../../../styles";

const ModalConfirm = ({ visible, content, onPressBtnLeft, onPressBtnRight, btnLeftText, btnRightText}) => {
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
                    <ButtonDouble 
                        btnLeftText={btnLeftText}
                        btnRightText={btnRightText}
                        btnLeftColor={'white'}
                        btnRightColor={COLOR_RED}
                        btnRightTextColor={'white'}
                        btnLeftTextColor={COLOR_RED}
                        btnLeftOnPress={onPressBtnLeft}
                        btnRightOnPress={onPressBtnRight}/>
                        
                    {/* <View style={{flexDirection : 'row', alignItems : 'stretch', justifyContent : 'space-between', padding : 10, width : 120}}>
                    <Button text={btnRightText} onPress={onPressBtnRight} />
                    <Button text={btnLeftText} onPress={onPressBtnLeft} color={COLOR_RED} textColor={'white'}/>
                    </View> */}
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export default ModalConfirm;

const styles = StyleSheet.create({
    centeredView: {
        backgroundColor : 'rgba(8, 29, 67, 0.3)',
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        width : '80%',
        backgroundColor: "white",
        borderRadius: 20,
        paddingHorizontal: 30,
        paddingVertical : 20,
        justifyContent : 'center',
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