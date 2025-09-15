import * as React from "react"
import Svg, { SvgProps, Circle, Path } from "react-native-svg"
const SvgComponent = ( props: SvgProps ) => (
    <Svg
        width={ 21 }
        height={ 21 }
        fill="none"
        { ...props }
    >
        <Circle cx={ 10.3 } cy={ 10.5 } r={ 9.5 } fill="#16C47F" stroke="#16C47F" />
        <Path stroke="#fff" strokeWidth={ 1.5 } d="m5.8 10 3.5 3.5L14.8 8" />
    </Svg>
)
export default SvgComponent
