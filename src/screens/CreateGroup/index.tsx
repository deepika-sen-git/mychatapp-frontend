import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, Modal, SafeAreaView, TextInput, ActivityIndicator } from 'react-native';
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
import { pickImage } from '../../utils/pickImage';
import { createGroup } from '../../store/slices/groupSlice';
import strings from '../../utils/strings';
import { hp, wp } from '../../utils/globalUse';
import colors from '../../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, typeof Routes.CREATE_GROUP>;

const CreateGroupScreen: React.FC<Props> = ( { navigation } ) => {
    const [ selectedUsers, setSelectedUsers ] = useState<string[]>( [] );
    const [ modalVisible, setModalVisible ] = useState( false );
    const [ groupName, setGroupName ] = useState( '' );
    const { uid } = useSelector( ( state: RootState ) => state.user );

    const dispatch = useDispatch<AppDispatch>();
    const friends = useSelector( ( state: RootState ) => state.friends.items );
    const friendsStatus = useSelector( ( state: RootState ) => state.friends.status );
    const [ groupImage, setGroupImage ] = useState<{ local: string; remote: string }>( {
        local: '',
        remote: ''
    } );
        const [ loading, setLoading ] = React.useState( false );




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

    const removeUser = ( id: string ) => {
        setSelectedUsers( prev => prev.filter( uid => uid !== id ) );
    };



    const handlePickGroupImage = async () => {
        try {
            const { imageUri, uploadedUrl } = await pickImage();

            if ( imageUri && uploadedUrl ) {
                setGroupImage( { local: imageUri, remote: uploadedUrl } );
            }
        } catch ( error ) {
            console.error( 'Error picking/uploading image:', error );
        }
    };

    const handleCreateGroup = async () => {
        setLoading( true );  // Start loading
        try {
            const action = await dispatch( createGroup( {
                selectedUsers,
                currentUserId: uid,
                groupName,
                imageURL: groupImage.remote,
            } ) );

            if ( createGroup.fulfilled.match( action ) ) {
                // action.payload has the created group
                const group = action.payload;
                navigation.replace( Routes.CHAT, { chatId: group.chatId, type: 'group' } );
            } else {
                console.error( 'Failed to create group', action.error );
                // show error message if needed
            }
            setLoading( false );  // Stop loading
        } catch ( error ) {
            console.error( 'Error:', error );
        }
    };

    return (
        <>
            <View style={ { flex: 1 } }>
            {/* Header */ }
            <CustomFancyHeader
                leftIcon={
                    <svgImages.ArrowLeftIcon />
                }
                onLeftPress={ () => navigation.goBack() }
                leftStyle={ { opacity: 0.6 } }
                centerTitle={strings.createGroup}
                />
                {/* Container */}
                <View style={ styles.container } >
                    {/*1. Group Image */ }
                    
                <View style={ styles.groupImageWrapper }>
                    <TouchableOpacity>
                        { groupImage.local ? (
                            <Image
                                source={ { uri: groupImage.local } }
                                style={ styles.groupImage } // define width, height, borderRadius
                            />
                        ) : (
                                <Image source={ require( '../../assets/pngs/GroupProfile.png' ) } style={ styles.groupImage } />
                        ) }

                    </TouchableOpacity>
                    <TouchableOpacity style={ styles.editIcon } onPress={ handlePickGroupImage }>
                        <svgImages.EditPenSVG />
                    </TouchableOpacity>
                </View>

                {/*2. Group Name Only when Members Selected*/ }
                {
                    selectedUsers.length && <CustomTextInput
                        label={ strings.nameGroup }
                        placeholderText={ strings.enterGroupName }
                        value={ groupName }
                        onChangeText={ setGroupName }
                    />
                }
               

                {/*3. Add members Button*/ }
                <Text style={ styles.sectionTitle }>{strings.members}</Text>
                <TouchableOpacity
                    style={ styles.addMembersButton }
                    onPress={ () => setModalVisible( true ) }
                >
                    <svgImages.GreenPlusIcon />
                    <Text style={ styles.addMembersText }>{strings.addMembersToGroup}</Text>
                </TouchableOpacity>

                {/*4. Selected users */ }
                <FlatList
                    data={ friends.filter( u => selectedUsers.includes( u.id ) ) }
                    keyExtractor={ item => item.id }
                    renderItem={ ( { item } ) => (
                        <View style={ styles.selectedUserRow }>

                            <View style={ { flexDirection: 'row' } }>
                                { item.imageURL ?
                                    <Image source={ { uri: item.imageURL } } style={ styles.avatar } /> :
                                    <Image source={ require( '../../assets/pngs/EmptyProfile.png' ) } style={ styles.avatar } />
                                }

                                <View style={ { gap: 4 } }>
                                    <Text style={ { fontWeight: 'bold' } }>{ item.name }</Text>
                                    <Text style={ { fontSize: 11 } }>{ item.phone }</Text>
                                </View>
                            </View>
                            <TouchableOpacity onPress={ () => removeUser( item.id ) }>
                                <svgImages.RedXIcon />
                            </TouchableOpacity>
                        </View>
                    ) }
                />
                    { loading ? (
                        <View style={ { marginTop: hp( 25 ), alignItems: 'center' } }>
                            <ActivityIndicator size="large" color={ colors.primary } />
                        </View>
                    ) : (
              
                        < CustomButton
                    title={ strings.createGroup }
                    disabled={ selectedUsers.length === 0 || !groupName }
                    style={ { opacity: ( selectedUsers.length === 0 || groupName.length === 0 ) ? 0.1 : 1, position: 'absolute', top: hp( 75 ), margin: wp( 5 ) } }
                    onPress={ () => handleCreateGroup() }
                />
                    ) }
              
         
                </View>
            </View>

            {/* Modal */ }
            <Modal visible={ modalVisible } animationType="slide" transparent={ true }>
                { friendsStatus === 'loading' && <Text>Loading friends...</Text> }
                { friendsStatus === 'failed' && <Text>Failed to load friends</Text> }
                <SafeAreaView style={ styles.modalContent }>
                    {/* handle */ }
                    <View style={ styles.modalHandle } />

                    <Text style={ styles.modalTitle }>{strings.addMembersToGroup}</Text>

                    {/* Search */ }
                    <TextInput placeholder={strings.search} style={ { borderColor: Colors.textInputBorder, borderWidth: 1, marginHorizontal: 20, borderRadius: 10 } } />

                    {/* Users list */ }
                    <FlatList
                        data={ friends }
                        keyExtractor={ item => item.id }
                        renderItem={ ( { item } ) => {
                            const isSelected = selectedUsers.includes( item.id );
                            return (
                                <TouchableOpacity style={ styles.userRow } onPress={ () => toggleUser( item.id ) }>

                                    { item.imageURL ?
                                        <Image source={ { uri: item.imageURL } } style={ styles.avatar } /> :
                                        <Image source={ require('../../assets/pngs/EmptyProfile.png') } style={ styles.avatar } />
                                    }
                                    <View style={ styles.userInfo }>
                                        <Text style={ { fontWeight: 'bold' } }>{ item.name }</Text>
                                        <Text>{ item.phone }</Text>
                                    </View>
                                    { isSelected ? <svgImages.CheckBoxIcon /> : <svgImages.UncheckBoxIcon /> }
                                </TouchableOpacity>
                            );
                        } }
                    />

                    {/* Buttons */ }
                    <View style={ styles.modalButtonRow }>
                        <TouchableOpacity
                            style={
                                styles.modalButton }

                            onPress={ () => setModalVisible( false ) }
                        >
                            <Text style={ [styles.addText, styles.cancelText]}>{strings.cancel}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={ [
                                styles.modalButtonAdd,
                                selectedUsers.length === 0 && { opacity: 0.1 }
                            ] }
                            disabled={ selectedUsers.length === 0 }
                            onPress={ () => {
                                setModalVisible( false )
                                console.log( " Selected Users", selectedUsers );
                            } }
                        >
                            <Text style={ styles.addText}>{ strings.add }</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </Modal>
        </>
            
    );
};

export default CreateGroupScreen;
