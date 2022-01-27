import { Dimensions, StyleSheet } from 'react-native';
import { COLOR_BASE_PRIMARY_TEXT, COLOR_BASE_SECOND_TEXT, COLOR_ORANGE, FONT_BOLD, FONT_REGULAR,COLOR_SHADOW } from '../../../styles';

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: 'white' },
  foodCardContainer: { flexDirection: 'row', marginVertical: 24 },
  tabContainer: { flex: 1 },
  conterItem: { margin: 5, padding: 15, borderColor: COLOR_SHADOW, borderWidth: 1, borderRadius: 12 },
  conterBodyItem: { flexDirection: 'row', margin: 5, },
  txtName: { fontSize: 16, fontFamily: FONT_BOLD, color: COLOR_BASE_PRIMARY_TEXT },
  txtAdd: { fontSize: 12, fontFamily: FONT_REGULAR, color: COLOR_BASE_SECOND_TEXT },
  txtPrice: { fontSize: 14, fontFamily: FONT_BOLD, color: COLOR_ORANGE },
  txtDate: { fontSize: 10, fontFamily: FONT_REGULAR, color: COLOR_BASE_SECOND_TEXT },
  txtService: { fontSize: 12, fontFamily: FONT_REGULAR, color: COLOR_BASE_PRIMARY_TEXT },
  status: (bgColor, txtColor) => ({ backgroundColor: bgColor, color: txtColor, paddingHorizontal : 20, paddingVertical : 5 , borderRadius: 10, alignSelf: 'flex-end' }),
  txtTitle: {
    fontFamily: FONT_REGULAR,
    fontSize: 14,
    color: COLOR_BASE_PRIMARY_TEXT
  },
  txtAll: {
    fontFamily: FONT_REGULAR,
    fontSize: 14,
    color: COLOR_ORANGE
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
    color: COLOR_BASE_PRIMARY_TEXT
  },
  containerBody: {
    marginHorizontal: 16,
    marginTop: 18,
    marginBottom: 220
  },
  itemVertical: {
    padding : 10,
    // justifyContent : 'center',
    alignItems : 'center',
    margin : 10,
    backgroundColor: '#F5FBFD',
    width: Dimensions.get('window').width/4,
    height: 140,
    elevation : 2,
    borderRadius : 16
  },
  txtItem: {
    textAlign: 'center',
    marginTop: 12,
    fontFamily: FONT_REGULAR,
    color: COLOR_BASE_PRIMARY_TEXT,
    fontSize: 14
  }
})

export default styles;
