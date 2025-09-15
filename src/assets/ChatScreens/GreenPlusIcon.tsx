import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
const SvgComponent = ( props: SvgProps ) => (
    <Svg
        width={ 21 }
        height={ 20 }
        fill="none"
        { ...props }
    >
        <Path
            stroke="#16C47F"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={ 2 }
            d="M10.4 1v9m0 0v9m0-9h9m-9 0h-9"
        />
    </Svg>
)
export default SvgComponent
