import * as React from "react"
import Svg, { SvgProps, G, Path, Defs } from "react-native-svg"
/* SVGR has dropped some elements not supported by react-native-svg: filter */
const SvgComponent = ( props: SvgProps ) => (
    <Svg
        width={ 394 }
        height={ 592 }
        fill="none"
        { ...props }
    >
        <G filter="url(#a)" opacity={ 0.05 }>
            <Path
                fill="#F93827"
                d="M490.542 393.929c-133.272-6.1-172.698-90.111-316.384 61.64S-264.456 112.343-29.616 205.82c234.839 93.477 389.856 98.701 316.384-61.64-73.472-160.34 337.046 255.849 203.774 249.749Z"
            />
        </G>
        <Defs></Defs>
    </Svg>
)
export default SvgComponent
