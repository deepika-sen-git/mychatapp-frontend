import * as React from "react"
import Svg, { SvgProps, Rect, Path } from "react-native-svg"
const SvgComponent = ( props: SvgProps ) => (
    <Svg
        width={ 40 }
        height={ 39 }
        fill="none"
        { ...props }
    >
        <Rect width={ 38 } height={ 38 } x={ 0.8 } y={ 0.5 } stroke="#D8DADC" rx={ 9.5 } />
        <Path
            fill="#000"
            d="M15.3 19.496c0 .147.026.282.08.406.058.124.147.243.265.356l6.887 6.454c.2.192.442.288.725.288.194 0 .368-.045.521-.136a.983.983 0 0 0 .38-.355.89.89 0 0 0 .142-.492c0-.27-.11-.51-.327-.72l-6.207-5.801 6.207-5.802c.218-.209.327-.446.327-.712a.905.905 0 0 0-.142-.5 1.004 1.004 0 0 0-.38-.346 1.008 1.008 0 0 0-.521-.136c-.283 0-.525.093-.725.28l-6.887 6.454a1.222 1.222 0 0 0-.266.355c-.053.124-.08.26-.08.407Z"
        />
    </Svg>
)
export default SvgComponent
