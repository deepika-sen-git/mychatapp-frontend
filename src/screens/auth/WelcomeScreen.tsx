import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import LinearGradient from 'react-native-linear-gradient';

import svgImages from '../../utils/svgImages';
import { RootStackParamList } from '../../AppNavigator';
import Routes from '../../utils/Routes';
import Colors from '../../theme/colors';
import { useStatusBarColor } from '../../context';
import { useFocusEffect } from '@react-navigation/native';

type Props = NativeStackScreenProps<RootStackParamList, typeof Routes.WELCOME>;

const WelcomeScreen: React.FC<Props> = ( { navigation } ) => {
    useEffect( () => {
        const timer = setTimeout( () => {
            navigation.replace( 'Onboarding' );
        }, 3000 );

        return () => clearTimeout( timer );
    }, [ navigation ] );
    const { setColor } = useStatusBarColor();
    
    useFocusEffect(
        React.useCallback( () => {
            setColor( Colors.lightBG );
    
            return () => {
                setColor( Colors.appHeader );  // Reset when unmounted
            };
        }, [] )
        );
    return (
        <View style={ { flex: 1, } }>
            {/* All Ellipses inside an absolute wrapper */ }
            <LinearGradient
                colors={ [
                    'rgba(255, 157, 35, 0.1)',   // #FF9D23 soft
                    'rgba(255,255,255,255)',
                    'rgba(249, 56, 39, 0.08)',    // #F93827 soft
                    'rgba(255,255,255,255)',
                    'rgba(203, 255, 169, 0.1)',   // #CBFFA9 soft
                    'rgba(255,255,255,255)',
                ] }
                start={ { x: 0, y: 0 } }
                end={ { x: 1, y: 1 } }
                style={ styles.container }
            >

                {/* Logo Centered on Red Ellipse */ }

                <svgImages.AppLogo width={ 120 } height={ 120 } />

            </LinearGradient>
        </View>
    );
};

export default WelcomeScreen;

const styles = StyleSheet.create( {
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: Colors.lightBG,
    },
    logoContainer: {
        position: 'absolute',
        // top: 373,
        // left: '50%',
        // transform: [ { translateX: -60 } ],
        // zIndex: 10,
    },
} );
