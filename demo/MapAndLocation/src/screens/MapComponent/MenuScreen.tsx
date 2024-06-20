import {NativeStackScreenProps} from '@react-navigation/native-stack'
import React, {PropsWithChildren} from 'react'
import {ScreenContainer} from '../../components'
import {RouteKey} from '../../navigation/RouteKey'
import {AppStackParamList} from '../../navigation/types'
import {StyleSheet, Text, TouchableOpacity} from 'react-native'
import {FontSizes, colors, metrics} from '../../themes'
import {navigate} from '../../navigation/NavigationService'
import {useSafeAreaInsets} from 'react-native-safe-area-context'

type Props = NativeStackScreenProps<AppStackParamList, RouteKey.MenuScreen> & PropsWithChildren

export const MenuScreen: React.FC<Props> = () => {
  const insets = useSafeAreaInsets()
  return (
    <ScreenContainer style={[styles.container, {paddingTop: insets.top}]}>
      <TouchableOpacity style={styles.itemContainer} onPress={() => navigate(RouteKey.MapViewScreen)}>
        <Text style={styles.item}>Simple Map with Location</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.itemContainer} onPress={() => navigate(RouteKey.CreateZoneScreen)}>
        <Text style={styles.item}>Draw on Map</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.itemContainer} onPress={() => navigate(RouteKey.MapRouteScreen)}>
        <Text style={styles.item}>Map Route</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.itemContainer} onPress={() => navigate(RouteKey.LoadKmlScreen)}>
        <Text style={styles.item}>Load KML file</Text>
      </TouchableOpacity>
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: metrics.small,
  },
  itemContainer: {
    padding: metrics.small,
    width: '100%',
    borderRadius: metrics.borderRadius,
    borderWidth: metrics.borderWidth,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: metrics.small,
  },
  item: {
    color: colors.primary,
    fontSize: FontSizes.large,
    fontWeight: 'bold',
    textAlign: 'center',
  },
})
