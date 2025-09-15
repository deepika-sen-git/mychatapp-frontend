import { StyleSheet } from "react-native";
import Colors from "../../theme/colors";
import globalUse, { hp, wp } from "../../utils/globalUse";

const styles = StyleSheet.create( {
    // header: {
    //     flexDirection: 'row',
    //     alignItems: 'center',
    //     padding: 10,
    //     backgroundColor: '#fbb',
    //     justifyContent: 'space-between',
    // },
    // headerCenter: { alignItems: 'center' },
    // groupName: { fontWeight: '600' },
    // groupInfo: { fontSize: 12, color: '#666' },
    container: { flex: 1, backgroundColor: Colors.lightBG },
    messageContainer: {
        
        backgroundColor: 'white',
        borderTopRightRadius: 16,
        borderTopLeftRadius: 16,
        marginHorizontal: wp(1.2),
        marginVertical: hp(0.7),
        paddingVertical: hp(1),
        paddingHorizontal: wp(2),
        maxWidth: wp(77),
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    myMessage: {
        alignSelf: 'flex-end',
        borderWidth: wp(0.5),
        borderColor: Colors.primary,
        borderBottomLeftRadius: 16,
        // alignContent: 'flex-end',
        // alignItems:'flex-end',
        textAlign: 'right',
        paddingLeft: wp( 3 ),
    },
    otherMessage: {
        alignSelf: 'flex-start',
        borderWidth: 0.5,
        borderColor: Colors.textInputBorder,
        borderBottomRightRadius: 16,
        // alignContent: 'flex-start',
        textAlign: 'left',
        paddingLeft: wp( 3 ),
        paddingRight:wp(5)
    },
    sender: { color: Colors.primary, fontWeight: '500', marginTop:hp(0.1),  fontSize:wp(3.5) },
    messageText: { color: '#000', marginTop: hp( 0.8 ), fontSize: wp( 3.7 ), fontFamily: 'Roboto-Regular'},
    time: { fontSize: 10, color: '#888', alignSelf: 'flex-end', marginTop:hp(0.1) },
    attachmentsRow: {flexDirection: 'row', marginTop: hp(1), flexWrap: 'wrap', gap:wp(1)},
    attachmentImage: { width: wp(17), height: wp(17), borderRadius: wp(2), marginHorizontal: wp(0.1), marginVertical:wp(1) },
    inputRow: {

        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: hp(2),
        justifyContent: 'center',
        paddingHorizontal: wp(2),
        gap: wp(2),

    },
    input: { marginHorizontal: 4, paddingHorizontal: 10, paddingVertical: 15, borderRadius: 5, borderWidth: 0.1, borderColor: Colors.primary, width: globalUse.WIDTH * 0.6 },
    modalOverlay: { flex: 1, justifyContent: 'flex-end', marginBottom: 60 },
    modalCard: {
        backgroundColor: Colors.lightBG,
        margin: 20,
        borderRadius: 12,
        padding: 24,
        flexDirection: 'row',
        justifyContent: 'space-around',
        elevation: 3,

    },
    actionButton: {
        padding: 10, flexDirection: 'row', gap: 16, backgroundColor: Colors.lightBG, height: globalUse.HEIGHT * 0.05, borderRadius: 4,
        width: globalUse.WIDTH * 0.3,
    },
    actionText: {
        fontSize: 18,
        fontWeight: '500',

    },
    imageContainer: {
        flexBasis: '30%',       // three items per row
        flexGrow: 0,            // don’t stretch
        aspectRatio: 1,         // keep square
        position: 'relative',
        borderRadius: 8,
        overflow: 'hidden',
    },
    attModal: {
        position: 'absolute', bottom: 60, left: 25, width: '50%', backgroundColor: '#fff',
        borderRadius: 12, padding: 25, flexDirection: 'row', justifyContent: 'space-between', elevation: 10, gap: 25
    },
    messageVideo: {
        position: 'absolute',
        top: '30%',
        left: '30%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    previewVideo: {
        position: 'absolute',
        top: '30%',
        left: '30%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    previewModal: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', alignItems: 'center' },
    crossIcon: { position: 'absolute', top: 40, right: 20, backgroundColor: Colors.lightBG, borderRadius: 12 },
    previewAsset: { width: '90%', height: '70%', borderRadius: 12 },
    attModalBtn: { alignItems: 'center', rowGap: 5 },
    avatar: { width: 42, height: 42, borderRadius: 24, marginRight: 12 },
    seenStatusModal: {
        minHeight: globalUse.HEIGHT * 0.2,
        margin: 20,
        padding: 10,
        borderWidth: 0.5,
        borderColor: Colors.textInputBorder,
        borderRadius: 12,

    }
} );

export default styles;
