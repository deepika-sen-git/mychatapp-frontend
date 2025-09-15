import { Asset } from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';

export async function compressImage( asset: Asset ): Promise<Asset> {
    console.log(asset, "asset ");
    console.log( 'ImageResizer:', ImageResizer ); // Should not be null or undefined
    const cleanUri = asset.uri!.replace( 'file://', '' );
    console.log( asset.uri! );
    console.log(cleanUri);
    
    if ( !ImageResizer || !ImageResizer.createResizedImage ) {
        throw new Error( 'ImageResizer module not loaded' );
    }
    const resizedImage = await ImageResizer.createResizedImage(
        cleanUri,
        800,        // new width
        800,        // new height (maintains aspect ratio)
        'JPEG',
        70          // compression quality (0-100)
    );

    return {
        ...asset,
        uri: resizedImage.uri,
        fileName: resizedImage.name || asset.fileName,
        type: 'image/jpeg',
    };
}
