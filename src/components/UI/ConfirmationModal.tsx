import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import globalUse, { hp, wp } from '../../utils/globalUse';
import Colors from '../../theme/colors';
import svgImages from '../../utils/svgImages';
import strings from '../../utils/strings';
import DeleteIconSVG from '../../assets/svgs/Delete.svg';
import LogoutIconSVG from '../../assets/svgs/LogOut.svg'
import LeaveGroupIconSVG from '../../assets/svgs/LeaveGroup.svg'

type ModalType = 'delete' | 'logout' | 'leave' | 'remove';

type Props = {
    visible: boolean;
    onClose: () => void;
    onConfirm: () => void;
    type: ModalType;
};

const ConfirmationModal: React.FC<Props> = ( { visible, onClose, onConfirm, type } ) => {
    const renderIcon = () => {
        if ( type === 'delete' ) return <DeleteIconSVG width={ globalUse.HEIGHT > 700 ? wp( 40 ) : wp( 30 ) } height={ globalUse.HEIGHT > 700 ? wp( 40 ) : wp( 30 )  } />;
        if ( type === 'logout' ) return <LogoutIconSVG width={ globalUse.HEIGHT > 700 ? wp( 40 ) : wp( 30 ) } height={ globalUse.HEIGHT > 700 ? wp( 40 ) : wp( 30 ) } />;
        if ( type === 'leave' || 'remove' ) return <LeaveGroupIconSVG width={ globalUse.HEIGHT > 700 ? wp( 35 ) : wp( 30 ) } height={ globalUse.HEIGHT > 700 ? wp( 35 ) : wp( 30 ) } />;
        return null;
    };

    const getConfirmText = () => {
        if ( type === 'delete' ) return `${ strings.yesDelete }`;
        if ( type === 'logout' ) return `${ strings.yesLogout }`;
        if ( type === 'leave' ) return `${ strings.yesLeave }`;
        if ( type === 'remove' ) return `${ strings.yesRemove }`;
        return '';
    };

    const getCancelText = () => {
        if ( type === 'delete' ) return `${ strings.noCancel }`;
        if ( type === 'logout' ) return `${ strings.noContinue }`;
        if ( type === 'leave' ) return `${ strings.noCancel }`;
        if ( type === 'remove' ) return `${ strings.noCancel }`;
        return '';
    };

    const getTitle = () => {
        if ( type === 'leave' ) return `${ strings.leaveGroupConfirmation }`;
        if ( type === 'delete' ) return `${ strings.deleteAccountConfirm }`;
        if ( type === 'logout' ) return `${ strings.logoutConfirm }`;
        if ( type === 'remove' ) return `${ strings.removeUserFromGroupConfirmation }`;
        return '';
    };

    return (
        <Modal
            visible={ visible }
            transparent={ true }
            animationType="fade"
            onRequestClose={ onClose }
        >
            <View style={ styles.overlay }>
                <View style={ styles.modalCard }>
                    <View style={ { marginBottom: 12 } }>
                        { renderIcon() }
                    </View>
                    <Text style={ styles.text }>{ getTitle() }</Text>
                    <View style={ styles.buttonRow }>
                        <TouchableOpacity
                            style={ [
                                styles.button,
                                type === 'logout' ? styles.greenBorder : styles.redBorder
                            ] }
                            onPress={ onConfirm }
                        >
                            <Text
                                style={ [
                                    styles.buttonText,
                                    type === 'logout' ? styles.greenText : styles.redText
                                ] }
                            >
                                { getConfirmText() }
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={ [ styles.button, styles.greenButton ] }
                            onPress={ onClose }
                        >
                            <Text style={ styles.whiteText }>{ getCancelText() }</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create( {
    overlay: {
        flex: 1,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalCard: {
        width: globalUse.WIDTH * 0.88,
        height: globalUse.HEIGHT * 0.4,
        backgroundColor: 'white',
        borderRadius: 16,
        padding: globalUse.WIDTH > 800 ? wp( 3 ) : wp( 5 ),
        alignItems: 'center',
        elevation: 8,
    },
    text: {
        textAlign: 'center',
        fontSize: wp( 4.5 ),
        marginBottom: globalUse.WIDTH > 800 ? hp( 4 ) : hp( 2 ),
        color: '#333',
        fontWeight: '500',
        fontFamily: 'Poppins-Medium'
    },
    buttonRow: {
        flexDirection: 'row',
        gap: wp( 5 ),
    },
    button: {
        flex: 1,
        paddingVertical: hp( 1.5 ),
        borderRadius: 8,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: hp( 6.7 )
    },
    redBorder: { borderColor: Colors.errorBorder },
    greenBorder: { borderColor: Colors.primary },
    redText: { color: Colors.errorText, fontFamily: 'Poppins-Medium', fontWeight: '500', fontSize: wp( 3.5 ) },
    greenText: { color: Colors.primary, fontFamily: 'Poppins-Medium', fontWeight: '500' },
    greenButton: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    whiteText: { color: 'white', fontFamily: 'Poppins-Medium', fontWeight: '500', fontSize: wp( 3.5 ) },
    buttonText: { fontSize: wp( 3.5 ) },
} );

export default ConfirmationModal;
