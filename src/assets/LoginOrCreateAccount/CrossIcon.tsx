import * as React from "react"
import Svg, { SvgProps, Rect, Path } from "react-native-svg"
const SvgComponent = ( props: SvgProps ) => (
    <Svg
        width={ 40 }
        height={ 40 }
        fill="none"
        { ...props }
    >
        <Rect width={ 39 } height={ 39 } x={ 0.5 } y={ 0.5 } stroke="#D8DADC" rx={ 9.5 } />
        <Path
            stroke="#000"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={ 2 }
            d="M26 14 14 26m0-12 12 12"
        />
    </Svg>
)
export default SvgComponent
