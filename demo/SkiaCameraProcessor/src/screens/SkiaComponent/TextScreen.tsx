import {Canvas, Group, TextPath, Skia, useFont, vec, Fill} from '@shopify/react-native-skia'
import {ScreenContainer} from '../../components'
import {StyleSheet} from 'react-native'
import {colors} from '../../themes'

const size = 128
const path = Skia.Path.Make()
path.addCircle(size, size, size / 2)

export const TextScreen: React.FC = () => {
  const font = useFont(require('../../../assets/fonts/Roboto-Regular.ttf'), 24)
  return (
    <ScreenContainer style={styles.container}>
      <Canvas style={{flex: 1}}>
        <Fill color="white" />
        <Group transform={[{rotate: Math.PI}]} origin={vec(size, size)}>
          <TextPath font={font} path={path} text="Hello World!" color={'black'} />
        </Group>
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
