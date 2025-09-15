import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import SvgImages from '../utils/svgImages';
import { useNavigation } from '@react-navigation/native';
import Colors from '../theme/colors';
import { hp, wp } from '../utils/globalUse';

type Props = {
    showIcon?: boolean;
    title: string;
    onPress?: () => void;
    crossIcon?: boolean;
};

const HeaderLeftWithTitle = ( { title, showIcon, crossIcon = false, onPress }: Props ) => {
    const navigation = useNavigation();

    return (
        <View style={ styles.container }>
            { !showIcon && <TouchableOpacity onPress={ onPress ?? ( () => navigation.goBack() ) }  >
                { crossIcon ? <SvgImages.CrossIcon /> : <SvgImages.ChevronBackIcon /> }
            </TouchableOpacity> }
            <Text style={ styles.title }>{ title }</Text>
        </View>
    );
};

export default HeaderLeftWithTitle;

const styles = StyleSheet.create( {
    container: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginLeft: 0,
        backgroundColor: Colors.lightBG,
    },
    title: {
        fontSize: wp(8),
        // fontWeight: '700',
        color: Colors.headingText,
        marginTop: hp( 1 ),
        fontFamily: 'Poppins-Bold'
    },
} );
