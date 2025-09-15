import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Colors from '../../theme/colors';
import Routes from '../../utils/Routes';
import { RootStackParamList } from '../../AppNavigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import globalUse from '../../utils/globalUse';
import strings from '../../utils/strings';

type Props = NativeStackScreenProps<RootStackParamList, typeof Routes.PROFILE_EDIT_SUCCESS>;

const ProfileEditSuccess: React.FC<Props> = ( { navigation } ) => {

    useEffect( () => {
        const timer = setTimeout( () => {
            navigation.navigate( Routes.PROFILE );  // or navigation.goBack() if you just want to go back
        }, 1000 ); // 2 seconds

        return () => clearTimeout( timer ); // cleanup
    }, [ navigation ] );

    return (
        <>
            <View style={ { backgroundColor: Colors.lightBG, width: globalUse.WIDTH, height: 1, elevation: 10, zIndex: 20 } } />

            <View style={ { flex: 1, width: globalUse.WIDTH, height: globalUse.HEIGHT, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' } }>
                <Text style={ { fontSize: 25, fontWeight: 'bold', marginTop: globalUse.HEIGHT * 0.4, fontFamily: 'Poppins-SemiBold' } }>{ strings.changesSaved }</Text>
            </View>
        </>
    );
};

export default ProfileEditSuccess;
