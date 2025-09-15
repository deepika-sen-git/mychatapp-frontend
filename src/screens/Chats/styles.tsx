import { StyleSheet } from "react-native";
import globalUse, { hp, wp } from "../../utils/globalUse";

const styles = StyleSheet.create( {
    usersPlusIcon: {
        // marginVertical: 20,
        width: globalUse.WIDTH,
        // height: globalUse.HEIGHT * 0.2,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 20,
        opacity: 0.1,
    },
    floatingContainer: {
        position: 'absolute',
        bottom: hp(7),
        right: wp(4),
        alignItems: 'flex-end',
        zIndex: 10, // ensure it's above content, but below header shadow
      
    },

    plusIcon: {
        elevation: 10
    },
    dropdown: {
        flex:1,
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingVertical: hp(2.5 ),
        paddingHorizontal: wp( 3 ),
        justifyContent:'space-between',
        marginBottom: 8,
        width: wp(50),
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 5,
        height: hp( 17 ),
        gap: hp( 1 ),
        
    },
    dropdownItem: {
        // backgroundColor:'blue',
        flexDirection: 'row',
        // justifyContent:'center',
        // paddingVertical: 8,
        // paddingHorizontal: 12,
        borderRadius: 8,
        marginLeft:wp(3),
        // alignContent:'space-between'

    },
    dropdownItemPressed: {
        backgroundColor: '#16C47F1A'
    },
    dropdownText: {
        marginLeft: wp(4),
        fontSize: wp( 4 ),
        fontFamily: 'Poppins-Medium',
        fontWeight:'500',
    }


} );
export default styles;

