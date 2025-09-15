import * as React from "react"
import Svg, {
    SvgProps,
    Rect,
    Defs,
    Pattern,
    Use,
    Image,
} from "react-native-svg"
const SvgComponent = ( props: SvgProps ) => (
    <Svg
        width={ 161 }
        height={ 161 }
        fill="none"
        { ...props }
    >
        <Rect width={ 160 } height={ 160 } x={ 0.8 } y={ 0.5 } fill="url(#a)" rx={ 80 } />
        <Defs>
            <Pattern
                id="a"
                width={ 1 }
                height={ 1 }
                patternContentUnits="objectBoundingBox"
            >
                <Use xlinkHref="#b" transform="scale(.00217)" />
            </Pattern>
            <Image
                id="b"
                width={ 461 }
                height={ 461 }
                preserveAspectRatio="none"
            />
        </Defs>
    </Svg>
)
export default SvgComponent
