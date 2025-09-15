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
            stroke="#F93827"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.633 5v-.667c0-.933 0-1.4-.181-1.756a1.667 1.667 0 0 0-.729-.729c-.356-.181-.823-.181-1.757-.181H9.633c-.933 0-1.4 0-1.757.181-.313.16-.568.415-.728.729-.182.356-.182.823-.182 1.756V5m1.667 4.583v4.167m3.334-4.167v4.167M2.8 5h15m-1.667 0v9.333c0 1.4 0 2.1-.272 2.635a2.5 2.5 0 0 1-1.093 1.093c-.535.272-1.235.272-2.635.272H8.466c-1.4 0-2.1 0-2.634-.272a2.5 2.5 0 0 1-1.093-1.093c-.273-.534-.273-1.235-.273-2.635V5"
        />
    </Svg>
)
export default SvgComponent
