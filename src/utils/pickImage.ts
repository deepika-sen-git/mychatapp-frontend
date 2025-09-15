import * as ImagePicker from 'react-native-image-picker';
import { requestGalleryPermission } from "./requestGalleryPermission";
import { uploadMediaToCloudinary } from "./uploadToCloudinary";

/**
 * Opens the image picker, uploads the selected image to Cloudinary,
 * and returns both the local image URI and uploaded Cloudinary URL.
 */
export const pickImage = async (): Promise<{ imageUri: string; uploadedUrl: string }> => {
    // Step 1: Request gallery permission
    const hasPermission = await requestGalleryPermission();
    if ( !hasPermission ) {
        // Permission denied: return empty strings
        return { imageUri: '', uploadedUrl: '' };
    }

    // Step 2: Launch the image picker inside a Promise
    return new Promise( ( resolve, reject ) => {
        ImagePicker.launchImageLibrary(
            { mediaType: 'photo' },  // Picker options
            async ( response ) => {
                if ( response.didCancel ) {
                    // User cancelled picking: return empty strings
                    resolve( { imageUri: '', uploadedUrl: '' } );
                    return;
                }

                if ( response.errorMessage ) {
                    // Picker error: log and reject the promise
                    console.error( 'Picker error:', response.errorMessage );
                    reject( new Error( response.errorMessage ) );
                    return;
                }

                if ( response.assets?.length ) {
                    // Step 3: Get local image URI
                    const picked = response.assets[ 0 ];
                    const imageUri = picked.uri ?? '';

                    try {
                        // Step 4: Upload image to Cloudinary
                        const uploadedUrl = await uploadMediaToCloudinary( picked );

                        // Step 5: Resolve promise with local URI and uploaded URL
                        resolve( {
                            imageUri,
                            uploadedUrl: uploadedUrl ?? ''  // fallback if upload failed
                        } );
                    } catch ( error ) {
                        // Upload failed: log and reject
                        console.error( 'Upload failed:', error );
                        reject( error );
                    }
                } else {
                    // No asset selected: return empty strings
                    resolve( { imageUri: '', uploadedUrl: '' } );
                }
            }
        );
    } );
};
