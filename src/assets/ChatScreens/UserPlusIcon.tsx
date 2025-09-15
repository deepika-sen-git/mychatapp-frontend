import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
const SvgComponent = ( props: SvgProps ) => (
    <Svg
        width={ 287 }
        height={ 260 }
        fill="none"
        { ...props }
    >
        <Path
            stroke="#16C47F"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={ 19 }
            d="M143.5 177.058h-60c-18.607 0-27.911 0-35.482 2.297a53.33 53.33 0 0 0-35.555 35.555c-2.296 7.57-2.296 16.874-2.296 35.482m226.666 0v-80m-40 40h80m-100-140c0 33.137-26.863 60-60 60s-60-26.863-60-60 26.863-60 60-60 60 26.863 60 60Z"
        />
    </Svg>
)
export default SvgComponent
