import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import CustomFancyHeader from '../../components/CustomHeader';
import svgImages from '../../utils/svgImages';
import { RootStackParamList } from '../../AppNavigator';
import Routes from '../../utils/Routes';
import styles from './styles';
import Colors from '../../theme/colors';
// import { getChatMediaAttachments } from '../../api/messages';
import Video from 'react-native-video';
import { Timestamp } from 'firebase/firestore';
import { Asset } from 'react-native-image-picker';
import { AppDispatch, RootState } from '../../store';
import { useDispatch, useSelector } from 'react-redux';
import { listenToMessages } from '../../store/slices/messagesSlice';
import strings from '../../utils/strings';
import globalUse from '../../utils/globalUse';
import ImageZoom from 'react-native-image-pan-zoom';

type Props = NativeStackScreenProps<RootStackParamList, typeof Routes.MEDIA>;

const MediaScreen: React.FC<Props> = ( { navigation, route } ) => {
    const { chatId } = route.params;
    const [ mediaData, setMediaData ] = useState<{ id: string; uri: string; type: string; date: string, createdAt: Timestamp }[]>( [] );
    const [ previewAsset, setPreviewAsset ] = useState<Asset | { uri: string; type?: string } | null>( null );
    const media = useSelector(
        ( state: RootState ) => state.messages.mediaByChat[ chatId ] || []
    );

    const dispatch = useDispatch<AppDispatch>();

    useEffect( () => {
        if ( media.length > 0 ) {
            const sorted = [ ...media ].sort( ( a, b ) => {
                const dateA = new Date( a.createdAt.toDate() ).getTime();
                const dateB = new Date( b.createdAt.toDate() ).getTime();
                return dateB - dateA;
            } );
            setMediaData( sorted );
        }
    }, [ media ] );
    useEffect( () => {
        dispatch( listenToMessages( chatId ) );

    }, [ chatId, dispatch ] );


    const groupedData = mediaData.reduce( ( acc, item ) => {
        acc[ item.date ] = acc[ item.date ] || [];
        acc[ item.date ].push( item );
        return acc;
    }, {} as Record<string, typeof mediaData> );

    return (
        <View style={ { flex: 1 } }>
            <CustomFancyHeader
                leftIcon={ <svgImages.ArrowLeftIcon /> }
                onLeftPress={ () => navigation.goBack() }
                centerTitle={ strings.media }
            />
            <ScrollView style={ { flex: 1, backgroundColor: Colors.lightBG, marginTop: 2, padding: 10 } }>
                <View style={ { borderBottomColor: Colors.primary, borderBottomWidth: 3, padding: 5, width: 55 } }>
                    <Text style={ { color: Colors.primary, fontSize: 16, fontWeight: 'bold' } }>{ strings.media }</Text>
                </View>
                { mediaData.length === 0 && <Text style={{textAlign:'center'}}>No Media Found</Text>}
                { Object.keys( groupedData ).map( date => (
                    <View key={ date }>
                        <Text style={ styles.sectionTitle }>{ date }</Text>
                        <FlatList
                            data={ groupedData[ date ] }
                            numColumns={ 4 } // 💥 4 items per row
                            scrollEnabled={ false }
                            keyExtractor={ item => item.id }
                            renderItem={ ( { item } ) => (
                                item.type === 'video' ?
                                    <TouchableOpacity onPress={ () => setPreviewAsset( { uri: item.uri, type: item.type === 'video' ? 'video/mp4' : 'image/*' } ) } >
                                        {/* <Video source={ { uri: item.uri } } style={ styles.mediaItem } /> */ }
                                        <Image source={ { uri: item.uri.replace( '/upload/', '/upload/so_2/' ).replace( '.mp4', '.jpg' ) } } style={ styles.mediaItem } />
                                        <View style={ styles.previewVideo }>
                                            <svgImages.VideoPlayIcon width={ 32 } height={ 32 } />
                                        </View>
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity onPress={ () => setPreviewAsset( { uri: item.uri, type: item.type === 'video' ? 'video/mp4' : 'image/*' } ) }>
                                        <Image source={ { uri: item.uri } } style={ styles.mediaItem } />
                                    </TouchableOpacity>

                            ) }
                        />
                    </View>
                ) ) }

            </ScrollView>
            {/* Preview modal */ }
            <Modal visible={ !!previewAsset } animationType="fade" >
                <View style={ styles.previewModal }>
                    <TouchableOpacity onPress={ () => setPreviewAsset( null ) } style={ styles.crossIcon }>
                        <svgImages.CrossIcon width={ 40 } height={ 40 } />
                    </TouchableOpacity>
                    { previewAsset?.type?.startsWith( 'video' ) ? (
                        <Video source={ { uri: previewAsset.uri } } style={ styles.previewAsset } controls resizeMode="contain" />
                    ) : (
                            <ImageZoom
                                cropWidth={ globalUse.WIDTH }
                                cropHeight={ globalUse.HEIGHT }
                                imageWidth={ globalUse.WIDTH }
                                imageHeight={ globalUse.HEIGHT * 0.8 }
                            >
                                <Image
                                    source={ { uri: previewAsset?.uri } }
                                    style={ { width: globalUse.WIDTH, height: globalUse.HEIGHT * 0.8, resizeMode: 'contain' } }
                                />
                            </ImageZoom> ) }
                </View>
            </Modal>
        </View>
    );
};

export default MediaScreen;
