import { StyleSheet } from 'react-native';
import { COLOR_BASE_PRIMARY_MAIN, COLOR_BASE_PRIMARY_TEXT, FONT_BOLD, FONT_HEADLINE1_PRIMARY, FONT_REGULAR, FONT_SUBTITLE } from '../../styles';


const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor : 'white'
    },
    container: {
        paddingHorizontal: 24,
        paddingVertical: 26,
        marginTop: 24,
        flex: 1
    },
    txtTitle: {
        ...FONT_HEADLINE1_PRIMARY,
        color : COLOR_BASE_PRIMARY_TEXT
    },
    txtSubTitle: {
        ...FONT_SUBTITLE,
        color : COLOR_BASE_PRIMARY_TEXT
    },
    txtReg : {
        ...FONT_SUBTITLE,
        color : COLOR_BASE_PRIMARY_MAIN
    },
    bottomContainer: {
        marginTop : 52,
        bottom: 0, //Here is the trick
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

export default styles
