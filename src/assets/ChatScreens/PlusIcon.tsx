import * as React from "react"
import Svg, { SvgProps, Rect, Path } from "react-native-svg"
const SvgComponent = ( props: SvgProps ) => (
    <Svg
        width={ 52 }
        height={ 52 }
        fill="none"
        { ...props }
    >
        <Rect width={ 52 } height={ 52 } fill="#16C47F" rx={ 26 } />
        <Path
            stroke="#fff"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={ 2 }
            d="M26 15v11m0 0v11m0-11h11m-11 0H15"
        />
    </Svg>
)
export default SvgComponent
