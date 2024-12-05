import {NativeStackScreenProps} from '@react-navigation/native-stack'
import React, {useRef, useState} from 'react'
import {ScreenContainer} from '../../components'
import RouteKey from '../../navigation/RouteKey'
import {AppStackParamList} from '../../navigation/types'
import {Button, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {navigate} from '../../navigation/NavigationService'
import {BottomSheetMethods} from '@gorhom/bottom-sheet/lib/typescript/types'
import BottomSheet, {BottomSheetFlatList} from '@gorhom/bottom-sheet'
import {colors, hitSlop, metrics} from '../../themes'

type Props = NativeStackScreenProps<AppStackParamList, RouteKey.HomeScreen>

const SNAPPOINTS = ['60%']

const SKIA_LIST = [
  RouteKey.PaintScreen,
  RouteKey.TextScreen,
  RouteKey.ShapeScreen,
  RouteKey.AtlasAnimateScreen,
  RouteKey.ClipImageScreen,
  RouteKey.ShaderScreen,
]
const CAMERA_LIST = [
  RouteKey.CameraFaceNormalScreen,
  RouteKey.CameraFaceSkiaScreen,
  RouteKey.CameraFaceNormalSkiaScreen,
]

const renderScreenItem = ({item}: {item: string}) => (
  <TouchableOpacity hitSlop={hitSlop} style={styles.listItemContainer} onPress={() => navigate(item)}>
    <Text style={styles.listItem}>{item}</Text>
  </TouchableOpacity>
)

const HomeScreen: React.FC<Props> = () => {
  const bottomSheetRef = useRef<BottomSheetMethods>(null)
  const [list, setList] = useState<string[]>([])

  return (
    <>
      <ScreenContainer style={styles.container}>
        <View style={styles.buttonContainer}>
          <Button
            title={'Skia'}
            onPress={() => {
              setList(SKIA_LIST)
              setTimeout(() => {
                bottomSheetRef.current?.expand()
              }, 200)
            }}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title={'Camera'}
            onPress={() => {
              setList(CAMERA_LIST)
              setTimeout(() => {
                bottomSheetRef.current?.expand()
              }, 200)
            }}
          />
        </View>
      </ScreenContainer>

      <BottomSheet ref={bottomSheetRef} index={-1} enablePanDownToClose snapPoints={SNAPPOINTS}>
        <BottomSheetFlatList
          style={styles.flatList}
          contentContainerStyle={styles.flatListContent}
          data={list}
          renderItem={renderScreenItem}
        />
      </BottomSheet>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
  },
  buttonContainer: {
    marginTop: 20,
  },

  flatList: {
    flex: 1,
  },
  flatListContent: {
    padding: metrics.xs,
  },
  listItemContainer: {
    paddingVertical: 12,
  },
  listItem: {
    color: colors.black,
    fontSize: 18,
  },
})

export default HomeScreen
