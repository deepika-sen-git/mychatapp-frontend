import {
    // StyleSheet,
    TouchableOpacity
} from 'react-native'
import React from 'react'
import svgImages from '../../utils/svgImages'

const NextButton = () => {
    return (
        <TouchableOpacity>
            <svgImages.NextIcon />
        </TouchableOpacity>
    )
}

export default NextButton

// const styles = StyleSheet.create({})