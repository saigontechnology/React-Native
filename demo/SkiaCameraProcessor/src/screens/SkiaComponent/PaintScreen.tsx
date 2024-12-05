import {Canvas, Circle, Group, LinearGradient, vec, Skia} from '@shopify/react-native-skia'
import {ScreenContainer} from '../../components'
import {StyleSheet} from 'react-native'
import {colors} from '../../themes'

const width = 256
const height = 256

export const PaintScreen: React.FC = () => {
  const r = width / 6

  // Custom Draw
  const paint = Skia.Paint()
  paint.setColor(Skia.Color('red'))
  return (
    <ScreenContainer style={styles.container}>
      <Canvas style={[{width, height}, styles.canvas]}>
        {/**
         * Shape Component
         */}
        <Group color="lightblue">
          <Circle cx={r} cy={r} r={r} />
          <Group style="stroke" strokeWidth={10}>
            <Circle cx={3 * r} cy={3 * r} r={r} />
          </Group>
        </Group>
        {/**
         * Gradient
         */}
        <Group>
          <LinearGradient start={vec(3 * r, 3 * r)} end={vec(6 * r, 6 * r)} colors={['#0061ff', '#60efff']} />
          <Circle cx={5 * r} cy={5 * r} r={r} />
        </Group>
        {/**
         * Custom Draw Paint
         */}
        <Circle paint={paint} cx={5 * r} cy={r} r={r} />
      </Canvas>
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    padding: 20,
  },
  canvas: {
    backgroundColor: '#F3F3F3',
  },
})
