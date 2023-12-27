import React from 'react'
import {View} from 'react-native'
import {BodyPosition} from '../utilities/types'
import Matter, {World} from 'matter-js'
import {colors, metrics} from '../themes'

interface IBallProps {
  world: World
  size?: number
  color?: string
  position: BodyPosition
}

export const getBall = ({world, size = metrics.xxl, color = colors.red, position}: IBallProps) => {
  const initialBall = Matter.Bodies.circle(position.x, position.y, size / 2, {friction: 0})
  World.add(world, [initialBall])
  return {
    body: initialBall,
    size: [size, size],
    color,
    renderer: <Ball />,
  }
}

export const Ball = (props: any) => {
  const width = props.size[0]
  const height = props.size[1]
  const x = props.body.position.x - width / 2
  const y = props.body.position.y - height / 2
  return (
    <View
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
        height,
        backgroundColor: props.color,
        borderRadius: width / 2,
      }}
    />
  )
}
