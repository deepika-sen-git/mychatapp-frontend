import { StyleSheet } from "react-native";
import globalUse, { hp, wp } from "../../utils/globalUse";
import Colors from "../../theme/colors";

const styles = StyleSheet.create( {
    container: { flex:1, backgroundColor: '#fff', paddingHorizontal: wp(5), paddingVertical:hp(2), flexDirection:'column' },
    groupImageWrapper: { alignSelf: 'center', marginVertical: hp(1) },
    editIcon: { position: 'absolute', top: 0, right: 0 },
    sectionTitle: { marginTop: hp(2), fontWeight: '400' },
    addMembersButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#16C47F1A', padding: hp(2), borderRadius: 8, marginVertical: hp(1), gap: wp(4) },
    addMembersText: { marginLeft: 8, color: Colors.primary, fontSize: wp(4), fontWeight: '500', fontFamily:'Roboto-Medium' },
    selectedUserRow: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginVertical: 8, justifyContent: 'space-between' },
    avatar: { width: wp(10), height: wp(10), borderRadius: 20, marginRight: wp(4) },
    modalContent: { flex: 1, backgroundColor: '#fff' },
    modalHandle: { width: 40, height: 4, backgroundColor: '#ccc', alignSelf: 'center', marginVertical: 8, borderRadius: 2 },
    modalTitle: { textAlign: 'center', fontSize: wp(4), fontWeight: '500', margin: wp(3), fontFamily:'Poppins-Medium' },
    userRow: { flexDirection: 'row', alignItems: 'center', padding: 12, marginHorizontal: 10 },
    userInfo: { flex: 1, marginLeft: 8 },
    modalButtonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: hp(4),
        gap: wp(5),
        marginHorizontal: wp(10),
        width: wp(80),
    },
    modalButton: { flex: 1, borderWidth: 1, borderColor: Colors.primary, padding: 12, borderRadius: 8, alignItems: 'center', height: hp( 6.5 ),justifyContent:'center' },
    modalButtonAdd: { flex: 1, backgroundColor: Colors.primary, padding: 12, borderRadius: 8, alignItems: 'center', height: hp( 6.5 ), justifyContent: 'center' },
    groupImage: {
        width: wp( 35 ), height: wp( 35 ),
        borderRadius: 100,
    },
    addText: { color: '#fff', fontWeight: '500', fontFamily:'Poppins-Medium', fontSize:wp(4) },
    cancelText: { color: Colors.primary }
} );
export default styles;

