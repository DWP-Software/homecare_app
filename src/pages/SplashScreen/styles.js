import { StyleSheet } from "react-native";
import { COLOR_BASE_PRIMARY_TEXT, FONT_SUBTITLE } from "../../styles";

const styles = StyleSheet.create({
    container: {
      backgroundColor: 'white',
      flex: 1,
      justifyContent: 'center',
    },
    text: { fontSize: 32, color: COLOR_BASE_PRIMARY_TEXT, fontFamily: 'Poppins-Medium' },
    bottomContainer: {
      marginTop: 16,
      position: 'absolute',
      bottom: 0, //Here is the trick
    },
    txtSubTitle: {
      ...FONT_SUBTITLE,
      color: COLOR_BASE_PRIMARY_TEXT
    },
  });
  
export default styles;