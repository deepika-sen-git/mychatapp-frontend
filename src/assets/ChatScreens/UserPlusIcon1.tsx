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
            stroke="#16C47F"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={ 2 }
            d="M12.25 16h-4.5c-1.396 0-2.093 0-2.661.172a4 4 0 0 0-2.667 2.667c-.172.568-.172 1.265-.172 2.661m17 0v-6m-3 3h6M14.75 8a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z"
        />
    </Svg>
)
export default SvgComponent
