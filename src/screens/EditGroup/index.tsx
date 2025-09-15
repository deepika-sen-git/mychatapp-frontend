import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, TextInput } from 'react-native';
import svgImages from '../../utils/svgImages'; // your svg icons
import CustomTextInput from '../../components/UI/CustomTextInput';
import CustomButton from '../../components/UI/CustomButton';
import styles from './styles'; // add styles as needed
import CustomFancyHeader from '../../components/CustomHeader';
import { RootStackParamList } from '../../AppNavigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Routes from '../../utils/Routes';
import Colors from '../../theme/colors';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchFriends } from '../../store/slices/friendsSlice';
import ConfirmationModal from '../../components/UI/ConfirmationModal';
import { addGroupMembers, setGroupMembers } from '../../store/slices/groupMembersSlice';
import { changeGroupName, removeMemberFromGroup } from '../../api/groups';
import globalUse from '../../utils/globalUse';
import Modal from 'react-native-modal';
import strings from '../../utils/strings';


type Props = NativeStackScreenProps<RootStackParamList, typeof Routes.EDIT_GROUP>;

const EditGroupScreen: React.FC<Props> = ( { navigation, route } ) => {
    const [ selectedUsers, setSelectedUsers ] = useState<string[]>( [] );
    const [ modalVisible, setModalVisible ] = useState( false );
    const [ showRemoveModal, setShowRemoveModal ] = useState( false );
    const [ selectedMemberId, setSelectedMemberId ] = useState<string | null>( null );
    const { uid } = useSelector( ( state: RootState ) => state.user );

    const dispatch = useDispatch<AppDispatch>();
    const friendsStatus = useSelector( ( state: RootState ) => state.friends.status );
    const { chatId } = route.params;
    const members = useSelector(
        ( state: RootState ) => state.groupMembers.membersByGroup[ chatId ] || []
    );
    // console.log( "members ", members );

    const friends = useSelector( ( state: RootState ) => state.friends.items );
    // console.log( "friends ", friends );

    const group = useSelector( ( state: RootState ) =>
        state.groups.items.find( f => f.chatId === chatId )
    );
    const memberIds = members.map( member => member.id );

    const nonMemberFriends = friends.filter( friend => !memberIds.includes( friend.id ) );

    console.log( "Friends not in members:", nonMemberFriends.map( nonMemberFriend => nonMemberFriend.name ) );

    const [ groupName, setGroupName ] = useState( group?.groupName ?? '' );



    useEffect( () => {
        if ( friendsStatus === 'idle' && uid ) {
            dispatch( fetchFriends( uid ) );
        }
    }, [ friendsStatus, uid, dispatch ] );



    const toggleUser = ( id: string ) => {
        setSelectedUsers( prev =>
            prev.includes( id ) ? prev.filter( uid => uid !== id ) : [ ...prev, id ]
        );
    };
    const handleRemoveFromGroup = async () => {
        if ( !selectedMemberId ) return;

        const newMembers = members.filter( member => member.id !== selectedMemberId );
        setShowRemoveModal( false );
        await dispatch( setGroupMembers( { chatId, members: newMembers } ) );
        await removeMemberFromGroup( chatId, selectedMemberId! );

        setSelectedMemberId( null );
    };
    const handleAddToGroup = async () => {

        if ( selectedUsers.length <= 0 ) return;
        setModalVisible( false );
        await dispatch( addGroupMembers( { chatId, memberIds: selectedUsers } ) );
        setSelectedUsers( [] );
    };

    const handleChangeGroupName = async () => {

        if ( groupName === group?.groupName ) return;
        navigation.navigate( Routes.GROUP_PROFILE, { chatId } );
        await changeGroupName( chatId, groupName );
    };

    return (
        <>
            <View style={ { backgroundColor: Colors.lightBG } }>
                {/* Header */ }
                <CustomFancyHeader
                    leftIcon={
                        <svgImages.ArrowLeftIcon />
                    }
                    onLeftPress={ () => navigation.goBack() }
                    leftStyle={ { opacity: 0.6 } }
                    centerTitle={strings.editGroup}
                />
                <View style={ styles.container } >


                    {/* Group Name */ }
                    <CustomTextInput
                        label={ strings.nameGroup }
                        placeholderText={ strings.enterGroupName }
                        value={ groupName }
                        onChangeText={ setGroupName }
                    />

                    {/* Add members */ }
                    <Text style={ styles.sectionTitle }>{ strings.members }</Text>
                    <TouchableOpacity
                        style={ styles.addMembersButton }
                        onPress={ () => setModalVisible( true ) }
                    >
                        <svgImages.GreenPlusIcon />
                        <Text style={ styles.addMembersText }>{ strings.addMembersToGroup }</Text>
                    </TouchableOpacity>

                    <View style={ { maxHeight: globalUse.HEIGHT * 0.5, padding: 0 } }>
                        <FlatList
                            data={ members.filter( u => u.id != uid ) }
                            keyExtractor={ item => item.id }
                            showsVerticalScrollIndicator={ true }
                            renderItem={ ( { item } ) => (
                                <View style={ styles.selectedUserRow }>

                                    <View style={ { flexDirection: 'row' } }>
                                        { item.imageURL ?
                                            <Image source={ { uri: item.imageURL } } style={ styles.avatar } /> :
                                            <TouchableOpacity style={ styles.avatar } >

                                                <svgImages.EmptyProfileSmall height={ 43 } width={ 43 } />
                                            </TouchableOpacity>
                                        }

                                        <View style={ { gap: 4 } }>
                                            <Text style={ { fontWeight: 'bold' } }>{ item.name }</Text>
                                            <Text style={ { fontSize: 11 } }>{ item.phone }</Text>
                                        </View>
                                    </View>
                                    <TouchableOpacity onPress={ () => {
                                        setShowRemoveModal( true );
                                        setSelectedMemberId( item.id );
                                    } }>
                                        <svgImages.RedXIcon />
                                    </TouchableOpacity>
                                </View>
                            ) }
                        />
                    </View>


                    {/* Create Group button */ }
                    <CustomButton
                        title={ strings.continue }
                        disabled={ groupName === group?.groupName }
                        style={ { opacity: ( groupName !== group?.groupName ) ? 1 : 0.1, marginBottom: 20, position: 'absolute', bottom: 40, left: 20, right: 20, } }
                        onPress={ () => handleChangeGroupName() }
                    />
                </View>
                {/* Modal */ }
                <Modal
                    isVisible={ modalVisible }
                    backdropOpacity={ 0 }
                    onBackdropPress={ () => setModalVisible( false ) }
                    onSwipeComplete={ () => setModalVisible( false ) }
                    swipeDirection="down"
                    style={ { justifyContent: 'flex-end', margin: 0 } }
                >
                    <View style={ styles.modalContent }>
                        <View style={ styles.modalHandle } />
                        <Text style={ styles.modalTitle }>{ strings.addMembersToGroup }</Text>

                        <TextInput
                            placeholder={ strings.search }
                            style={ {
                                borderColor: Colors.textInputBorder,
                                borderWidth: 1,
                                marginHorizontal: 20,
                                borderRadius: 10,
                                marginBottom: 10,
                            } }
                        />

                        <FlatList
                            data={ nonMemberFriends }
                            keyExtractor={ ( item ) => item.id }
                            style={ { height: globalUse.HEIGHT * 0.64 } }
                            renderItem={ ( { item } ) => {
                                const isSelected = selectedUsers.includes( item.id );
                                return (
                                    <TouchableOpacity
                                        style={ styles.userRow }
                                        onPress={ () => toggleUser( item.id ) }
                                    >
                                        { item.imageURL ? (
                                            <Image source={ { uri: item.imageURL } } style={ styles.avatar } />
                                        ) : (
                                            <TouchableOpacity style={ styles.avatar }>
                                                <svgImages.EmptyProfileSmall height={ 43 } width={ 43 } />
                                            </TouchableOpacity>
                                        ) }
                                        <View style={ styles.userInfo }>
                                            <Text style={ { fontWeight: 'bold' } }>{ item.name }</Text>
                                            <Text>{ item.phone }</Text>
                                        </View>
                                        { isSelected ? (
                                            <svgImages.CheckBoxIcon />
                                        ) : (
                                            <svgImages.UncheckBoxIcon />
                                        ) }
                                    </TouchableOpacity>
                                );
                            } }
                        />

                        <View style={ styles.modalButtonRow }>
                            <TouchableOpacity
                                style={ styles.modalButton }
                                onPress={ () => {
                                    setModalVisible( false );
                                    setSelectedUsers( [] );
                                } }
                            >
                                <Text style={ { color: Colors.primary, fontWeight: '500', fontSize: 16 } }>{ strings.cancel }</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={ [
                                    styles.modalButtonAdd,
                                    selectedUsers.length === 0 && { opacity: 0.1 },
                                ] }
                                disabled={ selectedUsers.length === 0 }
                                onPress={ () => {
                                    setModalVisible( false );
                                    console.log( 'Selected Users', selectedUsers );
                                    handleAddToGroup();
                                } }
                            >
                                <Text style={ { color: '#fff', fontWeight: '500', fontSize: 16 } }>{ strings.add }</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

            </View>
            <ConfirmationModal
                visible={ showRemoveModal }
                onClose={ () => setShowRemoveModal( false ) }
                onConfirm={ () =>
                    handleRemoveFromGroup()
                }
                type="remove"
            />
        </>
    );
};

export default EditGroupScreen;
