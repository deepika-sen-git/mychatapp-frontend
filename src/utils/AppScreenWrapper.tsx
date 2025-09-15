import React, { ReactNode } from 'react';
import {
    StyleSheet,
    ViewStyle,
    Keyboard,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hp } from './globalUse'; // your wp/hp utils

type Props = {
    children: ReactNode;
    contentStyle?: ViewStyle;
    bgColor?: string;
    scrollable?: boolean; // for screens that don't need scroll
};

const AppScreenWrapper = ( {
    children,
    contentStyle,
    bgColor = '#fff',
    scrollable = true,
}: Props ) => {
    const Container = scrollable ? KeyboardAwareScrollView : SafeAreaView;

    return (
        <SafeAreaView style={ [ styles.safeArea, { backgroundColor: bgColor } ] }>
            <TouchableWithoutFeedback onPress={ Keyboard.dismiss } accessible={ false }>
                <Container
                    style={ { flex: 1 } }
                    { ...( scrollable
                        ? {
                            contentContainerStyle: [ styles.scrollContent, contentStyle ],
                            enableOnAndroid: true,
                            extraScrollHeight: hp( 5 ),
                            keyboardShouldPersistTaps: 'handled',
                        }
                        : {} ) }
                >
                    <View style={ styles.main }>{ children }</View>
                </Container>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    );
};

export default AppScreenWrapper;

const styles = StyleSheet.create( {
    safeArea: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
    main: {
        flex: 1,
        justifyContent: 'space-between', // pushes footer down
        paddingHorizontal: 20,
        paddingBottom: hp( 2 ), // breathing space for button
    },
} );
