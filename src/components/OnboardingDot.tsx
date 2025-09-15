// components/OnboardingDot.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Colors from '../theme/colors';
import { hp, wp } from '../utils/globalUse';

interface DotProps {
    selected: boolean;
}

const OnboardingDot: React.FC<DotProps> = ( { selected } ) => {
    return <View style={ selected ? styles.activeDot : styles.inactiveDot } />;
};

const styles = StyleSheet.create( {
    activeDot: {
        width: wp( 5 ),
        height: hp( 0.8 ),
        borderRadius: 25,
        backgroundColor: Colors.black, // or your theme color
        marginHorizontal: wp( 1 ),
    },
    inactiveDot: {
        width: wp( 1.5),
        height: wp(1.5),
        borderRadius: 25,
        backgroundColor: Colors.dotColor, // light grey or your choice
        marginHorizontal: wp(1),
    },
} );

export default OnboardingDot;
