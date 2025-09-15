import * as React from "react"
import Svg, { SvgProps, G, Rect, Path, Defs } from "react-native-svg"
/* SVGR has dropped some elements not supported by react-native-svg: filter */
const SvgComponent = ( props: SvgProps ) => (
    <Svg
        width={ 67 }
        height={ 67 }
        fill="none"
        { ...props }
    >
        <G filter="url(#a)">
            <Rect
                width={ 42 }
                height={ 42 }
                x={ 12.4 }
                y={ 8.784 }
                fill="#16C47F"
                rx={ 21 }
            />
            <Path
                fill="#fff"
                fillRule="evenodd"
                d="m42.449 28.181-1.86 5.579c-1.311 3.933-1.967 5.9-2.928 6.458a2.943 2.943 0 0 1-2.958 0c-.962-.559-1.617-2.525-2.928-6.458-.21-.632-.316-.947-.493-1.212a2.355 2.355 0 0 0-.646-.646c-.264-.177-.58-.282-1.212-.493-3.933-1.31-5.9-1.966-6.458-2.928a2.943 2.943 0 0 1 0-2.958c.559-.961 2.525-1.617 6.458-2.928l5.579-1.86c4.873-1.624 7.31-2.436 8.596-1.15 1.286 1.286.474 3.723-1.15 8.596Zm-7.916.413a.813.813 0 0 1 .006-1.149l4.562-4.51a.813.813 0 0 1 1.143 1.155l-4.562 4.51a.812.812 0 0 1-1.149-.006Z"
                clipRule="evenodd"
            />
        </G>
        <Defs></Defs>
    </Svg>
)
export default SvgComponent
