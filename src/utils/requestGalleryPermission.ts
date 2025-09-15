import { PermissionsAndroid, Platform } from "react-native";

export const requestGalleryPermission = async (): Promise<boolean> => {
    if ( Platform.OS === 'android' ) {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES ?? PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
};