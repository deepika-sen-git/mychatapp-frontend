import { StyleSheet } from "react-native";
import globalUse, { hp, wp } from "../../../utils/globalUse";
import Colors from "../../../theme/colors";
import { Fonts } from "../../../utils/Fonts";

const styles = StyleSheet.create( {
    imageContainer: { alignItems: 'center', marginVertical: hp( 1 ), width: wp( 35 ), alignSelf: 'center'},
    profile: { width: wp( 35 ), height: wp( 35 ), borderRadius: 100, overflow: 'hidden'},
    editBtn: { position: 'absolute', top: 0, right: 0, width: wp( 10 ), height: wp( 10 ) },
    switchText: { textAlign: 'center', marginTop: hp( 1.5 ), fontSize: wp( 3.5 ) },
    loginText: {
        color: Colors.primary,
        fontSize: wp( 4 ),
        fontWeight: '700',
        textDecorationLine: 'underline',
},
    scrollContainer: {
        flexGrow: 1,
        // paddingHorizontal: 20,
        // paddingVertical: 20,
    },
     terms: {
        marginVertical: globalUse.HEIGHT > 700 ? hp( 1 ) : hp( 0.2 ),
        paddingHorizontal: wp( 10 ),
        // backgroundColor:'red',
        paddingBottom: hp( 2 )
    },
    termsText: {
        fontSize: globalUse.HEIGHT > 700 ? wp( 3.5 ) : wp( 2.7 ),
        color: Colors.black,
        textAlign: 'center',
        fontWeight: '400',
        opacity: 0.7,
        fontFamily: Fonts.InterRegular,
    },
    highlightTermsText: {
        color: Colors.primary,
        fontSize: wp( 3.5 ),
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
} );
export default styles;