import { StyleSheet } from "react-native";
import Colors from "../../../theme/colors";
import { hp, wp } from "../../../utils/globalUse";
// import globalUse from "../../utils/globalUse";

const styles = StyleSheet.create( {
    forgot: { alignSelf: 'flex-end', marginHorizontal: wp( 1 ), color: '#00000080', fontFamily: 'Inter_24pt-Regular', fontSize: wp( 3.3 ) },
    // errorText: { color: Colors.errorText, fontSize: wp( 3 ), marginBottom: hp( 0.5 ), marginLeft: wp( 1 ) },
    scrollContainer: {
        flexGrow: 1,
        // backgroundColor: Colors.appHeader
        // paddingHorizontal: 20,
        // paddingVertical: 20,
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