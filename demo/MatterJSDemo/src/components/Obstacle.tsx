import React from 'react'
import {View} from 'react-native'
import {array, object, string} from 'prop-types'
import Matter, {World} from 'matter-js'
import {BodyPosition} from '../utilities/types'

const Obstacle = (props: any) => {
  const width = props.size[0]
  const height = props.size[1]
  const x = props.body.position.x - width / 2
  const y = props.body.position.y - height / 2
  return (
    <View
      style={[
        {
          position: 'absolute',
          left: x,
          top: y,
          width: width,
          height: height,
          backgroundColor: props.color,
          transform: [{rotate: `${props.angle}rad`}],
        },
      ]}
    />
  )
}

interface IObstacleProps {
  world: World

  position: BodyPosition
  width: number
  height: number
  color?: string
  angle?: number
}

export const getObstacle = ({world, position, width, height, color = 'black', angle = 0}: IObstacleProps) => {
  const initialObstacle = Matter.Bodies.rectangle(position.x, position.y, width, height, {
    isStatic: true,
    friction: 1,
    angle,
  })
  Matter.World.add(world, [initialObstacle])

  return {
    body: initialObstacle,
    size: [width, height],
    color,
    angle,
    scored: false,
    renderer: <Obstacle />,
  }
}

Obstacle.propTypes = {
  size: array,
  body: object,
  color: string,
}
