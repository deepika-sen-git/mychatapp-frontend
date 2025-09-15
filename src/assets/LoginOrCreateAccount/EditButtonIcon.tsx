import * as React from "react"
import Svg, { SvgProps, Rect, Path } from "react-native-svg"
import { wp } from "../../utils/globalUse"
const SvgComponent = ( props: SvgProps ) => (
    <Svg
        width={ wp( 9 ) }
        height={ wp( 9 ) }
        fill="none"
        { ...props }
    >
        <Rect width={ wp( 9 ) } height={ wp( 9 ) } x={ 0.3 } y={ 0.5 } fill="#16C47F" rx={ wp( 4.5 ) } />
        <Path
            fill="#fff"
            d="m17.7 24.661 7.396-7.396a10.289 10.289 0 0 1-3.326-2.234 10.291 10.291 0 0 1-2.235-3.327L12.139 19.1c-.577.577-.866.866-1.114 1.184a6.555 6.555 0 0 0-.749 1.211c-.174.364-.303.752-.56 1.526l-1.362 4.083a1.06 1.06 0 0 0 1.342 1.342l4.083-1.362c.774-.258 1.162-.387 1.526-.56.43-.205.836-.456 1.211-.749.318-.248.607-.537 1.184-1.114ZM27.148 15.213a3.932 3.932 0 0 0-5.561-5.561l-.887.887a8.755 8.755 0 0 0 2.13 3.431 8.753 8.753 0 0 0 3.43 2.13l.888-.887Z"
        />
    </Svg>
)
export default SvgComponent
