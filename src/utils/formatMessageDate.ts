import { format } from 'date-fns';
import strings from './strings';

export const formatMessageDate = ( date: Date ): string => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate( today.getDate() - 1 );

    const isSameDay = ( a: Date, b: Date ) =>
        a.getDate() === b.getDate() &&
        a.getMonth() === b.getMonth() &&
        a.getFullYear() === b.getFullYear();

    if ( isSameDay( date, today ) ) return `${strings.today}`;
    if ( isSameDay( date, yesterday ) ) return `${strings.yesterday}`;

    return format( date, 'MMM d, yyyy' ); // e.g., "Aug 3, 2025"
};
