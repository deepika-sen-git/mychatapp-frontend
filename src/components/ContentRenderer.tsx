// src/components/ContentRenderer.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { wp } from '../utils/globalUse';
import Colors from '../theme/colors';
// import globalUse from '../utils/globalUse';

interface SubItem {
    title: string;
    subItems?: string[];
}

interface ContentItem {
    date?: string;
    heading?: string;
    paragraph?: string;
    list?: ( string | SubItem )[];
}

type Props = { content: ContentItem[] };

const ContentRenderer: React.FC<Props> = ( { content } ) => {

    return (
        <View style={ { padding: 16 } }>
            { content.map( ( item, index ) => (
                <View key={ index } style={ { marginBottom: 12 } }>
                    { item.date && (
                        <Text style={ { color: Colors.primary, fontWeight: 'bold', marginBottom: 4, fontFamily: 'Poppins-Regular' } }>
                            { item.date }
                        </Text>
                    ) }
                    { item.heading && (
                        <Text style={ { fontWeight: '300', fontSize: wp(3.5), marginBottom: 4, fontFamily: 'Poppins-SemiBold' } }>
                            { item.heading }
                        </Text>
                    ) }
                    { item.paragraph && (
                        <Text style={ { fontSize: wp(3), marginBottom: 4, color: '#333', fontFamily: 'Poppins-Regular' } }>
                            { item.paragraph }
                        </Text>
                    ) }
                    { item.list && item.list.map( ( listItem, idx ) => {
                        if ( typeof listItem === 'string' ) {
                            return (
                                <Text key={ idx } style={ { fontSize: wp( 3 ), marginLeft: 12, marginBottom: 2, fontFamily: 'Poppins-Regular' } }>
                                    • { listItem }
                                </Text>
                            );
                        } else {
                            return (
                                <View key={ idx } style={ { marginBottom: 2 } }>
                                    <Text style={ { fontSize: wp(3), marginLeft: 12, fontFamily: 'Poppins-Regular' } }>• { listItem.title }</Text>
                                    { listItem.subItems && listItem.subItems.map( ( sub, subIdx ) => (
                                        <Text
                                            key={ subIdx }
                                            style={ { fontSize: wp(3), marginLeft: 24, color: '#555', fontFamily: 'Poppins-Regular' } }
                                        >
                                            - { sub }
                                        </Text>
                                    ) ) }
                                </View>
                            );
                        }
                    } ) }
                </View>
            ) ) }
        </View>
    );
};

export default ContentRenderer;
