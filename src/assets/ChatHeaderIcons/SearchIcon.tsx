import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
const SvgComponent = ( props: SvgProps ) => (
    <Svg
        width={ 24 }
        height={ 25 }
        fill="none"
        { ...props }
    >
        <Path
            fill="#000"
            fillRule="evenodd"
            d="M11.5 3.642a8.75 8.75 0 1 0 0 17.5 8.75 8.75 0 0 0 0-17.5Zm-10.25 8.75c0-5.661 4.59-10.25 10.25-10.25s10.25 4.589 10.25 10.25c0 2.56-.939 4.901-2.491 6.698l3.271 3.271a.75.75 0 1 1-1.06 1.06l-3.272-3.27a10.21 10.21 0 0 1-6.698 2.49c-5.66 0-10.25-4.588-10.25-10.25Z"
            clipRule="evenodd"
        />
    </Svg>
)
export default SvgComponent
