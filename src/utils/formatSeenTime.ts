import { Timestamp } from "firebase/firestore";

export const formatSeenTime = ( seenAt?: Timestamp | Date | null ) => {
    if ( !seenAt ) return "";

    let dateObj: Date;
    if ( seenAt instanceof Timestamp ) {
        dateObj = seenAt.toDate();
    } else if ( seenAt instanceof Date ) {
        dateObj = seenAt;
    } else {
        return "";
    }

    const day = dateObj.getDate().toString().padStart( 2, '0' );
    const month = ( dateObj.getMonth() + 1 ).toString().padStart( 2, '0' );
    const year = dateObj.getFullYear();
    const hours = dateObj.getHours().toString().padStart( 2, '0' );
    const minutes = dateObj.getMinutes().toString().padStart( 2, '0' );

    return `${ day }/${ month }/${ year }    ${ hours }:${ minutes }`;
};
