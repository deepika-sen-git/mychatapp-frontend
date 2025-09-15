import { launchCamera, ImagePickerResponse, Asset } from 'react-native-image-picker';

export const pickCameraImageOrVideo = async ( mediaType: 'photo' | 'video' ): Promise<Asset | null> => {

    try {
        let res: ImagePickerResponse;

        if ( mediaType === 'photo' ) {
            res = await pickPhoto();
        } else {
            res = await pickVideo();
        }

        console.log( 'Camera response:', res );

        if ( res.didCancel ) {
            console.log( 'User cancelled camera' );
            return null;
        }

        if ( res.errorCode ) {
            console.warn( 'Camera Error:', res.errorMessage );
            return null;
        }

        return res.assets?.[ 0 ] ?? null;

    } catch ( error ) {
        console.error( 'pickCameraImageOrVideo error:', error );
        return null;
    }
};

// Private helper to capture photo
const pickPhoto = () => {
    return launchCamera( {
        mediaType: 'photo',
        quality: 0.8,
        cameraType: 'back',
        saveToPhotos: true,
    } );
};

// Private helper to capture video
const pickVideo = () => {
    return launchCamera( {
        mediaType: 'video',
        videoQuality: 'high',
        durationLimit: 30,
        cameraType: 'back',
        saveToPhotos: true,
    } );
};
