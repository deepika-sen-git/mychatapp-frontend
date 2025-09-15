import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Image,
    StyleSheet,
    StatusBar,
    Platform,
    SafeAreaView,
    ViewStyle,
    StyleProp,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import globalUse, { wp } from '../utils/globalUse';
import SvgImages from '../utils/svgImages';
import strings from '../utils/strings';
// import Colors from '../theme/colors';

const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 44;
const HEADER_HEIGHT = 60; // adjust as needed
// console.log( StatusBar.currentHeight );


interface Props {
    leftIcon?: React.ReactNode;
    onLeftPress?: () => void;
    leftTitle?: string;
    leftStyle?: StyleProp<ViewStyle>;
    centerTitle?: string;

    rightIcons?: React.ReactNode[];
    onRightPress?: ( index: number ) => void;

    showSearch?: boolean;
    searchValue?: string;
    onSearchChange?: ( text: string ) => void;
    onSearchClear?: () => void;

    showSubHeader?: boolean;
    subHeaderAvatar?: string;
    subHeaderTitle?: string;
    subHeaderSubtitle?: string;
    subHeaderRightIcon?: React.ReactNode;
    onSubHeaderRightPress?: () => void;
    onSubHeaderPress?: () => void;
}

const CustomFancyHeader: React.FC<Props> = ( {
    leftIcon,
    leftStyle,
    onLeftPress,
    leftTitle,
    centerTitle,
    rightIcons,
    onRightPress,
    showSearch,
    searchValue,
    onSearchChange,
    onSearchClear,
    showSubHeader,
    subHeaderAvatar,
    subHeaderTitle,
    subHeaderSubtitle,
    subHeaderRightIcon,
    onSubHeaderRightPress,
    onSubHeaderPress,
} ) => {
    const headerHeight = showSubHeader ? HEADER_HEIGHT + 50 : HEADER_HEIGHT;

    return (
        <SafeAreaView style={ styles.safeArea }>
            <View style={ styles.statusBarFill } />

            <View style={ [ styles.baseHeader, { height: headerHeight } ] }>
                <LinearGradient
                    colors={ [ '#FCA4A3', '#FCA4A3', '#FFFFFF' ] }
                    locations={ [ 0, 0.3, 1 ] }
                    start={ { x: 0.5, y: 0 } }
                    end={ { x: 0.5, y: 1 } }
                    style={ [ StyleSheet.absoluteFill ] }
                />

                <View style={ [ styles.roundedHeader, { height: headerHeight } ] }>
                    <LinearGradient
                        colors={ [ '#FCA4A3', '#FCA4A3', '#FFFFFF' ] }
                        locations={ [ 0, 0.3, 1 ] }
                        start={ { x: 0.5, y: 0 } }
                        end={ { x: 0.5, y: 1 } }
                        style={ [ StyleSheet.absoluteFill ] }
                    />

                    <View style={ styles.headerContent }>

                        {/* Search */ }
                        { showSearch ? (
                            <View style={ styles.searchRow }>
                                <TextInput
                                    style={ styles.searchInput }
                                    value={ searchValue }
                                    onChangeText={ onSearchChange }
                                    placeholder={ strings.search }
                                    placeholderTextColor="#999"
                                />
                                <TouchableOpacity onPress={ onSearchClear } style={ styles.crossBtn }>
                                    <SvgImages.CrossIconCircle />
                                </TouchableOpacity>
                            </View>
                        )

                            :
                            ( <>{/* Left */ }
                                <View style={ styles.left }>
                                    { leftIcon && (
                                        <TouchableOpacity onPress={ onLeftPress } style={ leftStyle }>{ leftIcon }</TouchableOpacity>
                                    ) }
                                    { leftTitle && <Text style={ styles.leftTitle }>{ leftTitle }</Text> }
                                </View>

                                {/* Center */ }
                                <View style={ styles.center }>
                                    { centerTitle && <Text style={ styles.centerTitle }>{ centerTitle }</Text> }
                                </View>

                                {/* Right */ }
                                <View style={ styles.right }>
                                    { rightIcons?.map( ( icon, index ) => (
                                        <TouchableOpacity key={ index } onPress={ () => onRightPress?.( index ) }>
                                            { icon }
                                        </TouchableOpacity>
                                    ) ) }
                                </View>
                            </> ) }

                    </View>
                    {/* Subheader */ }
                    { showSubHeader && (
                        <TouchableOpacity style={ styles.subHeader } onPress={ onSubHeaderPress }>
                            <View style={ styles.subHeaderRow }>
                                <View style={ { flexDirection: 'row', gap: 10 } }>

                                    {
                                        subHeaderAvatar === 'groupProfile' ? (
                                            <View style={ styles.avatar }>
                                                <SvgImages.GroupProfileSmall />
                                            </View>
                                        ) : subHeaderAvatar === 'userProfile' ? (
                                            <View style={ styles.avatar }>
                                                <SvgImages.EmptyProfileSmall />
                                            </View>
                                        ) : (
                                            <Image source={ { uri: subHeaderAvatar } } style={ styles.avatar } />
                                        )
                                    }

                                    <View style={ styles.subHeaderText }>
                                        <Text style={ styles.subHeaderTitle }>{ subHeaderTitle }</Text>
                                        <Text style={ styles.subHeaderSubtitle }>{ subHeaderSubtitle }</Text>
                                    </View>
                                </View>
                                { subHeaderRightIcon && (
                                    <TouchableOpacity onPress={ onSubHeaderRightPress } style={ { marginTop: 5 } }>
                                        { subHeaderRightIcon }
                                    </TouchableOpacity>
                                ) }
                            </View>
                        </TouchableOpacity>
                    ) }
                </View>
            </View>
        </SafeAreaView>
    );
};


export default CustomFancyHeader;
const styles = StyleSheet.create( {
    safeArea: {
        // backgroundColor: 'red',
        elevation: 5, // for Android shadow\ // if your CustomFancyHeader accepts style:
        zIndex: 20,
    },
    statusBarFill: {
        height: STATUS_BAR_HEIGHT,
        backgroundColor: '#FFA7A6',
        // backgroundColor: 'red',

    },
    baseHeader: {
        width: globalUse.WIDTH,
        backgroundColor: '#FFA7A6',  // fallback
        // overflow: 'hidden',
        // borderBottomWidth: 1,
        // borderBottomColor: 'black',
        // elevation: 10,
    },

    baseGradient: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.01,  // less opacity so it shows faded
    },
    roundedHeader: {
        height: HEADER_HEIGHT,
        width: globalUse.WIDTH,
        borderBottomRightRadius: 45,
        overflow: 'hidden',
        shadowColor: '#FFA7A6',
        shadowOffset: { width: 0, height: 3 },  // positive height pushes shadow down
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,

    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        flex: 1,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        fontFamily: 'Poppins-SemiBold'
    },
    rightIcons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    subHeaderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        // e.g., user avatar, name, more icon
    },
    gradientContainer: {
        paddingTop: 40, // space for status bar
        paddingHorizontal: 16,
        paddingBottom: 8,
        borderBottomRightRadius: 20, // rounded corner on bottom right
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 3 },
        // shadowOpacity: 0.2,
        // shadowRadius: 4,


    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

    },
    left: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    leftTitle: {
        marginLeft: 8,
        fontSize: 25,
        fontWeight: '600',
        color: '#000',
        fontFamily: 'Poppins-SemiBold'
    },
    center: {
        flex: 1,
        alignItems: 'center'
    },
    centerTitle: {
        fontSize: wp(5),
        fontWeight: '700',
        color: '#000',
        fontFamily: 'Poppins-SemiBold'
    },
    right: {
        flexDirection: 'row',
        margin: globalUse.HEIGHT * 0.01,
        justifyContent: 'flex-end',
    },
    searchRow: {
        flexDirection: 'row',
        alignItems: 'center',

        marginTop: 8,

    },
    searchInput: {

        paddingHorizontal: 12,
        borderRadius: 30,
        backgroundColor: '#fff',
        flex: 1,
        height: 43,
        fontSize: 16
    },
    crossBtn: {
        marginLeft: 8
    },

    subHeader: {
        paddingHorizontal: 10,
        // backgroundColor: 'red',
    },
    subHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        // marginTop: 15,
        borderTopColor: '#0000001A',
        borderTopWidth: 0.5,
        // backgroundColor: 'red',
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginTop: 5,
        marginLeft: 5,
    },
    subHeaderText: {
        marginLeft: 8
    },
    subHeaderTitle: {
        marginTop: 5,
        fontSize: 16,
        fontWeight: '600'
    },
    subHeaderSubtitle: {
        fontSize: 12,
        color: '#666'
    }
} );
