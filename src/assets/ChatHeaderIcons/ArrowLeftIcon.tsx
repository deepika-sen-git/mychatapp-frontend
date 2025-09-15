import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
const SvgComponent = ( props: SvgProps ) => (
    <Svg
        width={ 27 }
        height={ 27 }
        fill="none"
        { ...props }
    >
        <Path
            fill="#0D0A2C"
            fillRule="evenodd"
            d="M11.807 6.209a.813.813 0 0 1 0 1.149L6.694 12.47h15.372a.813.813 0 0 1 0 1.625H6.694l5.113 5.113a.812.812 0 1 1-1.149 1.149l-6.5-6.5a.812.812 0 0 1 0-1.15l6.5-6.5a.813.813 0 0 1 1.15 0Z"
            clipRule="evenodd"
        />
    </Svg>
)
export default SvgComponent
