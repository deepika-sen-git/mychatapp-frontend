import { StyleSheet } from "react-native";
import Colors from "../../../theme/colors";
import globalUse, { hp, wp } from "../../../utils/globalUse";

const styles = StyleSheet.create( {
    containerStyle: {
        marginVertical: 20,
        width: 62 * 4.5,
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    textInputStyle: {
        width: 62,
        height: 69.75,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.textInputBorder,
        backgroundColor: Colors.white,
        textAlign: 'center',
        fontSize: 28,
        fontWeight: '500',
    },
    errorText: {
        color: Colors.errorText,
        fontSize: 14,
        textAlign: 'center',
        marginTop: 5,
    },
    plainButtonContainer: {
        borderBottomColor: '#000000B2',
    },
    plainButton: {
        borderBottomColor: '#000000B2',
        color: '#000000B2',
        fontSize: 16,
        fontWeight: '400',
    },
    sendCodeTextContainer: {
        flexDirection: 'row',
        marginTop: 150,
        marginHorizontal: 10,
        alignSelf: 'center',
        // alignItems: 'center',
        // alignContent: 'center',
        justifyContent: 'center',
    },
    sendCodeText: {
        fontSize: 16,
        fontWeight: '600',
        opacity: 0.7,
    },
    buttonWrapper: {
        justifyContent: 'center',
        width: globalUse.WIDTH * 0.2,
    },

    timerText: {
        width: globalUse.WIDTH * 0.2,
        marginLeft: 7, // or adjust to match button spacing
        fontSize: 16,
        fontWeight: '400',
        opacity: 0.7,
    },
    contentContainer: {
        paddingBottom: hp(30),  // Extra padding to ensure scrolling is possible
    },
    switchText: { textAlign: 'center', marginTop: hp( 1.5 ), fontSize: wp( 3.5 ) },
    loginText: {
        color: Colors.primary,
        fontSize: wp( 4 ),
        fontWeight: '700',
        textDecorationLine: 'underline',
    },

} );
export default styles;
