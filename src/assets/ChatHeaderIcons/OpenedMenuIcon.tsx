import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
const SvgComponent = ( props: SvgProps ) => (
    <Svg
        width={ 25 }
        height={ 25 }
        fill="none"
        { ...props }
    >
        <Path
            stroke="#000"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={ 2 }
            d="M3.2 12.608h18m-18-6h18m-12 12h12"
        />
    </Svg>
)
export default SvgComponent
