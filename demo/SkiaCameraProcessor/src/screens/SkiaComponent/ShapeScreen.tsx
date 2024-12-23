import {Canvas, Path, Oval} from '@shopify/react-native-skia'
import {ScreenContainer} from '../../components'
import {StyleSheet} from 'react-native'
import {colors} from '../../themes'

export const ShapeScreen: React.FC = () => {
  return (
    <ScreenContainer style={styles.container}>
      <Canvas style={{flex: 1}}>
        <Path
          path="M 128 0 L 168 80 L 256 93 L 192 155 L 207 244 L 128 202 L 49 244 L 64 155 L 0 93 L 88 80 L 128 0 Z"
          color="lightblue"
        />
        <Oval x={64} y={300} width={128} height={256} color="darkblue" />
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
