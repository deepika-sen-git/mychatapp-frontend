import { StyleSheet } from "react-native";
import Colors from "../../theme/colors";
import globalUse, { hp, wp } from "../../utils/globalUse";

const styles = StyleSheet.create( {
    inputContainer: {
        backgroundColor: Colors.lightBG,
        // paddingHorizontal: wp(5),
        gap: hp(1.5), // or use marginBottom on each input
        marginTop: hp(0.05),
        width: globalUse.WIDTH,
        height: globalUse.HEIGHT * 0.9,
        
    },
    errorText: {
        color: 'red',
        fontSize: wp( 3.5 ),
        fontWeight: '500',
        fontFamily: 'Poppins-Medium'
    },
    popupImage: {
        width: wp( 20 ),
        height: wp( 20 ),
        marginBottom: hp( 0.05 ),
     
    },
    modalNoDim: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    popupCard: {
        backgroundColor: '#fff',
        padding: wp( 5 ),
        borderRadius: 16,
        width: globalUse.WIDTH * 0.88,
        height: globalUse.HEIGHT > 700 ? globalUse.HEIGHT * 0.38:globalUse.HEIGHT * 0.33,
        alignItems: 'center',
        elevation: 6, // Android shadow
        shadowColor: '#000', // iOS shadow
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        gap: wp( 2 ),
    },
    userCard: {
        backgroundColor: '#fff',
        padding: wp( 5 ),
        borderRadius: 20,
        width: globalUse.WIDTH * 0.88,
        height: globalUse.HEIGHT * 0.45,
        alignItems: 'center',
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        gap: wp( 2 ),
    },

    circleIcon: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    popupText: {
        fontSize: wp( 4 ),
        fontWeight: '500',
        textAlign: 'center',
        marginBottom: hp( 0.1 ),
        fontFamily: 'Poppins-Medium'
    },
    tryAgainButton: {
        backgroundColor: '#16C47F',
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderRadius: 10,
        width: globalUse.WIDTH * 0.73,
        height: globalUse.HEIGHT * 0.06,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tryAgainText: {
        color: '#fff',
        fontSize: wp( 3.5 ),
        fontWeight: '500',
        fontFamily: 'Poppins-Medium'
    },
    avatarCircle: {
        width: wp( 30 ),
        height: wp( 30 ),
        borderRadius: 100,
        backgroundColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12
    },
    userName: {
        fontSize: 22,
        fontWeight: '600',
    },
    userInfoRow: {
        flexDirection: 'row',
        gap: 32,
        justifyContent: 'space-between',
    },
    buttonRow: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: hp( 2 ),
        gap: wp( 4 ),
        // padding: wp( 2 ),
        width: globalUse.WIDTH * 0.77,
    },
    cancelButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#F93827',
        borderRadius: 8,
        paddingVertical: hp( 0.5 ),
        paddingHorizontal: wp( 4 ),
        height: hp( 6.5 ),
    },
    cancelButtonText: {
        color: '#F93827',
        fontSize: wp(4),
        fontFamily: 'Poppins-Medium',
        fontWeight: '500',
    },
    startChatButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.primary,
        borderRadius: 8,
        paddingVertical: hp( 0.5 ),
        paddingHorizontal: wp( 4 ),
        height: hp( 6.5 ),
    },
    startChatText: {
        color: '#fff',
        fontSize: wp( 4 ),
        fontWeight: '500',
        fontFamily:'Poppins-Medium'
    },

} );
export default styles;