import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    GestureResponderEvent,
    ViewStyle,
    TextStyle,
    StyleProp,
} from 'react-native';
import { hp, wp } from '../../utils/globalUse';
import Colors from '../../theme/colors';

type CustomButtonProps = {
    title: string;
    onPress?: ( event: GestureResponderEvent ) => void;
    width?: number;
    height?: number;
    opacity?: number;
    borderRadius?: number;
    paddingHorizontal?: number;
    backgroundColor?: string;
    marginTop?: number;
    textStyle?: StyleProp<TextStyle>;
    style?: StyleProp<ViewStyle>;
    disabled?: boolean;
    borderColor?: string;
};

const CustomButton: React.FC<CustomButtonProps> = ( {
    title,
    onPress,
    width = wp( 90 ),
    height = hp( 6.5 ),
    opacity = 1,
    borderRadius = 10,
    paddingHorizontal = 0,
    marginTop = 5,
    backgroundColor = Colors.primary,
    textStyle,
    style,
    borderColor = Colors.white,
    disabled = false,
} ) => {
    return (
        <TouchableOpacity
            activeOpacity={ 0.7 }
            onPress={ onPress }
            disabled={ disabled }
            style={ [
                {
                    width,
                    height,
                    opacity,
                    borderRadius,
                    paddingHorizontal,
                    backgroundColor,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop,
                    borderColor,
                    borderWidth: 1,
                },
                style,
            ] }
        >
            <Text style={ [ styles.text, textStyle ] }>{ title }</Text>
        </TouchableOpacity>
    );
};

export default CustomButton;

const styles = StyleSheet.create( {
    text: {
        fontSize: wp( 4 ),
        fontWeight: '500',
        color: Colors.white,
        fontFamily: 'Poppins-Regular'
    },
} );
