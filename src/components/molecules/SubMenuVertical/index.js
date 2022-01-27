import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { IcRight } from '../../../assets'
import styles from './styles'

const SubMenuVertical = ({ svg, title, onPress,styleCustom }) => {
    return (
        <TouchableOpacity onPress={onPress} style={styleCustom}>
            <View style={styles.container}>
                <View style={{flexDirection : 'row', alignItems : 'center',}}>
                {svg}
                <Text style={styles.txtTitle}>{title}</Text>
                </View>
                <IcRight/>
            </View>
        </TouchableOpacity>
    )
}

export default SubMenuVertical
