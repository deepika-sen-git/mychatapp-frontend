import React from 'react';
import {
    View, Text, FlatList, Image, TouchableOpacity,
} from 'react-native';
import styles from './styles';
import svgImages from '../../utils/svgImages';
import Routes from '../../utils/Routes';
import { RootStackParamList } from '../../AppNavigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import CustomFancyHeader from '../../components/CustomHeader';
// import Colors from '../../theme/colors';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import Colors from '../../theme/colors';
import { formatSeenTime } from '../../utils/formatSeenTime';
import strings from '../../utils/strings';

import { StyleSheet } from "react-native";
import globalUse, { hp, wp } from "../../utils/globalUse";


type Props = NativeStackScreenProps<RootStackParamList, typeof Routes.MESSAGE_INFO>;

const MessageInfo: React.FC<Props> = ( { route, navigation } ) => {
    const { chatId, type, messageId, friendUid } = route.params;
    const { uid } = useSelector( ( state: RootState ) => state.user );

    const messageItem = useSelector(
        ( state: RootState ) =>
            state.messages.messagesByChat[ chatId ]?.find( item => item.id === messageId )
    );


    const friend = useSelector( ( state: RootState ) =>
        state.friends.items.find( f => f.id === friendUid )
    );

    const group = useSelector( ( state: RootState ) =>
        state.groups.items.find( f => f.chatId === chatId )
    );

    const members = useSelector(
        ( state: RootState ) => state.groupMembers.membersByGroup[ chatId ]?.filter( member => member.id !== uid ) || []
    );
    if ( !messageItem ) {
        // Message not found, you can show a placeholder or go back
        return (
            <View style={ { flex: 1, justifyContent: 'center', alignItems: 'center' } }>
                <Text>Message not found</Text>
            </View>
        );
    }

    const isMyMsg = messageItem.senderId === uid;
    const isSeen =
        type === 'group'
            ? messageItem.seenBy.length === members.length
            : messageItem.seenBy.some( user => user.userId === friendUid );

    const readBy = members?.filter( member => messageItem.seenBy?.some( user => user.userId === member.id ) ) || [];
    const unreadBy = members?.filter( member => !messageItem.seenBy?.some( user => user.userId === member.id ) ) || [];
    const seenTime: Record<string, string> = {};

    messageItem?.seenBy?.forEach( user => {
        if ( user.seenAt ) {
            seenTime[ user.userId ] = formatSeenTime( user.seenAt );
        }
    } );
    if ( type !== 'group' ) {

        return (
            <View style={ { flex: 1 } }>
                <CustomFancyHeader
                    leftIcon={ <svgImages.ArrowLeftIcon /> }
                    leftStyle={ { opacity: 0.6 } }
                    onLeftPress={ () => navigation.pop() }
                    centerTitle={ strings.messages }
                    showSubHeader
                    subHeaderTitle={ friend?.name }
                    subHeaderSubtitle={ friend?.phone }
                    subHeaderRightIcon={ <svgImages.DotsCircleIcon /> }
                    subHeaderAvatar={

                        friend?.imageURL ? friend?.imageURL : 'userProfile'

                    }
                    onSubHeaderPress={ () => { navigation.navigate( Routes.FRIEND_PROFILE, { friendUid, chatId } ) } }
                />

                <View style={ styles.container }>
                    <View style={messageInfoStyles.messageContainer }>
                        <View
                            style={ [ styles.messageContainer, isMyMsg ? styles.myMessage : styles.otherMessage ] }

                        >
                            { messageItem.text && <Text style={ styles.messageText }>{ messageItem.text }</Text> }
                            { messageItem.attachments && (
                                <View style={ styles.attachmentsRow }>
                                    { messageItem.attachments.map( ( file, idx ) => {
                                        const isVideo = file.type === 'video';
                                        const uri = file.url;

                                        return (
                                            <View key={ idx }>

                                                { isVideo ?
                                                    <TouchableOpacity style={ messageInfoStyles.video}>
                                                        {/* <Video source={ { uri: item.uri } } style={ styles.mediaItem } /> */ }
                                                        <Image source={ { uri: uri.replace( '/upload/', '/upload/so_2/' ).replace( '.mp4', '.jpg' ) } } style={ styles.attachmentImage } />
                                                        <View style={ styles.previewVideo }>
                                                            <svgImages.VideoPlayIcon width={ 32 } height={ 32 } />
                                                        </View>
                                                    </TouchableOpacity>
                                                    :
                                                    <TouchableOpacity>
                                                        <Image source={ { uri } } style={ styles.attachmentImage } />
                                                    </TouchableOpacity> }
                                            </View>
                                        );

                                    } ) }
                                </View>
                            ) }

                            <View style={ { flexDirection: 'row', justifyContent: isMyMsg ? 'flex-end' : 'flex-start' } }>
                                <Text style={ styles.time }>{ messageItem.time }</Text>
                                { isMyMsg && isSeen && <svgImages.SeenIcon /> }
                                { isMyMsg && !isSeen && <svgImages.UnseenIcon /> }
                            </View>
                        </View>
                    </View>

                    <View style={ styles.seenStatusModal }>
                        <View style={ messageInfoStyles.heading }>
                            <svgImages.SeenIcon />
                            <Text style={ messageInfoStyles.readSentText}>{ strings.readAt }</Text>
                        </View>

                        { messageItem.seenBy?.find( user => user.userId === friendUid ) ?

                            <Text style={ messageInfoStyles.timeAndDate} >{ seenTime[ friendUid ] }</Text> :
                            <Text style={ messageInfoStyles.timeAndDate } >---</Text>

                        }
                        <View/>
                        <View style={ messageInfoStyles.heading }>
                            <svgImages.UnseenIcon />
                            <Text style={ messageInfoStyles.readSentText }>{ strings.sentAt }</Text>
                        </View>
                        

                        <Text style={ messageInfoStyles.timeAndDate } >{ formatSeenTime( messageItem.createdAt ) }</Text>



                    </View>
                </View>
            </View >
        );
    }

    else {
        return (
            <View style={ { flex: 1 } }>
                <CustomFancyHeader
                    leftIcon={ <svgImages.ArrowLeftIcon /> }
                    leftStyle={ { opacity: 0.6 } }
                    onLeftPress={ () => navigation.pop() }
                    centerTitle={ strings.messages }
                    showSubHeader
                    subHeaderTitle={ type === 'group' ? group?.groupName : friend?.name }
                    subHeaderSubtitle={ type === 'group' ? `${ strings.tapToViewGroupInfo }` : friend?.phone }
                    subHeaderRightIcon={ <svgImages.DotsCircleIcon /> }
                    subHeaderAvatar={

                        group?.imageURL ? group?.imageURL : 'groupProfile'


                    }
                    onSubHeaderPress={ () => navigation.navigate( Routes.GROUP_PROFILE, { chatId } ) }
                />

                <View style={ styles.container }>
                    <View style={ messageInfoStyles.messageContainer }>
                        <View
                            style={ [ styles.messageContainer, isMyMsg ? styles.myMessage : styles.otherMessage ] }

                        >
                            { type === 'group' && !isMyMsg && (
                                <Text style={ styles.sender }>{ messageItem.senderName }</Text>
                            ) }
                            { messageItem.text && <Text style={ styles.messageText }>{ messageItem.text }</Text> }
                            { messageItem.attachments && (
                                <View style={ styles.attachmentsRow }>
                                    { messageItem.attachments.map( ( file, idx ) => {
                                        const isVideo = file.type === 'video';
                                        const uri = file.url;

                                        return (
                                            <View key={ idx }>

                                                { isVideo ?
                                                    <TouchableOpacity style={ messageInfoStyles.video}>
                                                        {/* <Video source={ { uri: item.uri } } style={ styles.mediaItem } /> */ }
                                                        <Image source={ { uri: uri.replace( '/upload/', '/upload/so_2/' ).replace( '.mp4', '.jpg' ) } } style={ styles.attachmentImage } />
                                                        <View style={ styles.previewVideo }>
                                                            <svgImages.VideoPlayIcon width={ 32 } height={ 32 } />
                                                        </View>
                                                    </TouchableOpacity>
                                                    :
                                                    <TouchableOpacity>
                                                        <Image source={ { uri } } style={ styles.attachmentImage } />
                                                    </TouchableOpacity> }
                                            </View>
                                        );

                                    } ) }
                                </View>
                            ) }

                            <View style={ { flexDirection: 'row', justifyContent: isMyMsg ? 'flex-end' : 'flex-start' } }>
                                <Text style={ styles.time }>{ messageItem.time }</Text>
                                { isMyMsg && isSeen && <svgImages.SeenIcon /> }
                                { isMyMsg && !isSeen && <svgImages.UnseenIcon /> }
                            </View>
                        </View>
                    </View>

                    <View style={ styles.seenStatusModal }>
                        <View style={ messageInfoStyles.heading }>
                            <svgImages.SeenIcon />
                            <Text style={ messageInfoStyles.readSentText }>{ strings.readBy }</Text>
                        </View>
                        { readBy.length &&
                            <FlatList data={ readBy }
                            keyExtractor={ member => member.id }
                            contentContainerStyle={ { marginVertical: 2 } }
                            renderItem={ ( { item } ) => {
                                return (
                                    <View style={ messageInfoStyles.listItem }>
                                        <View style={ messageInfoStyles.memberInfoContainer }>
                                            <Image source={ item.imageURL ? { uri: item.imageURL } : require( '../../assets/pngs/EmptyProfile.png' ) } style={ styles.avatar } />
                                            <Text style={ messageInfoStyles.membersName }>{ item.name }</Text>
                                        </View>
                                        <View>
                                            { seenTime[ item.id ] && <Text style={ messageInfoStyles.timeAndDate }>{ seenTime[ item.id ] }</Text> }
                                        </View>
                                    </View>
                                )
                                } } />
                        }
                        
                        { !readBy.length && <Text style={ messageInfoStyles.timeAndDate } >---</Text> }
                        
                        <View style={ messageInfoStyles.heading }>
                            <svgImages.UnseenIcon />
                            <Text style={messageInfoStyles.readSentText }>{ strings.unreadBy }</Text>
                        </View>
                        { unreadBy.length && <FlatList data={ unreadBy }
                            keyExtractor={ member => member.id }
                            renderItem={ ( { item } ) => {
                                return ( <View style={ messageInfoStyles.listItem }>

                                    <View style={ messageInfoStyles.memberInfoContainer }>
                                        <Image source={ item.imageURL ? { uri: item.imageURL } : require( '../../assets/pngs/EmptyProfile.png' ) } style={ styles.avatar } />
                                        <Text style={ messageInfoStyles.membersName }>{ item.name }</Text>
                                    </View>
                                    <View>
                                        <Text style={ messageInfoStyles.timeAndDate }>{ formatSeenTime( messageItem.createdAt ) }</Text>
                                    </View>
                                </View>
                                )
                            } }
                            contentContainerStyle={ { marginVertical: 2 } } />
}
                        { !unreadBy.length && <Text style={ messageInfoStyles.timeAndDate } >---</Text> }
                    </View>
                </View>
            </View >
        );
    }

};

export default MessageInfo;




const messageInfoStyles = StyleSheet.create( {
    messageContainer: { borderBottomColor: Colors.textInputBorder, borderBottomWidth: 0.5, marginVertical: 5, padding: hp(2), } ,
    video: { position: 'relative', marginRight: 8 },
    readSentText: { fontWeight: '600', fontSize: wp(4) },
    timeAndDate: { fontSize: wp(3.5), fontWeight: '700', color: '#8C8C8C', marginVertical:hp(1.5) },
    membersName: { fontSize: wp(4), fontWeight: '700' },
    memberInfoContainer: { flexDirection: 'row', marginVertical: 5, alignItems: 'center', gap: 10 },
    listItem: { flexDirection: 'row', marginVertical: 5, alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10 },
    heading: { borderBottomWidth: 0.5, borderBottomColor: Colors.textInputBorder, flexDirection: 'row', gap: wp( 3 ), marginVertical: hp( 1 ), alignItems: 'center', paddingBottom: hp( 1.5 ) },
    
} );

