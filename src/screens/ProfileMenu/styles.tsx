import { StyleSheet } from "react-native";
import Colors from "../../theme/colors";
import { wp } from "../../utils/globalUse";
// import globalUse from "../../utils/globalUse";

const styles = StyleSheet.create( {
    container: { flex: 1, backgroundColor: '#fff' },
    menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 0.5, borderColor: '#ccc', justifyContent: 'space-between', gap: 15 },
    menuText: { flex: 1, marginLeft: wp(2), fontFamily: 'Poppins-Medium' },
    rightRow: { flexDirection: 'row', alignItems: 'center' },
    rightText: { marginRight: wp(2), color: '#555' },  
    languageDropdown: { borderColor: Colors.textInputBorder, borderWidth: 1, backgroundColor: '#16C47F1A', paddingHorizontal: 12, borderRadius: 5, paddingVertical: 5, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 5 },


} );
export default styles;

