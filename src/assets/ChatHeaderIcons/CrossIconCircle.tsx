import * as React from "react"
import Svg, { SvgProps, G, Rect, Path, Defs } from "react-native-svg"
/* SVGR has dropped some elements not supported by react-native-svg: filter */
const SvgComponent = ( props: SvgProps ) => (
    <Svg
        width={ 82 }
        height={ 83 }
        fill="none"
        { ...props }
    >
        <G filter="url(#a)">
            <Rect
                width={ 42 }
                height={ 42 }
                x={ 20 }
                y={ 20.5 }
                fill="#fff"
                fillOpacity={ 0.3 }
                rx={ 20 }
            />
            <Path
                stroke="#000"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={ 2 }
                d="m47 35.5-12 12M35 35.5l12 12"
            />
        </G>
        <Defs></Defs>
    </Svg>
)
export default SvgComponent
