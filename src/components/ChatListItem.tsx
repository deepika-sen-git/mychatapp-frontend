import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
// import svgImages from '../utils/svgImages';
import globalUse, { hp, wp } from '../utils/globalUse';
import Colors from '../theme/colors';
// import GroupProfileSVG from '../assets/svgs/GroupProfile.svg';

interface Props {
    avatar?: string;
    name: string;
    message: string;
    time: string;
    unreadCount?: number;
    isGroup: boolean;
    onPress?: () => void;

}

const ChatsListItem: React.FC<Props> = ( { avatar, name, message, time, unreadCount, onPress, isGroup } ) => {
    // console.log( '🔵 ChatsListItem rendered:', name );
    // console.log( ' name: ', name );



    return (
        <TouchableOpacity style={ chatListItemStyle.container } onPress={ onPress }>
            { avatar ? (
                <Image source={ { uri: avatar } } style={ chatListItemStyle.avatar } />
            ) : (
                <View style={ chatListItemStyle.groupIcon }>
                 
                { isGroup ? <Image source={ require( '../assets/pngs/GroupProfile.png' ) } style={ { width: wp( 12 ), height: wp( 12 ), borderRadius: 20, } } />
                                                : <Image source={ require( '../assets/pngs/EmptyProfile.png' ) } style={ { width: wp( 12 ), height: wp( 12 ), borderRadius: 20 } } />
                    
                     }
                                  
                </View>
            ) }

            <View style={ chatListItemStyle.content }>
                <View style={ chatListItemStyle.nameRow }>
                    <Text style={ chatListItemStyle.name }>{ name }</Text>
                    <View style={ chatListItemStyle.timeDate }>
                        <Text style={ chatListItemStyle.time }>{ time }</Text>

                    </View>
                </View>
                <View style={ chatListItemStyle.nameRow }>
                    <View style={ { maxWidth: globalUse.WIDTH * 0.65 } }>
                        <Text numberOfLines={ 1 } style={ chatListItemStyle.message }>{ message }</Text>
                    </View>
                    { unreadCount ? (
                        <View style={ chatListItemStyle.badge }>
                            <Text style={ chatListItemStyle.badgeText }>{ unreadCount }</Text>
                        </View>
                    ) : null }
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default React.memo( ChatsListItem );


export const chatListItemStyle = StyleSheet.create( {
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: hp(1.1),
        paddingHorizontal: wp(2.5),
        borderBottomWidth: hp(0.1),
        borderBottomColor: '#ddd',
        backgroundColor: 'white',
        marginVertical: hp(0.5),
    },
    avatar: {
        width: wp( 12 ),
        height: wp( 12 ),
        borderRadius: 50
    },
    groupIcon: {
       
        // borderRadius: 24,
        // backgroundColor: 'red',
        alignItems: 'center',
        justifyContent: 'center'
    },
    content: {
        flex: 1,
        marginLeft: wp(3),
        gap: hp(0.5)
    },
    nameRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    name: {
        fontSize: wp(4),
        fontWeight: '600',
        fontFamily:'Poppins-SemiBold'
    },
    timeDate: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: wp(2),

    },
    time: {
        fontSize: wp(3),
        color: '#8C8C8C',
        fontWeight: '700',
        fontFamily:'Inter_24pt-Regular'
    },
    message: {
        fontSize: wp(3.2),
        color: '#8C8C8C',
        marginTop: hp(0.2),
    },
    badge: {
        backgroundColor: Colors.primary,
        borderRadius: 10,
        height: wp(5),
        paddingHorizontal: wp(1),
        paddingVertical: wp(0.5),
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: wp(1),
        minWidth: wp(5),
        maxWidth: wp(10),
    },
    badgeText: {
        color: 'white',
        fontSize: wp(3),
        fontWeight: '700'
    }
} );
