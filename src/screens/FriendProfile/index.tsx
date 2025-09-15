// src/screens/ProfileScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../AppNavigator';
import Routes from '../../utils/Routes';
import svgImages from '../../utils/svgImages';
import CustomFancyHeader from '../../components/CustomHeader';
import CopyButton from '../../components/CopyButton';
import DeleteChatDropdown from '../../components/UI/DeleteChatDropdown';
import Colors from '../../theme/colors';
import { RootState } from '../../store';
import { useSelector } from 'react-redux';
import strings from '../../utils/strings';
import { getChatDeleteSetting, updateChatDeleteSetting } from '../../api/privateChats';
import { applyDeleteAtToOldMessages } from '../../api/messages';
import { hp, wp } from '../../utils/globalUse';

export type NullableNumber = number | null;

type Props = NativeStackScreenProps<RootStackParamList, typeof Routes.FRIEND_PROFILE>;

const FriendProfile: React.FC<Props> = ( { navigation, route } ) => {

    const [ deleteAfterDays, setDeleteAfterDays ] = useState<NullableNumber>( null );
    const { chatId, friendUid } = route.params;
    // console.log( "friendUid ", friendUid );

    const friend = useSelector( ( state: RootState ) =>
        state.friends.items.find( f => f.id === friendUid )
    );
    const medialength = useSelector(
        ( state: RootState ) => state.messages.mediaByChat[ chatId ]?.length || 0
    );

    useEffect( () => {
        const fetchDeleteSetting = async () => {
            const setting = await getChatDeleteSetting( chatId );
            console.log( "Delete setting for chatId", chatId, "is", setting );

            setDeleteAfterDays( setting ); // e.g. null or a number
        };
        fetchDeleteSetting();
    }, [ chatId ] );

    // console.log( friend );
    const handleDropDownChanges = async ( newValue: NullableNumber ) => {
        setDeleteAfterDays( newValue );
        updateChatDeleteSetting( chatId, newValue );
        applyDeleteAtToOldMessages( chatId, newValue );
    }

    return (
        <View style={ { flex: 1 } }>
            <CustomFancyHeader
                leftIcon={
                    <svgImages.ArrowLeftIcon />
                }
                onLeftPress={ () => navigation.goBack() }
                leftStyle={ { opacity: 0.6 } }
                centerTitle={ strings.profile }
            />
            <View style={styles.container}>
                <View style={ {} }>
                    <View style={ styles.imageContainer}>
                        { friend?.imageURL ? <Image source={ { uri: friend.imageURL } } style={ styles.avatarCircle } /> : <Image source={require('../../assets/pngs/EmptyProfile.png')} style={ styles.avatarCircle } /> }
                    </View>

                    <Text style={ styles.name }>{ friend?.name || strings.deletedUser }</Text>
                    { friend?.phone || friend?.userCode ? (
                        <>
                            <View style={ styles.row }>
                                <Text>{ `${ friend?.phone }` }</Text>
                                <CopyButton textToCopy={ friend?.phone ?? '' } />
                            </View>
                            <View style={ styles.row }>
                                <Text>{ friend?.userCode }</Text>
                                <CopyButton textToCopy={ friend?.userCode ?? '' } />
                            </View>
                        </>
                    ) : null}
                </View>
                <View style={ styles.border} />
                <View style={ styles.optionsContainer}>


                    <TouchableOpacity style={ styles.option } onPress={ () => navigation.navigate( Routes.MEDIA, { chatId } ) }>
                        <View style={styles.optionContainer}>
                            <svgImages.GallerySmallIcon />
                            <Text style={styles.optionText}>{ strings.media }</Text>
                        </View>
                        <View style={ styles.mediaLengthText}>
                            <Text>{ `${ medialength < 10 ? 0 : '' }${ medialength }` }</Text>
                            <svgImages.ChevronRightIcon />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={ styles.option }>
                        <View style={ styles.optionContainer}>
                            <svgImages.DustBinIcon />
                            <Text style={styles.optionText}>{ strings.deleteChat }</Text>
                        </View>
                        <DeleteChatDropdown value={ deleteAfterDays } onChange={ ( newValue ) => { handleDropDownChanges( newValue ) } } />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
export default FriendProfile;
const styles = StyleSheet.create( {
    container: { flex: 1, backgroundColor: Colors.lightBG, marginTop: 2 } ,
    name: { textAlign: 'center', fontWeight: 'bold', fontSize: wp(5.5), marginVertical: hp(1.5)},
    row: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: hp(0.5), gap: wp(10) },
    option: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: hp(1) },
    avatarCircle: {
        width: wp(35),
        height: wp(35),
        borderRadius: 100,
        margin: wp(2),
// backgroundColor:'black'
    },
    optionText: { fontFamily:'Poppins-Bold', fontSize:wp(3.8) },
    optionContainer: { flexDirection: 'row', gap: wp(4) },
    optionsContainer: { marginVertical: hp(0.5), marginHorizontal:wp(5), gap:hp(1) },
    imageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    border: {
        borderTopWidth: hp( 0.05 ), borderTopColor: 'grey',
        marginVertical: hp( 2), marginHorizontal: wp( 5 ),
    },
    mediaLengthText: { flexDirection: 'row', gap: wp(2) }
    
} );

