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
            fill="#2C2D3A"
            fillRule="evenodd"
            d="M8.812 4.43a.75.75 0 0 1 1.057.082l6 7a.75.75 0 0 1 0 .976l-6 7a.75.75 0 0 1-1.139-.976L14.312 12 8.73 5.488a.75.75 0 0 1 .082-1.057Z"
            clipRule="evenodd"
        />
    </Svg>
)
export default SvgComponent
