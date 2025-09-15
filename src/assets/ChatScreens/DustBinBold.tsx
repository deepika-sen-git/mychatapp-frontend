import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
const SvgComponent = ( props: SvgProps ) => (
    <Svg
        width={ 25 }
        height={ 25 }
        fill="none"
        { ...props }
    >
        <Path
            stroke="#F93827"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={ 2 }
            d="M16.85 6.284v-.8c0-1.12 0-1.68-.217-2.108a2 2 0 0 0-.874-.874c-.428-.218-.988-.218-2.108-.218h-1.6c-1.12 0-1.68 0-2.108.218a2 2 0 0 0-.874.874c-.218.428-.218.988-.218 2.108v.8m2 5.5v5m4-5v5m-11-10.5h18m-2 0v11.2c0 1.68 0 2.52-.327 3.162a3 3 0 0 1-1.311 1.31c-.642.328-1.482.328-3.162.328h-4.4c-1.68 0-2.52 0-3.162-.327a3 3 0 0 1-1.311-1.311c-.327-.642-.327-1.482-.327-3.162v-11.2"
        />
    </Svg>
)
export default SvgComponent
