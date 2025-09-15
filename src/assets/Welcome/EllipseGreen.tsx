import * as React from "react"
import Svg, { SvgProps, G, Path, Defs } from "react-native-svg"
/* SVGR has dropped some elements not supported by react-native-svg: filter */
const SvgComponent = ( props: SvgProps ) => (
    <Svg
        width={ 394 }
        height={ 415 }
        fill="none"
        { ...props }
    >
        <G filter="url(#a)" opacity={ 0.05 }>
            <Path
                fill="#CBFFA9"
                d="M419.446 298.126c-121.244 37.673-183.717-24.751-263.193 157.558-79.476 182.309-503.611-165.21-263.193-157.558 240.418 7.651 380.838-37.844 263.193-157.559C38.608 20.852 540.689 260.453 419.446 298.126Z"
            />
        </G>
        <Defs></Defs>
    </Svg>
)
export default SvgComponent
