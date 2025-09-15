import { StyleSheet } from 'react-native';
// import { Fonts } from './Fonts';
import{ hp, wp } from './globalUse';
import Colors from '../theme/colors';
import { Fonts } from './Fonts';
const createCommonStyles = ( colors: any ) =>
    StyleSheet.create( {
        container: {
            flex: 1,
            backgroundColor: Colors.lightBG,
            // justifyContent: 'center',
            // alignItems: 'center',
            // margin: hp( 1 ),
            // height: hp( 100 ),
        },
        mainView: {
            width: wp( 90 ),
            height:hp(90),
            backgroundColor: Colors.lightBG,
            // alignSelf: 'center',
            marginHorizontal: wp( 4.5 ),
            marginTop: hp( 5 ),
        },
        errorText: { color: Colors.errorText, fontSize: wp( 3 ), marginBottom: hp( 0.5 ), marginLeft: wp( 1 ),textAlign:'left'},

        subHeading: {
            color: Colors.subHeading,
            fontSize: wp( 4 ),
            fontFamily:Fonts.InterRegular,
        }
    } );

export default createCommonStyles;
