import { StyleSheet } from 'react-native'


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    cointainerHeader: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
    containerBody: {
        padding: 20,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        marginTop: 30,
        height: '100%'
    },
    containerBanner: {
        backgroundColor: '#FFFFFF',
        width: '90%', height: 130,
        borderRadius: 20,
        marginHorizontal: 20,
        elevation : 5
    },
    msgHeader: {
        backgroundColor: '#FFD15B',
        paddingVertical: 9,
        paddingHorizontal: 14,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    txtName: {
        color: '#2F3542',
        fontSize: 24
    },
    txtMsg: {
        fontFamily: 'Poppins-Regular'
    },
    txtNext: {
        fontFamily: 'Poppins-Medium',
        color: '#CF0505'
    },
    txtTitle : {
        fontSize : 14,
        fontFamily: 'Poppins-Regular',
        color : '#000000'
    },
    txtDate : {
        fontSize : 14,
        fontFamily: 'Poppins-Regular',
        color : '#C4C4C4'
    },
    txtTotal : {
        fontSize : 18,
        fontFamily: 'Poppins-Medium',
        color : '#000000'
    },
    round : {
        width : 100,
        height : 100,
        borderRadius : 60,
        borderColor : '#F0A113',
        borderWidth : 1,
        justifyContent : 'center',
        alignItems : 'center',
        padding: 3,
    },
    roundWhite : {
        width : 90,
        height : 90,
        borderRadius : 40,
        backgroundColor : '#FFFFFF'
    }
})
export default styles

