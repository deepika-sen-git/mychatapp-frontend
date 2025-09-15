import * as React from "react"
import Svg, { SvgProps, Circle } from "react-native-svg"
const SvgComponent = ( props: SvgProps ) => (
    <Svg
        width={ 21 }
        height={ 21 }
        fill="none"
        { ...props }
    >
        <Circle cx={ 10.3 } cy={ 10.5 } r={ 9.5 } stroke="#16C47F" />
    </Svg>
)
export default SvgComponent
