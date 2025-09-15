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
            fill="#16C47F"
            fillRule="evenodd"
            d="M12.55 22.392c-4.713 0-7.07 0-8.535-1.465-1.464-1.464-1.464-3.821-1.464-8.535s0-7.071 1.464-8.536c1.465-1.464 3.822-1.464 8.536-1.464 4.714 0 7.07 0 8.535 1.464 1.465 1.465 1.465 3.822 1.465 8.536 0 4.714 0 7.07-1.465 8.535-1.464 1.465-3.821 1.465-8.535 1.465Zm4.031-13.03a.75.75 0 0 1 0 1.06l-5 5a.75.75 0 0 1-1.06 0l-2-2a.75.75 0 1 1 1.06-1.06l1.47 1.469 4.47-4.47a.75.75 0 0 1 1.06 0Z"
            clipRule="evenodd"
        />
    </Svg>
)
export default SvgComponent
