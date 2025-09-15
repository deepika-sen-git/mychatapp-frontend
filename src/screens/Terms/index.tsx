import React from 'react';
import { ScrollView } from 'react-native';
import CustomFancyHeader from '../../components/CustomHeader';
import Routes from '../../utils/Routes';
import { RootStackParamList } from '../../AppNavigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import termsContent from '../../assets/docs/termsContent';
import ContentRenderer from '../../components/ContentRenderer';
import svgImages from '../../utils/svgImages';
import Colors from '../../theme/colors';
import strings from '../../utils/strings';
import { useStatusBarColor } from '../../context';
import { useFocusEffect } from '@react-navigation/native';

type Props = NativeStackScreenProps<RootStackParamList, typeof Routes.TERMS>;

const TermsScreen: React.FC<Props> = ( { navigation } ) => {
    const { setColor } = useStatusBarColor();
    useFocusEffect(
        React.useCallback( () => {
            setColor( Colors.appHeader );
        }, [] )
    );

    return (
        <>
            <CustomFancyHeader
                leftIcon={ <svgImages.ArrowLeftIcon /> }
                onLeftPress={ () => navigation.goBack() }
                leftStyle={ { opacity: 0.6 } }
                centerTitle={ strings.termsOfService }
            />
            <ScrollView style={ { backgroundColor: Colors.lightBG } }>
                <ContentRenderer content={ termsContent } />
            </ScrollView>
        </>
    );
};

export default TermsScreen;
