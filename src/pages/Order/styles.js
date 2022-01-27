import { StyleSheet } from "react-native";
import { COLOR_BASE_PRIMARY_TEXT, COLOR_BASE_SECOND_TEXT, COLOR_ORANGE, COLOR_SHADOW, FONT_BOLD, FONT_MEDIUM, FONT_REGULAR } from "../../styles";

const styles = StyleSheet.create({
    page: { flex: 1, backgroundColor: 'white' },
    content: { flex: 1 },
    tabContainer: { flex: 1, paddingHorizontal: 24 },
    conterItem: { margin: 5, padding: 15,borderColor: COLOR_SHADOW, borderWidth: 1, borderRadius: 12 },
    conterBodyItem: { flexDirection: 'row', margin: 5, },
    txtName: { fontSize: 16, fontFamily: FONT_BOLD, color: COLOR_BASE_PRIMARY_TEXT },
    txtAdd: { fontSize: 12, fontFamily: FONT_REGULAR, color: COLOR_BASE_SECOND_TEXT },
    txtPrice: { fontSize: 14, fontFamily: FONT_BOLD, color: COLOR_ORANGE },
    txtDate: { fontSize: 10, fontFamily: FONT_REGULAR, color: COLOR_BASE_SECOND_TEXT },
    txtService: { fontSize: 12, fontFamily: FONT_REGULAR, color: COLOR_BASE_PRIMARY_TEXT },
    status: (bgColor, txtColor) => ({ backgroundColor: bgColor, color: txtColor, paddingHorizontal : 20, paddingVertical : 5 , borderRadius: 10, alignSelf: 'flex-end' })
});

export default styles;