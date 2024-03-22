import React from 'react'
import {LocationData} from '../store/types'
import {StyleSheet, Text, View} from 'react-native'
import {Marker} from 'react-native-maps'
import {colors, getColorOpacity, metrics} from '../themes'

interface UserMarkerProps {
  location: LocationData
}

export interface UserInfoDefaultAvatar {
  label: string
}

const DefaultAvatar: React.FC<UserInfoDefaultAvatar> = ({label}) => (
  <View style={[styles.userImage, styles.avatarDefault]}>
    <Text style={{color: colors.white}}>{label}</Text>
  </View>
)

export const UserMarker: React.FC<UserMarkerProps> = ({location}) => (
  <Marker coordinate={location} anchor={{x: 0.5, y: 0.5}}>
    <View
      style={[
        styles.innerCircle,
        {
          backgroundColor: getColorOpacity(colors.primary, 0.4),
        },
      ]}>
      <View style={styles.userIcon}>
        <DefaultAvatar label={'LN'} />
      </View>
    </View>
  </Marker>
)

const styles = StyleSheet.create({
  innerCircle: {
    width: metrics.shadowLocationInner,
    aspectRatio: 1,
    borderRadius: metrics.shadowLocationInner / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userIcon: {
    width: metrics.xxxl,
    aspectRatio: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: metrics.xxxl / 2,
  },
  userImage: {
    width: metrics.iconLarge,
    aspectRatio: 1,
    borderRadius: metrics.iconLarge / 2,
    backgroundColor: colors.surfaceTertiary,
  },
  avatarDefault: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
})
