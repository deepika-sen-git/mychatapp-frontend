import * as React from "react"
import Svg, { SvgProps, Circle, Path } from "react-native-svg"
const SvgComponent = ( props: SvgProps ) => (
    <Svg
        width={ 42 }
        height={ 42 }
        fill="none"
        { ...props }
    >
        <Circle cx={ 20.8 } cy={ 21.432 } r={ 20.5 } fill="#16C47F" />
        <Path fill="#16C47F" d="M8.8 9.432h24v24h-24z" />
        <Path
            stroke="#fff"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={ 1.022 }
            d="m17.8 14.432 7 7-7 7"
        />
    </Svg>
)
export default SvgComponent
