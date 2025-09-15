import React from 'react';
import { View, Text, StyleSheet, Linking } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import svgImages from '../../utils/svgImages';
import CustomFancyHeader from '../../components/CustomHeader';
import Routes from '../../utils/Routes';
import { RootStackParamList } from '../../AppNavigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Colors from '../../theme/colors';
import strings from '../../utils/strings';
// import globalUse from '../../utils/globalUse';

type Props = NativeStackScreenProps<RootStackParamList, typeof Routes.ABOUT_APP>;

const AboutAppScreen: React.FC<Props> = ( { navigation } ) => {
    return (
        <>
            <CustomFancyHeader
                leftIcon={ <svgImages.ArrowLeftIcon /> }
                onLeftPress={ () => navigation.navigate( Routes.PROFILE_MENU ) }
                leftStyle={ { opacity: 0.6 } }
                centerTitle={strings.aboutApp}
            />

            <LinearGradient
                colors={ [
                    'rgba(255, 157, 35, 0.1)',   // #FF9D23 soft
                    'rgba(255,255,255,255)',
                    'rgba(249, 56, 39, 0.05)',    // #F93827 soft
                    'rgba(255,255,255,255)',
                    'rgba(203, 255, 169, 0.05)',   // #CBFFA9 soft
                    'rgba(255,255,255,255)',
                ] }
                start={ { x: 0, y: 0 } }
                end={ { x: 1, y: 1 } }
                style={ styles.container }
            >
                <svgImages.AppLogo width={ 120 } height={ 105 } />

                <Text style={ styles.version }>Version 1.1.0</Text>

                <View style={ styles.footer }>
                    <Text
                        style={ styles.link }
                        onPress={ () => Linking.openURL( 'https://www.mychat.com' ) }
                    >
                        www.mychat.com
                    </Text>
                    <Text style={ styles.copyright }>
                        Copyright © 2025 <Text style={ styles.highlight }>MyChat</Text> All rights reserved.
                    </Text>
                </View>
            </LinearGradient>
        </>
    );
};

const styles = StyleSheet.create( {
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: Colors.lightBG,
    },
    appName: {
        fontSize: 24,
        fontWeight: '700',
        marginTop: 12,
        color: '#000',
    },
    version: {
        fontSize: 16,
        color: Colors.primary,
        marginTop: 4,
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        alignItems: 'center',
    },
    link: {
        color: '#000',
        textDecorationLine: 'underline',
        marginBottom: 4,
    },
    copyright: {
        color: '#000',
        fontSize: 12,
    },
    highlight: {
        color: Colors.primary,
    },
} );

export default AboutAppScreen;
