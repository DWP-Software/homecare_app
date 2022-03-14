import { StyleSheet } from 'react-native';
import { COLOR_BASE_PRIMARY_TEXT, FONT_BOLD, FONT_REGULAR } from '../../styles';


const styles = StyleSheet.create({
    scroll: { flexGrow: 1 },
    page: { flex: 1, backgroundColor: 'white' },
    container: {
        backgroundColor: 'white',
        paddingHorizontal: 24,
        paddingVertical: 26,
        marginTop: 24,
        flex: 1,
    },
    photo: { alignItems: 'center', marginTop: 26, marginBottom: 16 },
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
        justifyContent: 'center',
        alignItems: 'center',
    },
    addPhoto: {
        fontSize: 14,
        fontFamily: 'Poppins-Light',
        color: '#8D92A3',
        textAlign: 'center',
    },
    txtTitle: {
        fontSize: 14,
        fontFamily: FONT_BOLD,
        color: COLOR_BASE_PRIMARY_TEXT
    },
    txtSubTitle: {
        fontSize: 14,
        fontFamily: FONT_REGULAR,
        color: COLOR_BASE_PRIMARY_TEXT
    },
    bottomContainer: {
        marginTop: 16,
        bottom: 0, //Here is the trick
    },
    txtFooter: {
        fontSize: 12,
        fontFamily: FONT_REGULAR,
        color: COLOR_BASE_PRIMARY_TEXT
    }
});


export default styles
