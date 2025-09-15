import { Dimensions, Platform } from 'react-native';

export const wp = ( percent: number ) => globalUse.WIDTH * ( percent / 100 );
export const hp = ( percent: number ) => globalUse.HEIGHT * ( percent / 100 );

const globalUse = {
    WIDTH: Dimensions.get( 'window' ).width,
    HEIGHT: Dimensions.get( 'window' ).height,
    IOS: Platform.OS === 'ios',
};


export default globalUse;