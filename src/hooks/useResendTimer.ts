import { useState, useEffect } from 'react';

export default function useResendTimer( initialSeconds: number = 20 ) {
    const [ timer, setTimer ] = useState( initialSeconds );
    const [ isDisabled, setIsDisabled ] = useState( true );

    useEffect( () => {
        let interval: NodeJS.Timeout | undefined;

        if ( isDisabled && timer > 0 ) {
            interval = setInterval( () => {
                setTimer( ( prev ) => prev - 1 );
            }, 1000 );
        } else if ( timer === 0 ) {
            setIsDisabled( false );
        }

        return () => {
            if ( interval ) clearInterval( interval );
        };
    }, [ isDisabled, timer ] );

    const resend = () => {
        setTimer( initialSeconds );
        setIsDisabled( true );
    };

    return { timer, isDisabled, resend };
}
