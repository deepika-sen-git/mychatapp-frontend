import React from 'react';
import { View, Text, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import CustomTextInput from '../../components/UI/CustomTextInput';
import styles from './styles';
import strings from '../../utils/strings';
import colors from '../../theme/colors';
import { hp } from '../../utils/globalUse';

type Props = {
    visible: boolean;
    onSave: () => void;
    onCancel: () => void;
    name: string;
    setName: ( val: string ) => void;
    phone: string;
    setPhone: ( val: string ) => void;
    email: string;
    setEmail: ( val: string ) => void;
    loading: boolean;
};

const EditProfileModal: React.FC<Props> = ( {
    visible,
    onSave,
    onCancel,
    name,
    setName,
    phone,
    setPhone,
    email,
    setEmail,
    loading
} ) => {
    return (
        <Modal visible={ visible } animationType="slide" transparent={ true }>
            <View style={ styles.modalOverlay }>
                <View style={ styles.modalCard }>
                    <View style={ styles.modalHandle } />
                    <Text style={ styles.modalTitle }>{ strings.editProfile }</Text>

                    <CustomTextInput
                        label={ strings.name }
                        value={ name }
                        onChangeText={ setName }
                        placeholderText="Enter your name"
                    />

                    <CustomTextInput
                        label={ strings.phone }
                        value={ phone }
                        onChangeText={ setPhone }
                        keyboardType='phone-pad'
                        placeholderText="10 digit phone number"
                    />

                    <CustomTextInput
                        label={ strings.email }
                        value={ email }
                        onChangeText={ setEmail }
                        keyboardType='email-address'
                        placeholderText="you@example.com"
                    />
                    { loading ? (
                        <View style={ { marginTop: hp( 2 ) ,alignItems: 'center' } }>
                            <ActivityIndicator size="small" color={ colors.primary } />
                        </View>
                    ) : (
                            <View style={ styles.modalButtons }>
                                <TouchableOpacity style={ styles.cancelButton } onPress={ onCancel }>
                                    <Text style={ styles.cancelText }>{ strings.cancel }</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={ styles.saveButton } onPress={ onSave } >
                                    <Text style={ styles.saveText }>{ strings.saveChanges }</Text>
                                </TouchableOpacity>
                            </View>
                    ) }

                   
                </View>
            </View>
        </Modal>
    );
};

export default EditProfileModal;
