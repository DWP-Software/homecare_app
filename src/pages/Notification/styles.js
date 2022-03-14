import { StyleSheet } from "react-native";
import { COLOR_BASE_PRIMARY_DARK, COLOR_BASE_PRIMARY_TEXT, COLOR_BASE_SECOND_TEXT, FONT_MEDIUM, FONT_REGULAR } from "../../styles";

const styles = StyleSheet.create({
    page: { flex: 1, backgroundColor: 'white' },
    content: { flex: 1 },
    tabContainer: { flex: 1, paddingHorizontal: 24 },
    itemVertical: {
        paddingVertical : 10,
        flexDirection : 'row',
    },
    txtItem: {
        marginLeft : 10,
        marginRight : 15,
        color: COLOR_BASE_PRIMARY_TEXT,
        fontSize: 14,
        fontFamily: FONT_MEDIUM
    },
    txtItemDesc: {
        color: COLOR_BASE_SECOND_TEXT,
        fontSize: 14,
        fontFamily: FONT_MEDIUM
    }
});

export default styles;