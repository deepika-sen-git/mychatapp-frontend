import axios from 'axios';
import type { Asset } from 'react-native-image-picker';
import { Image, Video } from 'react-native-compressor';

const CLOUDINARY_UPLOAD_PRESET = 'mychatapp_preset';
const CLOUDINARY_CLOUD_NAME = 'dogcssbb9';

export async function compressMedia( asset: Asset ): Promise<string> {
    try {
        if ( asset.type?.startsWith( 'image' ) ) {
            console.log( 'Compressing image:', asset.uri );
            const compressedUri = await Image.compress( asset.uri!, { compressionMethod: 'auto' } );
            return compressedUri;
        } else if ( asset.type?.startsWith( 'video' ) ) {
            console.log( 'Compressing video:', asset.uri );
            const compressedUri = await Video.compress( asset.uri!, { compressionMethod: 'auto' } );
            return compressedUri;
        } else {
            console.warn( 'Unknown asset type, using original URI' );
            return asset.uri!;
        }
    } catch ( err ) {
        console.error( '❌ Compression failed, using original URI:', err );
        return asset.uri!; // fallback
    }
}

export async function uploadMediaToCloudinary( media: Asset ): Promise<string | null> {
    try {
        const data = new FormData();
        data.append( 'file', {
            uri: media.uri,
            type: media.type,
            name: media.fileName || 'upload.jpg',
        } );
        data.append( 'upload_preset', CLOUDINARY_UPLOAD_PRESET );

        const res = await axios.post(
            `https://api.cloudinary.com/v1_1/${ CLOUDINARY_CLOUD_NAME }/upload`,
            data,
            { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        console.log( '✅ Cloudinary response:', res.data );
        return res.data.secure_url; // this is the URL you can store
    } catch ( err ) {
        console.error( '❌ Cloudinary upload error:', err );
        return null;
    }
}
