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
            stroke="#16C47F"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={ 2 }
            d="M19.25 21v-6m-3 3h6m-10-3h-4c-1.864 0-2.796 0-3.53.305a4 4 0 0 0-2.166 2.164c-.304.735-.304 1.667-.304 3.531m13.5-17.71a4.001 4.001 0 0 1 0 7.42m-2-3.71a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"
        />
    </Svg>
)
export default SvgComponent
