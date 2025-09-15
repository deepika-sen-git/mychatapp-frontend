import * as React from "react"
import Svg, { SvgProps, G, Path, Defs } from "react-native-svg"
/* SVGR has dropped some elements not supported by react-native-svg: filter */
const SvgComponent = ( props: SvgProps ) => (
    <Svg
        width={ 394 }
        height={ 372 }
        fill="none"
        { ...props }
    >
        <G filter="url(#a)" opacity={ 0.05 }>
            <Path
                fill="#FF9D23"
                d="M573.262 30.554C411.562 80.8 328.243-2.456 222.247 240.687 116.251 483.83-449.411 20.35-128.769 30.554c320.641 10.205 507.917-50.47 351.016-210.133C65.346-339.241 734.963-19.689 573.262 30.554Z"
            />
        </G>
        <Defs></Defs>
    </Svg>
)
export default SvgComponent
