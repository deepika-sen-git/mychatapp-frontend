import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import CheckedSVG from '../../assets/svgs/CheckedBox.svg';
import UncheckedSVG from '../../assets/svgs/UncheckedBox.svg';
import { hp, wp } from '../../utils/globalUse';

type Props = {
    checked: boolean;
    text?: string;               // Keep optional
    textComponent?: React.ReactNode; 
    onToggle: () => void;
    style?: object;
};

const CustomCheckbox = ( { checked, text, onToggle, style, textComponent }: Props ) => {
    return (
        <TouchableOpacity style={ [ styles.row, style ] } onPress={ onToggle }>
            <View>
                { checked ? <CheckedSVG style={ styles.checkedBox } /> : <UncheckedSVG style={ styles.checkedBox } /> }
            </View>
            { textComponent ? (
                textComponent
            ) : (
                <Text style={ styles.label }>{ text }</Text>
            ) }
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create( {
    row: { flexDirection: 'row', alignItems: 'center', justifyContent:'flex-start', paddingVertical:hp(1) },
    checkedBox: {
        width: wp(5),
        height: wp(5),
        marginRight: wp( 2 ),
        // backgroundColor:'blue'
    },
    label: { fontSize: wp(3.5), fontFamily:'Inter_24pt-Regular' },
} );

export default CustomCheckbox;
