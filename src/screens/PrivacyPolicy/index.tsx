import React from 'react';
import { ScrollView } from 'react-native';
import CustomFancyHeader from '../../components/CustomHeader';
import Routes from '../../utils/Routes';
import { RootStackParamList } from '../../AppNavigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import privacyPolicyContent from '../../assets/docs/privacyPolicyContent';
import ContentRenderer from '../../components/ContentRenderer';
import svgImages from '../../utils/svgImages';
import Colors from '../../theme/colors';
import strings from '../../utils/strings';

type Props = NativeStackScreenProps<RootStackParamList, typeof Routes.PRIVACY_POLICY>;

const PrivacyPolicyScreen: React.FC<Props> = ( { navigation } ) => {
    return (
        <>
            <CustomFancyHeader
                leftIcon={ <svgImages.ArrowLeftIcon /> }
                onLeftPress={ () => navigation.goBack() }
                leftStyle={ { opacity: 0.6 } }
                centerTitle={ strings.privacyPolicy }
            />
            <ScrollView style={ { backgroundColor: Colors.lightBG } }>
                <ContentRenderer content={ privacyPolicyContent } />
            </ScrollView>
        </>
    );
};

export default PrivacyPolicyScreen;
