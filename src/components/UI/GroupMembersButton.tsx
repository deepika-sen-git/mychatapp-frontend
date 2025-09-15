import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import SvgImages from '../../utils/svgImages';
import Colors from '../../theme/colors';
import globalUse, { hp, wp } from '../../utils/globalUse';
import strings from '../../utils/strings';

interface Props {
    memberImages: string[]; // array of image URLs
    onPress: () => void;
}

const GroupMembersButton = ( { memberImages, onPress }: Props ) => {
    return (
        <TouchableOpacity style={ styles.button } onPress={ onPress }>
            <View style={ styles.imagesContainer }>
                { memberImages.slice( 0, 3 ).map( ( uri, index ) => (
                    <Image
                        key={ index }
                        source={ uri ? { uri: uri } : require( '../../assets/pngs/EmptyProfile.png' ) }
                        style={ [
                            styles.image,
                            { right: index * 12, zIndex: 3 - index }
                        ] }
                    />
                ) ) }
            </View>

            <Text style={ styles.text }>{ strings.seeAllMembers }</Text>
            <SvgImages.ChevronRightWhiteIcon />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create( {
    button: {
        backgroundColor: Colors.primary, // green
        borderRadius: 10,
        paddingVertical: hp(1),
        paddingRight: wp(3),
        flexDirection: 'row',
        alignItems: 'center',
        width: wp(90),
        marginHorizontal: wp(5),
        marginVertical: hp(3),
        height: hp(7.5),
        paddingLeft:wp(5)
    },
    imagesContainer: {
        flexDirection: 'row',
        marginRight: wp(3),
        position: 'relative',
        width: 60,
        height: 40,
    },
    image: {
        width: 42,
        height: 42,
        borderRadius: 100,
        borderWidth: 2,
        borderColor: '#fff',
        position: 'absolute',
    },
    text: {
        flex: 1,
        color: '#fff',
        fontWeight: '600',
        fontSize: wp(5),
        marginLeft: 10,
        fontFamily:'Roboto-Medium'
    },
} );

export default GroupMembersButton;
