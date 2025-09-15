import { StyleSheet } from "react-native";
import globalUse, { hp, wp } from "../../utils/globalUse";
import Colors from "../../theme/colors";

const styles = StyleSheet.create( {
    sectionTitle: {
        fontSize: wp(4),
        fontWeight: '600',
        marginVertical: hp(2),
        marginLeft: 16,
    },
    mediaItem: {
        width: wp(20),
        height: wp(20),
        borderRadius: 10,
        position: 'relative',
        margin: wp( 2 ),
    },
    previewModal: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', alignItems: 'center' },
    crossIcon: { position: 'absolute', top: 40, right: 20, backgroundColor: Colors.lightBG, borderRadius: 12, zIndex: 10, },
    previewAsset: { width: wp(100), height: '80%', borderRadius: 12 },
    previewVideo: {
        position: 'absolute',
        top: '35%',
        left: '35%',
        justifyContent: 'center',
        alignItems: 'center',
    
    },

} );
export default styles;