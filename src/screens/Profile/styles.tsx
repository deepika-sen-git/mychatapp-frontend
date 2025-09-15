import { StyleSheet } from "react-native";
import Colors from "../../theme/colors";
import { hp, wp } from "../../utils/globalUse";
// import globalUse from "../../utils/globalUse";

const styles = StyleSheet.create( {
    container: { flex: 1, backgroundColor: 'white', padding:wp(2) },
    // menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 0.5, borderColor: '#ccc', justifyContent: 'space-between', gap: 15 },
    // menuText: { flex: 1, marginLeft: 10 },
    rightRow: { flexDirection: 'row', alignItems: 'center' },
    rightText: { marginRight: 6, color: '#555' },
    groupImageWrapper: { alignSelf: 'center', marginVertical: wp(2) },

    avatarWrapper: { alignItems: 'center', marginVertical: hp(1) },
    avatar: { width: wp(40), height: wp(40), borderRadius: 100 },
    editIcon: { position: 'absolute', right: 0, top: 0 },

    userName: { textAlign: 'center', fontSize: wp(5.5), fontWeight: 'bold', marginVertical: hp(3), fontFamily: 'Poppins-SemiBold' },

    infoRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: hp(1.3), marginHorizontal: wp(5) },
    label: { fontWeight: '300'},

    primaryButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.primary, padding: hp(1), marginHorizontal: hp(1), borderRadius: 8, justifyContent: 'center', width:wp(90), height:hp(6) ,marginVertical:hp(2) },
    primaryButtonText: { color: '#fff', marginLeft: wp(2), fontFamily:'Roboto-Medium', fontSize:wp(4) },

    modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.3)' },
    modalCard: { backgroundColor: '#fff', padding: 20, borderTopLeftRadius: 16, borderTopRightRadius: 16, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 6, elevation: 10, gap: 5 },
    modalHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#ccc', alignSelf: 'center', marginBottom: 12 },
    modalTitle: { textAlign: 'center', fontSize: 18, fontWeight: 'bold', marginBottom: 12 },

    input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 12 },
    modalButtons: { flexDirection: 'row', justifyContent: 'space-between' },
    cancelButton: { borderWidth: 1, borderColor: Colors.primary, borderRadius: 8, paddingHorizontal: wp(4), flex: 1, marginTop: hp(1.5), alignItems: 'center',paddingVertical:hp(2), marginHorizontal:wp(1.5), justifyContent:'center' },
    saveButton: { backgroundColor: Colors.primary, borderRadius: 8, paddingHorizontal: wp(4), flex: 1, marginTop:hp(1.5), alignItems: 'center', paddingVertical:hp(2), marginHorizontal:wp(1.5), justifyContent:'center' },
    cancelText: { color: Colors.primary, fontFamily: 'Poppins-Medium' },
    saveText: { color: '#fff', fontFamily: 'Poppins-Medium' },
    languageDropdown: { borderColor: Colors.textInputBorder, borderWidth: 1, backgroundColor: '#16C47F1A', paddingHorizontal: 12, borderRadius: 5, paddingVertical: 5, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 5 },


} );
export default styles;

