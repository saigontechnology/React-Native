import {
  Canvas,
  Group,
  Image,
  useImage,
  Skia,
  Paint,
  Blur,
  BackdropFilter,
  ColorMatrix,
} from '@shopify/react-native-skia'
import {ScreenContainer} from '../../components'
import {colors, Images} from '../../themes'
import {ScrollView, StyleSheet} from 'react-native'

const ImageWidth = 128
const baseFullSize = 256
const getCurrentNumber = (number: number) => (ImageWidth / baseFullSize) * number

// https://kazzkiq.github.io/svg-color-filter/
const BLACK_AND_WHITE = [0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0]

export const ClipImageScreen: React.FC = () => {
  const image = useImage(Images.landscape)
  const star = Skia.Path.MakeFromSVGString(
    `M ${getCurrentNumber(128)} 0 L ${getCurrentNumber(168)} ${getCurrentNumber(80)} L ${getCurrentNumber(256)} ${getCurrentNumber(93)} L ${getCurrentNumber(192)} ${getCurrentNumber(155)} L ${getCurrentNumber(207)} ${getCurrentNumber(244)} L ${getCurrentNumber(128)} ${getCurrentNumber(202)} L ${getCurrentNumber(49)} ${getCurrentNumber(244)} L ${getCurrentNumber(64)} ${getCurrentNumber(155)} L 0 ${getCurrentNumber(93)} L ${getCurrentNumber(88)} ${getCurrentNumber(80)} L ${getCurrentNumber(128)} 0 Z`,
  )!

  return (
    <ScreenContainer style={styles.container}>
      <ScrollView contentContainerStyle={{alignItems: 'center'}}>
        <Canvas style={{height: 200, width: 200, backgroundColor: '#F3F3F3'}}>
          <Group clip={star}>
            <Image image={image} x={0} y={0} width={ImageWidth} height={ImageWidth} fit="cover" />
          </Group>
        </Canvas>
        <Canvas style={{height: 200, width: 200, backgroundColor: '#F3F3F3'}}>
          <Group clip={star} invertClip>
            <Image image={image} x={0} y={0} width={ImageWidth} height={ImageWidth} fit="cover" />
          </Group>
        </Canvas>
        <Canvas style={{height: 200, width: 200, backgroundColor: '#F3F3F3'}}>
          <Group
            clip={star}
            invertClip
            layer={
              <Paint>
                <Blur blur={3} />
              </Paint>
            }>
            <Image image={image} x={0} y={0} width={ImageWidth} height={ImageWidth} fit="cover" />
          </Group>
        </Canvas>
        <Canvas style={{height: 200, width: 200, backgroundColor: '#F3F3F3'}}>
          <Image image={image} x={0} y={0} width={ImageWidth} height={ImageWidth} fit="cover" />
          <BackdropFilter
            clip={{x: 0, y: 64, width: 128, height: 64}}
            filter={<ColorMatrix matrix={BLACK_AND_WHITE} />}
          />
        </Canvas>
        <Canvas style={{height: 200, width: 200, backgroundColor: '#F3F3F3'}}>
          <Image image={image} x={0} y={0} width={ImageWidth} height={ImageWidth} fit="cover">
            <ColorMatrix
              matrix={[
                -0.578, 0.99, 0.588, 0, 0, 0.469, 0.535, -0.003, 0, 0, 0.015, 1.69, -0.703, 0, 0, 0, 0, 0, 1,
                0,
              ]}
            />
          </Image>
        </Canvas>
      </ScrollView>
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
