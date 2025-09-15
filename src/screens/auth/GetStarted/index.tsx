import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
} from 'react-native';
import svgImages from '../../../utils/svgImages';
import globalUse, { wp, hp } from '../../../utils/globalUse';
import OnboardingTitle from '../../../components/OnboardingTitle';
import CustomPlainButton from '../../../components/UI/CustomPlainButton';
import CustomButton from '../../../components/UI/CustomButton';
import Routes from '../../../utils/Routes';
import Colors from '../../../theme/colors';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { RootStackParamList } from '../../../AppNavigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Fonts } from '../../../utils/Fonts';
import { useStatusBarColor } from '../../../context';
import { useFocusEffect } from '@react-navigation/native';

type Props = NativeStackScreenProps<RootStackParamList, typeof Routes.LOGIN>;
const GettingStartedScreen: React.FC<Props> = ( { navigation } ) => {

    const authState = useSelector( ( state: RootState ) => state.auth );
    const userState = useSelector( ( state: RootState ) => state.user );
    console.log( "authState from GettingStartedScreen: ", authState );
    console.log( "userState from GettingStartedScreen: ", userState );

    // const dispatch = useDispatch();
      const { setColor } = useStatusBarColor();
          useFocusEffect(
                    React.useCallback( () => {
                        setColor( Colors.appHeader );  
            
                    }, [] )
                );
      

    return (
        <SafeAreaView style={ styles.container }>
            {/* Top Image */ }
            <View style={ styles.topContainer }>
                {/* <svgImages.GradientEllipse2 style={ styles.gradient } />
                <svgImages.GetStartedImageComp width={ 345 } height={ 275 } style={ styles.overlaySvg } /> */}
                <svgImages.Gradient4 style={ { marginTop: -hp( 5 ) } } width={ globalUse.WIDTH }
                    height={ globalUse.HEIGHT * 0.6 } />
            </View>
            
            {/* Bottom Content */ }
            <View style={ styles.bottomContainer }>
                <OnboardingTitle title='Stay Connected with Your Family & Friends'
                    highlights={ [ 'Connected', 'Family', 'Friends' ] }
                />
                <Text style={ styles.subtitle }>
                    Easily connect with your loved ones through <Text style={ { fontWeight: 'bold' } }>MyChat</Text>. Add friends by their unique ID, share moments with pictures and videos, and create group chats to keep everyone together.
                </Text>

                <TouchableOpacity style={ styles.loginButton } onPress={ () => navigation.navigate( Routes.LOGIN ) }>
                    <Text style={ styles.loginText }>Log in</Text>
                </TouchableOpacity>
                {/* 
                <TouchableOpacity style={styles.createButton}>
                    <Text style={styles.createText}>Create account</Text>
                </TouchableOpacity> */}
                <CustomButton title='Create account' onPress={ () => navigation.navigate( Routes.SIGN_UP ) } />
                

                <View style={ styles.terms }>

                {/* <Text style={ styles.termsText }>
                    By creating an account or signing in you
                    agree to our{ ' ' } <CustomPlainButton
                        title="Terms and Conditions"
                        onPress={ () => navigation.navigate( Routes.TERMS ) }
                    />

                </Text> */}
                    
                    <Text style={ styles.termsText }>By creating an account or signing in you agree to our { ' ' }
                        <Text style={ styles.highlightTermsText } onPress={ () => navigation.navigate( Routes.TERMS ) }>Terms and Conditions</Text>
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default GettingStartedScreen;

const styles = StyleSheet.create( {
    container: {
        flex: 1,
        backgroundColor: Colors.white,
       
    },
    topContainer: {
        width: globalUse.WIDTH,
        // marginBottom: hp( 0.5 ),
        // backgroundColor:'blue',
    },
   
    bottomContainer: {
        flex: 1,
        paddingHorizontal: wp(5),
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor:'red'
    },
    subtitle: {
        fontSize: globalUse.HEIGHT > 700 ? wp(3.5): wp(2.7),
        color: '#787878',
        marginBottom:globalUse.HEIGHT>700?hp(1.5): hp(0.5),
        paddingHorizontal:wp(4),
        textAlign: 'center',
    },
    loginButton: {
        width: wp( 89.5),
        height: hp( 6.3 ),
        borderColor: Colors.primary,
        borderWidth: 1,
        backgroundColor: Colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginBottom: globalUse.HEIGHT > 700 ? hp( 1 ) : hp( 0.05 ),
    },
    loginText: {
        fontSize: wp( 4 ),
        fontWeight: '500',
        color: Colors.primary,
        fontFamily: 'Poppins-Regular'
    },
    terms: {
        marginVertical: globalUse.HEIGHT > 700 ? hp( 1 ): hp(0.2),
        paddingHorizontal: wp( 10 ),
        // backgroundColor:'red',
      paddingBottom:hp(2)
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
        fontWeight: '900',
        // borderBottomWidth: 2,
        // borderBottomColor: 'blue',
        // paddingBottom: hp(2),
        textDecorationLine: 'underline',
},
} );
