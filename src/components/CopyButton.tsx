import React from 'react';
import { TouchableOpacity, View, Alert } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import svgImages from '../utils/svgImages'; // adjust the import to your path

interface Props {
    textToCopy: string;
}

const CopyExample: React.FC<Props> = ( { textToCopy } ) => {

    const handleCopy = () => {
        Clipboard.setString( textToCopy );
        Alert.alert( 'Copied!', `${ textToCopy } copied to clipboard` );
    };


    return (
        <View>
            <TouchableOpacity onPress={ handleCopy }>
                <svgImages.CopyIcon />
            </TouchableOpacity>

        </View>
    );
}
export default CopyExample;
