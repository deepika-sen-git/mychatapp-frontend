// src/screens/ProfileScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../AppNavigator';
import Routes from '../../utils/Routes';
import svgImages from '../../utils/svgImages';
import CustomFancyHeader from '../../components/CustomHeader';
import Colors from '../../theme/colors';
import { AppDispatch, RootState } from '../../store';
import { useDispatch, useSelector } from 'react-redux';
import GroupMembersButton from '../../components/UI/GroupMembersButton';
import ConfirmationModal from '../../components/UI/ConfirmationModal';
import { arrayRemove, doc, Timestamp, updateDoc } from 'firebase/firestore';
import { db } from '../../utils/firebaseConfig';
import { resetGroupMembers } from '../../store/slices/groupMembersSlice';
import { removeGroup } from '../../store/slices/groupSlice';
import { pickImage } from '../../utils/pickImage';
import { changeGroupImage } from '../../api/groups';
import { getChatMediaAttachments } from '../../api/messages';
import strings from '../../utils/strings';
import { hp, wp } from '../../utils/globalUse';

type media = { id: string; uri: string; type: string; date: string, createdAt: Timestamp }[];
type Props = NativeStackScreenProps<RootStackParamList, typeof Routes.GROUP_PROFILE>;

const GroupProfile: React.FC<Props> = ( { navigation, route } ) => {

    const [ showLeaveModal, setShowLeaveModal ] = useState( false );
    const dispatch = useDispatch<AppDispatch>();
    const { chatId } = route.params;
    const [ groupImages, setGroupImage ] = useState<{ local: string; remote: string }>( {
        local: '',
        remote: ''
    } );
    const { uid } = useSelector( ( state: RootState ) =>
        state.user
    );
    console.log( "chatId in Group Profile", chatId );

    const group = useSelector( ( state: RootState ) =>
        state.groups.items.find( f => f.chatId === chatId )
    );

    const members = useSelector( ( state: RootState ) =>
        state.groupMembers.membersByGroup[ chatId ] || []
    );
    // console.log( "members in Group Profile", members );

    const membersImages = members.map( item => item.imageURL );


    const handlePickGroupImage = async () => {
        try {
            const { imageUri, uploadedUrl } = await pickImage();

            if ( imageUri && uploadedUrl ) {
                setGroupImage( { local: imageUri, remote: uploadedUrl } );
                let groupImage = uploadedUrl;
                await changeGroupImage( chatId, groupImage );
            }
        } catch ( error ) {
            console.error( 'Error picking/uploading image:', error );
        }
    };

    const handleLeaveGroup = async () => {
        console.log( "Handling Leaving Group ..." );

        try {
            if ( !group?.chatId || !uid ) return;

            const groupRef = doc( db, 'chats', group.chatId );

            // 🧨 1. Update Firestore: remove user from group members
            await updateDoc( groupRef, {
                members: arrayRemove( uid )
            } );
            if(group.adminId === uid && members.length > 1){
                await updateDoc( groupRef, {
                    adminId: members[ 0 ].id
                } );
            }
            navigation.navigate( Routes.CHATS );

            // 🧹 2. Update Redux
            dispatch( removeGroup( chatId ) ); // remove from group list
            dispatch( resetGroupMembers() );        // clear cached members

            // 🚪 3. Navigate to main chats screen
            // navigation.reset( {
            //     index: 0,
            //     routes: [ { name: Routes.CHATS } ],
            // } );
        } catch ( error ) {
            console.error( '❌ Leave Group failed:', error );
        }
    };
    const medialength = useSelector(
        ( state: RootState ) => state.messages.mediaByChat[ chatId ]?.length || 0
    );
    return (
        <>
            
            <View style={ { flex: 1 } }>
                <CustomFancyHeader
                    leftIcon={
                        <svgImages.ArrowLeftIcon />
                    }
                    onLeftPress={ () => navigation.goBack() }
                    leftStyle={ { opacity: 0.6 } }
                    centerTitle={strings.profile}
                />
                {/* Container */}
                <View style={ styles.container }>
                    
                    {/* Group Info */}
                    <View>

                        {/* Group Image */}
                        <View style={ styles.groupImageWrapper }>
                            <TouchableOpacity>
                                { group?.imageURL ? <Image source={ { uri: group.imageURL } } style={ styles.avatarCircle } /> : <Image source={ require( '../../assets/pngs/GroupProfile.png' ) } style={ styles.avatarCircle } /> }
                            </TouchableOpacity>
                            { group?.adminId === uid &&
                            <TouchableOpacity style={ styles.editIcon }
                                onPress={ handlePickGroupImage }
                            >
                                    <svgImages.EditPenSVG style={ styles.editIcon } />
                            </TouchableOpacity> }

                        </View>

                        {/* Group name */}
                        <Text style={ styles.name }>{ group?.groupName }</Text>

                        {/* Group Members Length */}
                        <View style={ styles.row }>
                            <Text style={styles.membersLength}>{ `${ members?.length < 10 ? 0 : '' }${ members?.length } ${ strings.members }` }</Text>

                        </View>

                        {/* Button */}
                        <GroupMembersButton
                            memberImages={ [
                                membersImages[ 2 ],
                                membersImages[ 0 ],
                                membersImages[ 1 ]
                            ] }
                            onPress={ () => { group?.adminId === uid ? navigation.navigate( Routes.EDIT_GROUP, { chatId } ) : navigation.navigate( Routes.GROUP_MEMBERS, { chatId } ) } }
                        />

                    </View>

                    <View style={ styles.border} />
                    {/* Options Container */}
                    <View style={styles.optionsContainer}>

                        {/* Option 1 */}
                        <TouchableOpacity style={ styles.optionContainer } onPress={ () => navigation.navigate( Routes.MEDIA, { chatId } ) }>
                            <View style={styles.option}>
                                <svgImages.GallerySmallIcon />
                                <Text style={ styles.optionText}>{ strings.media }</Text>
                            </View>
                            <View style={styles.mediaCount}>
                                <Text>{ `${ medialength < 10 ? 0 : '' }${ medialength }` }</Text>
                                <svgImages.ChevronRightIcon />
                            </View>
                        </TouchableOpacity>

                        {/* Option 2 */}
                        <TouchableOpacity style={ styles.optionContainer } onPress={ () => setShowLeaveModal( true ) }>
                            <View style={ styles.option}>
                                <svgImages.LeaveGroupRedIcon />
                                <Text style={ styles.leaveText }>{ strings.leaveGroup }</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                </View>

            </View>
            <ConfirmationModal
                visible={ showLeaveModal }
                onClose={ () => setShowLeaveModal( false ) }
                onConfirm={
                    handleLeaveGroup
                }
                type="leave"
            />
        </>
    );
}
export default GroupProfile;
const styles = StyleSheet.create( {
    container: { flex: 1, backgroundColor: Colors.lightBG, marginTop: hp(0.1) },
    name: { textAlign: 'center', fontWeight: 'bold', fontSize: wp(5.5), marginVertical: hp(1.5) },
    row: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: hp( 0.5 ), gap: wp( 10 ) },
    optionsContainer: { marginVertical: hp(2), marginHorizontal:wp(5) },
    optionContainer: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: hp( 1 ) },
    avatarCircle: {
        width: wp( 35 ),
        height: wp( 35 ),
        borderRadius: 100,
        // backgroundColor:'black'
    },
    groupImageWrapper: { justifyContent: 'center', alignSelf: 'center', margin: wp( 3 ), },
    editIcon: { position: 'absolute', right: 0, top: 0, width:wp(20), height:wp(20) },
    membersLength: { fontWeight: '400', fontSize: wp(4.5) },
    optionText: { fontFamily: 'Poppins-Bold', fontSize: wp( 3.8 ) },
    option: { flexDirection: 'row', gap: wp(4) },
    mediaCount: { flexDirection: 'row', gap: wp(2) },
    border: { borderTopWidth: hp(0.05), borderTopColor: Colors.textInputBorder, marginHorizontal: wp(5), marginVertical:hp(1) },
   leaveText: { fontFamily: 'Poppins-Bold', fontSize: wp( 3.8 ), color:Colors.errorText },
} );

