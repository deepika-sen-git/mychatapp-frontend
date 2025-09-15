import * as React from "react"
import Svg, { SvgProps, Rect, Path } from "react-native-svg"
const SvgComponent = ( props: SvgProps ) => (
    <Svg
        width={ 42 }
        height={ 43 }
        fill="none"
        { ...props }
    >
        <Rect
            width={ 42 }
            height={ 42 }
            y={ 0.784 }
            fill="#fff"
            fillOpacity={ 0.1 }
            rx={ 21 }
        />
        <Path
            stroke="#16C47F"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={ 2 }
            d="M21 14.2v15.167M13.417 21.784h15.166"
        />
    </Svg>
)
export default SvgComponent
