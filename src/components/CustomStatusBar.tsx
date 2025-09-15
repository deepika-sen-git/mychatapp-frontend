import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import Colors from '../theme/colors';

const CustomStatusbar: React.FC = () => {
    const isDarkMode = useColorScheme() === 'dark';
    const isLoggedIn = true;
    // const [ isLoggedIn, setIsLoggedIn ] = useState<boolean | null>( null );

    // useEffect( () => {
    //     const fetchStatus = async () => {
    //         const status = getIsLoggedInStatus();
    //         console.log( 'Fetched isLoggedIn status:', status );
    //         setIsLoggedIn( status === true ); // convert to boolean properly
    //     };
    //     fetchStatus();
    // }, [] );

    // if ( isLoggedIn === null ) {
    //     // Still loading; optionally return default or null
    //     return null;
    // }

    return (
        <StatusBar
            backgroundColor={ !isLoggedIn ? "transparent" : Colors.appHeader }
            barStyle={ isDarkMode ? 'light-content' : 'dark-content' }
            translucent={ false }
        />
    );
};

export default CustomStatusbar;
