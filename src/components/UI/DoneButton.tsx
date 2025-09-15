import React from 'react';
import { TouchableOpacity } from 'react-native';
import svgImages from '../../utils/svgImages';
import { wp } from '../../utils/globalUse';

const DoneButton = ( { ...props } ) => {
    return (
        <TouchableOpacity { ...props } style={{marginHorizontal:wp(6)}}>
            <svgImages.NextIcon width={wp(10)} height={wp(10)}/>
        </TouchableOpacity>
    );
};


export default DoneButton;
