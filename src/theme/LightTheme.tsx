import Colors from './colors';

interface Types {
  dark: boolean;
  colors: {
    background: string;
    primary: string;
    secondary: string;
    card: string;
    headingText: string;
    subHeadingText: string;
    border: string;
    notification: string;
    buttonBg: string;
    buttonTitle: string;
    placeholderColor: string;
    inputTextColor: string;
    inputBg: string;
    tabBorderColor: string;
    shadowColor:string;
    redColor: string;
    modalBackgroundColor: string;
    driveBtn: string;
    mapBtn: string;
    whiteBoxShadow: string;
    carpoolElipse?: string;
    notificationCard?: string;
    notificationRead?:string;
    disabledButton?:string;
  };
}
const LightTheme: Types = {
  dark: false,
  colors: {
    background: Colors.lightBG,
    primary: Colors.primary,
    secondary: Colors.secondary,
    card: Colors.cardBG,
    headingText: Colors.headingText,
    subHeadingText: Colors.subHeading,
    buttonBg: Colors.primary,
    buttonTitle: Colors.lightBG,
    border: Colors.borderColor,
    notification: '',
    placeholderColor: Colors.placeholderColor,
    inputTextColor: Colors.inputTextColor,
    inputBg: Colors.lightBG,
    tabBorderColor: Colors.tabBorderColor,
    shadowColor: Colors.shadowColor,
    redColor: Colors.redColor,
    modalBackgroundColor: Colors.modalBackgoundColor,
    driveBtn: Colors.driveBtn,
    mapBtn: Colors.mapBtn,
    whiteBoxShadow: Colors.whiteBoxShadow,
    carpoolElipse: Colors.carpoolElipse,
    notificationCard: Colors.notificationCard,
    notificationRead:Colors.notificationRead,
    disabledButton:Colors.disabledButton,
  },
};

export default LightTheme;
