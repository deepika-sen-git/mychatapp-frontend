// src/components/DeleteChatDropdown.tsx
import React, { useState } from 'react';
import { TouchableOpacity, Text, View, Modal, StyleSheet } from 'react-native';
import svgImages from '../../utils/svgImages';
import globalUse, { hp, wp } from '../../utils/globalUse';
import strings from '../../utils/strings';

type Props = {
    value: number | null;
    onChange: ( val: number | null ) => void;
};

const options = [
    { label: strings.never, value: null },
    { label: `01 ${ strings.day }`, value: 1 },
    { label: `05 ${ strings.days }`, value: 5 },
    { label: `07 ${ strings.days }`, value: 7 },
];

export default function DeleteChatDropdown( { value, onChange }: Props ) {
    const [ visible, setVisible ] = useState( false );

    return (
        <View style={ styles.dropdownWrapper }>
            <TouchableOpacity onPress={ () => setVisible( true ) }>
                <View style={ styles.dropdownButton }>
                    {/* Find the label for the selected value */ }
                    <Text>{ options.find( o => o.value === value )?.label }</Text>
                    <svgImages.ChevronRightIcon style={ { transform: [ { rotate: '90deg' } ] } } />
                </View>
            </TouchableOpacity>

            <Modal visible={ visible } transparent animationType="fade">
                <TouchableOpacity
                    style={ styles.modalOverlay }
                    activeOpacity={ 1 }
                    onPress={ () => setVisible( false ) }
                >
                    <View style={ styles.modalRight }>
                        { options.map( opt => (
                            <TouchableOpacity
                                key={ String( opt.value ) }
                                onPress={ () => { onChange( opt.value ); setVisible( false ); } }
                                style={ styles.option }
                            >
                                <Text style={ opt.value === value ? styles.selectedText : styles.optionText }>
                                    { opt.label }
                                </Text>
                            </TouchableOpacity>
                        ) ) }
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}


const styles = StyleSheet.create( {
    dropdownWrapper: {
        position: 'relative',
    },
    dropdownButton: {
        flexDirection: 'row',
        // alignItems: 'center',
        // justifyContent:'center',
        gap: wp( 2 ),
        fontSize: wp( 4 ),
        fontFamily:'Poppins-Regular',
    },
    modalOverlay: {
        // backgroundColor: 'red',
        // Transparent background, so rest of UI isn't darkened
    },
    modalRight: {
        position: 'absolute',
        top: hp(55),         // adjust to where you want it (can also use measure() for exact)
        right: wp(3),        // align to right edge
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: wp(4),
        gap: wp(4),
        shadowColor: '#00000040',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.9,
        shadowRadius: 4,
        elevation: 10,
        width: wp(33),
        height: hp(33),

    },
    option: {
        flex: 1,
        // width: '100%',
        // backgroundColor:'blue',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomColor: 'grey',
        borderBottomWidth: hp( 0.03 ),
        

    },
    optionText: {
        fontWeight: '500',
        fontSize: wp( 4 ),
        fontFamily:'Roboto-Medium'
    },
    selectedText: {
        backgroundColor: '#16C47F1A',
        fontWeight: '500',
        fontSize: wp( 4.5 ),
        fontFamily: 'Roboto-Medium',
        borderRadius: 10,
        // paddingHorizontal: 23,
        paddingVertical: hp(1.5),
        width: '100%',
        height: '100%',
        marginBottom: hp( 2 ),
        textAlign: 'center',
        
        // alignContent: 'center',
        // alignSelf:'center'
    },
} );
