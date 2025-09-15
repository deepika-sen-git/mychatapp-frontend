import React, { useState } from 'react';
import { TextInput, Text, View, StyleSheet, TouchableOpacity, } from 'react-native';
import { hp, wp } from '../../utils/globalUse';
import SvgImages from '../../utils/svgImages';
import Colors from '../../theme/colors';

// CustomTextInput.tsx
type Props = {
    label: string;
    value: string;
    onChangeText: ( val: string ) => void;
    placeholderText?: string;
    keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'numeric' | 'number-pad' | 'decimal-pad' | 'visible-password' | undefined;
    secureTextEntry?: boolean;
    icon?: boolean;
    eyeOn?: boolean;
    style?: object;
    inputStyle?: object;
    autocapitalize?: 'none' | 'sentences' | 'words' | 'characters' | undefined;
};


const CustomTextInput = ( { label, value, onChangeText, placeholderText, icon, secureTextEntry = false, autocapitalize, style,inputStyle, ...rest }: Props ) => {
    const [ isPasswordVisible, setIsPasswordVisible ] = useState( false );
    return (
        <View style={ [ styles.container, style ] }>
            <Text style={ styles.label }>{ label }</Text>
            <TouchableOpacity style={ styles.inputContainer }>
                <TextInput
                    value={ value }
                    onChangeText={ onChangeText }
                    placeholder={ placeholderText }
                    { ...rest }
                    style={ (icon && secureTextEntry) ? styles.passwordInput :styles.input }
                    secureTextEntry={ secureTextEntry && !isPasswordVisible }
                    keyboardType={ rest.keyboardType || 'default' }
                    autoCapitalize={ autocapitalize || 'none' }
                />
                { icon && secureTextEntry && (
                    <TouchableOpacity onPress={ () => setIsPasswordVisible( prev => !prev ) } style={ styles.icon }>
                        { isPasswordVisible ? <SvgImages.EyeOnIcon /> : <SvgImages.EyeOffIcon /> }
                    </TouchableOpacity>
                ) }
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create( {
    container: { marginVertical: hp( 1 ) },
    label: { fontSize: wp( 3.5), marginBottom: hp( 0.3 ), color: Colors.black, fontFamily: 'Inter_24pt-Regular' },
    inputContainer: {
        width: wp( 90 ),
        height: hp( 6.5 ),
        borderWidth: 1,
        borderColor: Colors.textInputBorder,
        borderRadius: 10,
        paddingHorizontal: wp( 3 ),
        // paddingVertical: hp( 0.05 ),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    input: {
        fontSize: wp( 4 ),
        width: wp( 90 ),
        height: hp( 6.5 ),
        // flex: 1,
    },
    passwordInput: {
        fontSize: wp( 4 ),
        width: wp( 70 ),
        height: hp( 6.5 ),
        // flex: 1,
    },
    icon: {
        paddingHorizontal: 8,
       
    },
} );

export default CustomTextInput;
