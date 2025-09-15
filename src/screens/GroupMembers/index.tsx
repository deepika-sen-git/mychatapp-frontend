// src/screens/GroupMembersScreen.tsx
import React from 'react';
import { View, Text, FlatList, Image } from 'react-native';
import CustomFancyHeader from '../../components/CustomHeader';
import svgImages from '../../utils/svgImages';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../AppNavigator';
import Routes from '../../utils/Routes';
import styles from './styles';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import Colors from '../../theme/colors';
import strings from '../../utils/strings';


type Props = NativeStackScreenProps<RootStackParamList, typeof Routes.GROUP_MEMBERS>;

const GroupMembersScreen: React.FC<Props> = ( { navigation, route } ) => {

    const { chatId } = route.params;
    const members = useSelector(
        ( state: RootState ) => state.groupMembers.membersByGroup[ chatId ] || []
    );
    return (
        <View style={ { flex: 1 } }>
            <CustomFancyHeader
                leftIcon={
                    <svgImages.ArrowLeftIcon />
                }
                onLeftPress={ () => navigation.goBack() }
                leftStyle={ { opacity: 0.6 } }
                centerTitle={ strings.groupMembers }
            />
            <View style={ { flex: 1, backgroundColor: Colors.lightBG, marginTop: 2 } }>
                <Text style={ styles.label }>{ strings.members }</Text>
                <FlatList
                    data={ members }
                    keyExtractor={ item => item.id }
                    renderItem={ ( { item } ) => (
                        <View style={ styles.row }>
                            <Image source={ item.imageURL ? { uri: item.imageURL } : require( '../../assets/pngs/EmptyProfile.png' ) } style={ styles.avatar } />
                            <View>
                                <Text style={ styles.name }>{ item.name }</Text>
                                <Text style={ styles.phone }>{ item.phone }</Text>
                            </View>
                        </View>
                    ) }
                />
            </View>
        </View>
    );
}
export default GroupMembersScreen;

