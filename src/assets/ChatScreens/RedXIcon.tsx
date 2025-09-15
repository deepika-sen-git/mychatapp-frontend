import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
const SvgComponent = ( props: SvgProps ) => (
    <Svg
        width={ 25 }
        height={ 24 }
        fill="none"
        { ...props }
    >
        <Path
            stroke="#F44336"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={ 2 }
            d="m18.5 6-12 12M6.5 6l12 12"
        />
    </Svg>
)
export default SvgComponent
