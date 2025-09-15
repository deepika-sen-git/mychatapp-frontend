import React from 'react';
import { Text, View } from 'react-native';
import CustomFancyHeader from '../../components/CustomHeader';
import Routes from '../../utils/Routes';
import { RootStackParamList } from '../../AppNavigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import svgImages from '../../utils/svgImages';

import styles from './styles';
import Colors from '../../theme/colors';
import strings from '../../utils/strings';

type Props = NativeStackScreenProps<RootStackParamList, typeof Routes.CONTACT_SUPPORT>;

const ContactSupportScreen: React.FC<Props> = ( { navigation } ) => {
    return (
        <>
            <CustomFancyHeader
                leftIcon={ <svgImages.ArrowLeftIcon /> }
                onLeftPress={ () => navigation.goBack() }
                leftStyle={ { opacity: 0.6 } }
                centerTitle={strings.contactSupport}
            />
            <View style={ { flex: 1, padding: 20, backgroundColor: Colors.lightBG } }>
                <Text style={ { fontSize: 22, fontWeight: '600', marginBottom: 10 } }>{strings.reachUsAt}:</Text>
                <View style={ styles.infoRow }>
                    <View style={ { flexDirection: 'row' } }>
                        <Text style={ styles.label }>{strings.phone} :</Text>
                        <Text>(+44) 20 1234 5689</Text>
                    </View>

                    <svgImages.CopyIcon />
                </View>

                <View style={ styles.infoRow }>
                    <View style={ { flexDirection: 'row' } }>
                        <Text style={ styles.label }>{strings.email} :</Text>
                        <Text>john.lennon@mail.com</Text>
                    </View>
                    <svgImages.CopyIcon />
                </View>
            </View>
        </>
    );
};

export default ContactSupportScreen;
