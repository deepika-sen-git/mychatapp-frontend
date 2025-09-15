import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    GestureResponderEvent,
    ViewStyle,
    TextStyle,
} from 'react-native';
import Colors from '../../theme/colors';
import { wp } from '../../utils/globalUse';

interface PlainButtonProps {
    title: string;
    onPress?: ( event: GestureResponderEvent ) => void;
    containerStyle?: ViewStyle;
    textStyle?: TextStyle;
}
const CustomPlainButton: React.FC<PlainButtonProps> = ( {
    title,
    onPress,
    containerStyle,
    textStyle,
} ) => {
    return (
        <TouchableOpacity
            onPress={ onPress }
            activeOpacity={ 0.7 }
            style={ [ styles.button, containerStyle ] }
        >
            <Text style={ [ styles.text, textStyle ] }>
                { title }
            </Text>
        </TouchableOpacity>
    );
};

export default CustomPlainButton;

const styles = StyleSheet.create( {
    button: {
        paddingTop: 4,
        paddingHorizontal: 2,
        alignItems: 'flex-end',
        justifyContent: 'center',
        borderBottomColor: Colors.primary,
        borderBottomWidth: 1,
    },
    text: {
        color: Colors.primary,
        fontSize: wp( 3.3 ),
        fontWeight: '600',
        textAlign: 'center',
    },
} );

