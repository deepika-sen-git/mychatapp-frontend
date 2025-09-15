import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
const SvgComponent = ( props: SvgProps ) => (
    <Svg
        width={ 33 }
        height={ 33 }
        fill="none"
        { ...props }
    >
        <Path
            stroke="#16C47F"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={ 2 }
            d="M16.8 30.117c7.364 0 13.333-5.97 13.333-13.333 0-7.364-5.97-13.334-13.333-13.334-7.364 0-13.333 5.97-13.333 13.334S9.437 30.117 16.8 30.117Z"
        />
        <Path
            stroke="#16C47F"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={ 2 }
            d="M13.467 12.738c0-.637 0-.955.133-1.133a.667.667 0 0 1 .486-.265c.221-.016.489.156 1.024.5l6.294 4.046c.465.3.697.448.777.638.07.166.07.353 0 .52-.08.19-.312.338-.777.637l-6.294 4.046c-.535.344-.803.516-1.024.5a.666.666 0 0 1-.486-.265c-.133-.177-.133-.496-.133-1.132v-8.092Z"
        />
    </Svg>
)
export default SvgComponent
