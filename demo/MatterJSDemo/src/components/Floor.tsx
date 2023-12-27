import React from 'react'
import {View} from 'react-native'
import {BodyPosition} from '../utilities/types'
import {Bodies, World} from 'matter-js'

interface IFloorProps {
  world: World
  width: number
  height: number
  color?: string
  position: BodyPosition
  angle?: number
}

export const getFloor = ({world, width, height, color, position, angle = 0}: IFloorProps) => {
  const initialFloor = Bodies.rectangle(position.x, position.y, width, height, {
    isStatic: true,
    friction: 1,
    angle,
  })
  World.add(world, [initialFloor])
  return {
    body: initialFloor,
    size: [width, height],
    color,
    renderer: Floor,
  }
}

export const Floor = (props: any) => {
  const width = props.size[0]
  const height = props.size[1]
  const x = props.body.position.x
  const y = props.body.position.y
  return (
    <View
      style={{
        position: 'absolute',
        left: x,
        bottom: y,
        width: width,
        height: height,
        backgroundColor: props.color,
      }}
    />
  )
}
