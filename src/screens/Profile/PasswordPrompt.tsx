import React, { useState } from "react";
import { Modal, View, TextInput, Button, Text, StyleSheet } from "react-native";

const PasswordPrompt = ( { visible, onConfirm, onCancel }: any ) => {
    const [ password, setPassword ] = useState( "" );

    return (
        <Modal visible={ visible } transparent animationType="fade">
            <View style={ styles.overlay }>
                <View style={ styles.container }>
                    <Text style={ styles.title }>Re-enter Password</Text>
                    <TextInput
                        secureTextEntry
                        placeholder="Enter your password"
                        value={ password }
                        onChangeText={ setPassword }
                        style={ styles.input }
                    />
                    <Button title="Confirm" onPress={ () => onConfirm( password ) } />
                    <Button title="Cancel" onPress={ onCancel } />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create( {
    overlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    container: {
        width: "80%",
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
        elevation: 10,
    },
    title: { fontSize: 18, marginBottom: 10, fontWeight: "600" },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        marginBottom: 15,
        borderRadius: 6,
    },
} );

export default PasswordPrompt;
