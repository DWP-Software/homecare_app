import { StyleSheet } from "react-native";
import { FONT_LIGHT, FONT_MEDIUM, FONT_REGULAR } from "../../styles";

const styles = StyleSheet.create({
    page: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 16
    },
    title: { fontSize: 20, fontFamily: FONT_REGULAR, color: '#020202', textAlign: 'center' },
    subTitle: { fontSize: 14, fontFamily: FONT_LIGHT, color: '#8D92A3', textAlign: 'center' },
    buttonContainer: {
        width: '100%',
        paddingHorizontal: 80,
    },
});

export default styles;