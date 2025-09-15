import { StyleSheet } from "react-native";
import Colors from "../../../theme/colors";
import globalUse from "../../../utils/globalUse";

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
} );
export default styles;
