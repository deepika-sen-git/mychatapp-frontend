import React, { createContext, useContext, useState } from 'react';
import Colors from '../theme/colors';

type StatusBarColorContextType = {
    color: string;
    setColor: ( color: string ) => void;
};

const StatusBarColorContext = createContext<StatusBarColorContextType>( {
    color: Colors.appHeader,
    setColor: () => { },
} );

export const StatusBarColorProvider: React.FC<{ children: React.ReactNode }> = ( { children } ) => {
    const [ color, setColor ] = useState( Colors.appHeader );

    return (
        <StatusBarColorContext.Provider value={ { color, setColor } }>
            { children }
        </StatusBarColorContext.Provider>
    );
};

export const useStatusBarColor = () => useContext( StatusBarColorContext );
