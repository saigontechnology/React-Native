import {Group, Rect, Canvas, Atlas, rect, useTexture, useRSXformBuffer} from '@shopify/react-native-skia'
import {useSharedValue} from 'react-native-reanimated'
import {GestureDetector, Gesture} from 'react-native-gesture-handler'
import {ScreenContainer} from '../../components'
import {StyleSheet} from 'react-native'
import {colors} from '../../themes'

const size = {width: 25, height: 11.25}
const strokeWidth = 2
const textureSize = {
  width: size.width + strokeWidth,
  height: size.height + strokeWidth,
}

export const AtlasAnimateScreen: React.FC = () => {
  const pos = useSharedValue({x: 0, y: 0})
  const texture = useTexture(
    <Group>
      <Rect rect={rect(strokeWidth / 2, strokeWidth / 2, size.width, size.height)} color="cyan" />
      <Rect
        rect={rect(strokeWidth / 2, strokeWidth / 2, size.width, size.height)}
        color="blue"
        style="stroke"
        strokeWidth={strokeWidth}
      />
    </Group>,
    textureSize,
  )
  const gesture = Gesture.Pan().onChange(e => (pos.value = e))
  const numberOfBoxes = 150
  const width = 256
  const sprites = new Array(numberOfBoxes)
    .fill(0)
    .map(() => rect(0, 0, textureSize.width, textureSize.height))

  const transforms = useRSXformBuffer(numberOfBoxes, (val, i) => {
    'worklet'
    const tx = 5 + ((i * size.width) % width)
    const ty = 25 + Math.floor(i / (width / size.width)) * size.width
    const r = Math.atan2(pos.value.y - ty, pos.value.x - tx)
    val.set(Math.cos(r), Math.sin(r), tx, ty)
  })

  return (
    <ScreenContainer style={styles.container}>
      <GestureDetector gesture={gesture}>
        <Canvas style={{flex: 1}}>
          <Atlas image={texture} sprites={sprites} transforms={transforms} />
        </Canvas>
      </GestureDetector>
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    padding: 20,
  },
})
