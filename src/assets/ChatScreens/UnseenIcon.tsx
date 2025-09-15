import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
const SvgComponent = ( props: SvgProps ) => (
    <Svg
        width={ 12 }
        height={ 13 }
        fill="none"
        { ...props }
    >
        <Path
            stroke="#000"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2 4.284h5.5m0 0-2 2m2-2-2-2m-3.5 7h8m0 0-2 2m2-2-2-2"
        />
    </Svg>
)
export default SvgComponent
