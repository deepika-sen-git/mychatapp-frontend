// components/OnboardingTitle.tsx
import React from 'react';
import { Text, View, StyleSheet, TextStyle } from 'react-native';
import { Fonts } from '../utils/Fonts';
import Colors from '../theme/colors';
import globalUse, { hp, wp } from '../utils/globalUse';

interface OnboardingTitleProps {
    title: string;
    highlights?: string[];
}

const OnboardingTitle: React.FC<OnboardingTitleProps> = ( {
    title,
    highlights = [],
} ) => {
    const words = title.split( ' ' );

    return (
        <View style={ styles.container }>
            <Text style={ styles.title }>
                { words.map( ( word, index ) => {
                    const cleanWord = word.replace( /[^a-zA-Z]/g, '' );
                    const isHighlight = highlights.includes( cleanWord );

                    return (
                        <Text
                            key={ index }
                            style={ isHighlight ? styles.highlight : styles.normal }
                        >
                            { word + ' ' }
                        </Text>
                    );
                } ) }
            </Text>
        </View>
    );
};

export default OnboardingTitle;


const styles = StyleSheet.create( {
    container: {
        alignItems: 'center',
        marginTop: hp( 0.5 ),
        paddingHorizontal: wp( 5 ),
    },
    title: {
        fontFamily: 'Poppins-ExtraBold',
        // fontSize: 30,
        // lineHeight: 36,
        // letterSpacing: -0.75, // -2.5% of 30px = -0.75
        // textAlign: 'center',
        // marginTop: 0,
    },
    highlight: {
        fontFamily: 'Poppins-ExtraBold',
        fontSize: globalUse.HEIGHT > 700 ? wp( 7 ) : wp( 5 ),
        lineHeight: globalUse.HEIGHT > 700 ? hp(4) : hp(3),
        letterSpacing: -0.75, // -2.5% of 30px = -0.75
        textAlign: 'center',
        marginTop: 0,
        color: Colors.primary, // your highlight color
        textTransform: 'uppercase',
    },
    normal: {
        fontFamily: 'Poppins-ExtraBold',
        fontSize: globalUse.HEIGHT > 700 ? wp(7) : wp(5),
        lineHeight: globalUse.HEIGHT > 700 ? hp( 4 ) : hp( 3 ),
        letterSpacing: -0.75, // -2.5% of 30px = -0.75
        textAlign: 'center',
        marginTop: 0,
        color: Colors.black,
    },
} );
