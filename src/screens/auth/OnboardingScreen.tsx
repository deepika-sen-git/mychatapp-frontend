import React from 'react';
import { View, StyleSheet } from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';
import OnboardingTitle from '../../components/OnboardingTitle';
import svgImages from '../../utils/svgImages';
import globalUse, { hp, wp } from '../../utils/globalUse';
import OnboardingDot from '../../components/OnboardingDot';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../AppNavigator';
import DoneButton from '../../components/UI/DoneButton';
import { Fonts } from '../../utils/Fonts';
import Colors from '../../theme/colors';
import Routes from '../../utils/Routes';
import SvgImages from '../../utils/svgImages';
import { useStatusBarColor } from '../../context';
import { useFocusEffect } from '@react-navigation/native';
// import { useDispatch } from 'react-redux';
// import { setColor } from '../../store/slices/statusBarSlice';

type Props = NativeStackScreenProps<RootStackParamList, typeof Routes.ONBOARDING>;
// import { Platform, StatusBar } from 'react-native';

// const paddingTop = Platform.OS === 'android' ? StatusBar.currentHeight : 0;

const OnboardingScreen = ( { navigation }: Props ) => {
    // const dispatch = useDispatch();
    // dispatch( setColor( Colors.appHeader ) );
      const { setColor } = useStatusBarColor();
      useFocusEffect(
                React.useCallback( () => {
                    setColor( Colors.appHeader );  
        
                }, [] )
            );
  
    return (
        <>
            {/* <GradientEllipse2 style={ styles.gradient } /> */ }

            <Onboarding
                // eslint-disable-next-line react-native/no-inline-styles
                containerStyles={ {
                    backgroundColor: Colors.white,
                    padding: 0,
                    margin: 0,
                    flex: 1,
                } }
                bottomBarHighlight={ false }
                // eslint-disable-next-line react-native/no-inline-styles
                imageContainerStyles={ {
                    padding: 0,
                    margin: 0,
                    flex: 1, // prevent it from expanding
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    backgroundColor: Colors.white,

                } }

                // eslint-disable-next-line react-native/no-inline-styles
                titleStyles={ {
                    marginTop: hp( 5 ),
                    marginBottom: hp( 5 ),
                    // paddingHorizontal: wp(10),
                    // textAlign: 'center',
                } }
                bottomBarHeight={ globalUse.HEIGHT > 700 ? hp( 10 ) : hp( 8 ) }
                // eslint-disable-next-line react-native/no-inline-styles
                subTitleStyles={ {
                    fontFamily: Fonts.InterRegular,
                    paddingHorizontal: wp( 7 ),
                    // textAlign: 'center',
                    fontSize: wp( 3.5 ),
                    marginBottom: globalUse.HEIGHT > 700 ? hp( 20 ) : hp( 12 ),
                    // backgroundColor:'red',
                } }
                pages={ [
                    {
                        backgroundColor: Colors.white,
                        image: (
                            // <View style={ styles.page }>
                            <View style={ styles.wrapper }>
                                {/* <svgImages.GradientEllipse1 style={ styles.gradient } />
                                <svgImages.Onboarding1 width={ wp(60) }  style={ styles.overlaySvg } /> */}
                                <SvgImages.Gradient1 width={ wp( 100 ) } height={ globalUse.HEIGHT > 600 ? hp( 100 ) : hp( 50 ) } style={ { marginTop: -hp( 20 ) } } />
                            </View>
                            // </View>
                        ),

                        title: <OnboardingTitle
                            title="Stay Connected, Your Way"
                            highlights={ [ 'Connected' ] }
                        />,
                        subtitle: 'Effortlessly register with your email or mobile number and secure your account with a 2-step login system.',
                    },
                    {
                        backgroundColor: Colors.white,
                        image: (
                            // <View style={ styles.page }>
                            <View style={ styles.wrapper }>
                                {/* <svgImages.GradientEllipse2 style={ styles.gradient } />
                                <svgImages.Onboarding2 width={ 345 } height={ 298 } style={ styles.overlaySvg } /> */}
                                <SvgImages.Gradient2 width={ wp( 100 ) } height={ globalUse.HEIGHT > 600 ? hp( 100 ) : hp( 50 ) } style={ { marginTop: -hp( 20 ) } } />
                            </View>
                            // </View>
                        ),
                        title: <OnboardingTitle
                            title="Chat and Share with Ease"
                            highlights={ [ 'Chat', 'Share' ] }

                        />,
                        subtitle: 'Add friends using their unique ID, send pictures & videos, & create groups to keep everyone in the loop.',
                    },
                    {
                        backgroundColor: Colors.white,
                        image: (
                            // <View style={ styles.page }>
                            <View style={ styles.wrapper }>
                                {/* <svgImages.GradientEllipse3 style={ styles.gradient } />
                                <svgImages.Onboarding3 width={ 293 } height={ 282 } style={ styles.overlaySvg } /> */}
                                <SvgImages.Gradient3 width={ wp( 100 ) } height={ hp( 100 ) } style={ { marginTop: -hp( 20 ) } } />
                            </View>
                            // </View>
                        ),
                        title: <OnboardingTitle
                            title="Your Chat, Your Style, Your Way"
                            highlights={ [ 'Chat', 'Style', 'Way' ] }
                        />,
                        subtitle: 'Customize your profile with a picture and name, enjoy a sleek modern UI design, and bilingual support.',
                    },
                ] }
                nextLabel={ <svgImages.NextIcon width={ wp( 10 ) } height={ wp( 10 ) } /> }
                DotComponent={ OnboardingDot }
                transitionAnimationDuration={ 2 }

                onSkip={ () => navigation.navigate( 'GetStarted' ) }
                DoneButtonComponent={ ( props ) => (
                    <DoneButton
                        { ...props }
                        onPress={ () => navigation.navigate( 'GetStarted' ) }
                    />
                ) }



            />
        </>
    );
};

export default OnboardingScreen;

const styles = StyleSheet.create( {
    // page: {
    //     width: '100%',
    //     height: '100%',
    //     alignItems: 'center',
    //     padding: 0,
    //     margin: 0,
    // },
    wrapper: {
        // paddingTop,
        width: globalUse.WIDTH,
        // height: globalUse.HEIGHT, // <= match onboarding prop
        alignItems: 'center',
        // justifyContent: 'flex-start',
        // position: 'relative',
        // overflow: 'hidden',
        padding: 0,
        // marginTop: 0,
        // backgroundColor:'red'
    },
    // gradient: {
    //     width: globalUse.WIDTH,
    //     // height: '100%',
    //     position: 'absolute',
    //     // top: 0,
    //     zIndex: 0,
    //     transform: [ { scaleX: ( globalUse.WIDTH + globalUse.WIDTH * 0.135 ) / globalUse.WIDTH } ], // for horizontal stretch

    //     // backgroundColor:'blue',
    // },
    // overlaySvg: {
    //     zIndex: 1,
    //     marginTop: hp(5), // adjust to center over gradient
    // },
} );
