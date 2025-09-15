import * as React from "react"
import Svg, { SvgProps, G, Rect, Path, Defs } from "react-native-svg"
/* SVGR has dropped some elements not supported by react-native-svg: filter */
const SvgComponent = ( props: SvgProps ) => (
    <Svg
        width={ 66 }
        height={ 67 }
        fill="none"
        { ...props }
    >
        <G filter="url(#a)">
            <Rect
                width={ 42 }
                height={ 42 }
                x={ 12 }
                y={ 8.784 }
                fill="#fff"
                rx={ 21 }
            />
            <Path
                fill="#2C2D3A"
                fillRule="evenodd"
                d="M22.438 29.784a2.98 2.98 0 1 1 5.958 0 2.98 2.98 0 0 1-5.959 0Zm2.979-1.355a1.354 1.354 0 1 0 0 2.709 1.354 1.354 0 0 0 0-2.709ZM30.02 29.784a2.98 2.98 0 1 1 5.96 0 2.98 2.98 0 0 1-5.96 0ZM33 28.429a1.354 1.354 0 1 0 0 2.709 1.354 1.354 0 0 0 0-2.709ZM40.583 26.804a2.98 2.98 0 1 0 0 5.959 2.98 2.98 0 0 0 0-5.959Zm-1.354 2.98a1.354 1.354 0 1 1 2.708 0 1.354 1.354 0 0 1-2.708 0Z"
                clipRule="evenodd"
            />
        </G>
        <Defs></Defs>
    </Svg>
)
export default SvgComponent
