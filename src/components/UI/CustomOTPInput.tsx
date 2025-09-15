import React, { useRef, useState } from 'react';
import {
    View,
    TextInput,
    StyleSheet,
    TextInputKeyPressEventData,
    NativeSyntheticEvent,
} from 'react-native';
import Colors from '../../theme/colors';
import globalUse from '../../utils/globalUse';

interface Props {
    value: string;
    onChangeText: ( value: string ) => void;
    error?: boolean;
    length?: number;
}

const CustomOTPInput: React.FC<Props> = ( { value, onChangeText, error, length = 5 } ) => {
    const inputsRef = useRef<Array<TextInput | null>>( [] );
    const [ focusedIndex, setFocusedIndex ] = useState<number | null>( null );

    const handleChange = ( text: string, index: number ) => {
        const newValue = value.split( '' );
        newValue[ index ] = text;
        const finalValue = newValue.join( '' ).slice( 0, length );
        onChangeText( finalValue );

        if ( text && index < length - 1 ) {
            inputsRef.current[ index + 1 ]?.focus();
        }
        if ( text && index <= length - 1 && finalValue.length < length - 1 ) {
            inputsRef.current[ finalValue.length ]?.focus();
        }
        if ( text && index == length - 1 ) {
            inputsRef.current[ index ]?.focus();
        }
    };

    const handleKeyPress = (
        e: NativeSyntheticEvent<TextInputKeyPressEventData>,
        index: number
    ) => {
        if ( e.nativeEvent.key === 'Delete' && !value[ index ] && index > 0 ) {
            inputsRef.current[ index - 1 ]?.focus();
        }
    };

    const renderInputs = () => {
        const inputs = [];

        for ( let i = 0; i < length; i++ ) {
            const char = value[ i ] || '';
            const isFocused = focusedIndex === i;

            let borderColor = Colors.textInputBorder;
            if ( error ) {
                borderColor = Colors.errorBorder;
            } else if ( isFocused || char ) {
                borderColor = Colors.black;
            }

            inputs.push(
                <TextInput
                    key={ i }
                    ref={ ( ref ) => {
                        inputsRef.current[ i ] = ref;
                    } }
                    value={ char }
                    onChangeText={ ( text ) => handleChange( text, i ) }
                    onKeyPress={ ( e ) => handleKeyPress( e, i ) }
                    maxLength={ 1 }
                    keyboardType="number-pad"
                    onFocus={ () => setFocusedIndex( i ) }
                    onBlur={ () => setFocusedIndex( null ) }
                    style={ [
                        styles.input,
                        {
                            borderColor,
                        },
                    ] }
                />
            );
        }

        return inputs;
    };

    return <View style={ styles.container }>{ renderInputs() }</View>;
};

export default CustomOTPInput;

const styles = StyleSheet.create( {
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignSelf: 'center',
        width: globalUse.WIDTH * 0.9,
        marginVertical: 20,
    },
    input: {
        width: 62,
        height: 70,
        borderWidth: 1,
        borderRadius: 12,
        backgroundColor: Colors.white,
        textAlign: 'center',
        fontSize: 28,
        fontWeight: '500',
        // margin: 4.5,
    },
} );
