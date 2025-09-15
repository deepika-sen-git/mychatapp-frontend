import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../AppNavigator';
import HeaderLeftWithTitle from '../../../components/HeaderLeftWithTitle';
import CustomButton from '../../../components/UI/CustomButton';
import Routes from '../../../utils/Routes';
import createCommonStyles from '../../../utils/commonstyles';
import colors from '../../../theme/colors';
import globalUse, { hp } from '../../../utils/globalUse';
import { useStatusBarColor } from '../../../context';
import { useFocusEffect } from '@react-navigation/native';
import Colors from '../../../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, typeof Routes.PASSWORD_CHANGED>;

const PasswordChangedScreen: React.FC<Props> = ( { navigation } ) => {
    const commonstyles = createCommonStyles( colors );
    const { setColor } = useStatusBarColor();
        
            useFocusEffect(
                React.useCallback( () => {
                    setColor( Colors.lightBG );  
                }, [] )
            );

    return (
        <SafeAreaView style={ commonstyles.container }>
            <View style={ commonstyles.mainView }>
                <HeaderLeftWithTitle title="Password changed" crossIcon onPress={ () => navigation.navigate( Routes.LOGIN ) } />

                <Text style={ [ commonstyles.subHeading, { marginTop: 13 } ] }>
                    You have successfully changed your password, please use the new password when Sign in.
                </Text>

                <CustomButton
                    title="Log in"
                    onPress={ () => navigation.navigate( Routes.LOGIN ) }
                    style={ { position:'absolute', bottom:hp(5) } }
                />
            </View>
        </SafeAreaView>
    );
};


export default PasswordChangedScreen;
