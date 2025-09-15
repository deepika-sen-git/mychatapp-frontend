import { StyleSheet } from "react-native";
import globalUse from "../../utils/globalUse";

const styles = StyleSheet.create( {
    container: { width: globalUse.WIDTH, height: globalUse.HEIGHT * 0.9, backgroundColor: '#fff', padding: 20 },
    groupImageWrapper: { alignSelf: 'center', marginVertical: 16 },
    editIcon: { position: 'absolute', top: 0, right: 0 },
    sectionTitle: { marginTop: 8, fontWeight: '400' },
    addMembersButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#16C47F1A', padding: 12, borderRadius: 8, marginVertical: 16, gap: 8 },
    addMembersText: { marginLeft: 8, color: '#16C47F', fontSize: 18, fontWeight: '500' },
    selectedUserRow: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginVertical: 8, justifyContent: 'space-between' },
    avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 8 },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        paddingBottom: 4,
        minHeight: globalUse.HEIGHT * 0.91,
    },

    modalHandle: {
        width: 60,
        height: 6,
        backgroundColor: '#ccc',
        borderRadius: 10,
        alignSelf: 'center',
        marginBottom: 10,
    }
    ,
    modalTitle: { textAlign: 'center', fontSize: 16, fontWeight: '500', marginBottom: 8 },
    userRow: { flexDirection: 'row', alignItems: 'center', padding: 12, marginHorizontal: 10 },
    userInfo: { flex: 1, marginLeft: 8 },
    modalButtonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 5,
        gap: 5,
        marginHorizontal: 20,
        width: globalUse.WIDTH * 0.77,

    },
    modalButton: { flex: 1, borderWidth: 1, borderColor: '#16C47F', padding: 12, borderRadius: 8, alignItems: 'center', maxWidth: globalUse.WIDTH * 0.35, height: globalUse.HEIGHT * 0.055, justifyContent: 'center' },
    modalButtonAdd: { flex: 1, backgroundColor: '#16C47F', padding: 12, borderRadius: 8, alignItems: 'center', maxWidth: globalUse.WIDTH * 0.35, height: globalUse.HEIGHT * 0.055, justifyContent: 'center' },
    groupImage: {
        width: 160,
        height: 160,
        borderRadius: 100,

    }
} );
export default styles;

