import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
const SvgComponent = ( props: SvgProps ) => (
    <Svg
        width={ 21 }
        height={ 20 }
        fill="none"
        { ...props }
    >
        <Path
            stroke="#16C47F"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={ 1.5 }
            d="m1.967 5.833 6.804 4.763c.55.386.826.579 1.126.653.264.066.541.066.806 0 .3-.074.575-.267 1.126-.653l6.804-4.763M5.967 16.667h8.666c1.4 0 2.1 0 2.635-.273a2.5 2.5 0 0 0 1.093-1.092c.272-.535.272-1.235.272-2.635V7.333c0-1.4 0-2.1-.272-2.635a2.5 2.5 0 0 0-1.093-1.092c-.535-.273-1.235-.273-2.635-.273H5.967c-1.4 0-2.1 0-2.635.273a2.5 2.5 0 0 0-1.093 1.092c-.272.535-.272 1.235-.272 2.635v5.334c0 1.4 0 2.1.272 2.635a2.5 2.5 0 0 0 1.093 1.092c.534.273 1.234.273 2.635.273Z"
        />
    </Svg>
)
export default SvgComponent
