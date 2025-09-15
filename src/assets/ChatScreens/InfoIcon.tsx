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
            d="M12.35 16.284v-4m0-4h.01m9.99 4c0 5.522-4.477 10-10 10-5.522 0-10-4.477-10-10s4.478-10 10-10c5.523 0 10 4.477 10 10Z"
        />
    </Svg>
)
export default SvgComponent
