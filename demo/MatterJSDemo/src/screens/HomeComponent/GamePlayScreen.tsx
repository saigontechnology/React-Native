import {NativeStackScreenProps} from '@react-navigation/native-stack'
import React, {PropsWithChildren, useCallback, useEffect, useMemo, useRef, useState} from 'react'
import RouteKey from '../../navigation/RouteKey'
import {AppStackParamList} from '../../navigation/types'
import {Dimensions, SafeAreaView, StatusBar, StyleSheet} from 'react-native'
import {GameEngine} from 'react-native-game-engine'
import Matter, {Body, Query} from 'matter-js'
import {getBall, getFloor} from '../../components'
import {getObstacle} from '../../components/Obstacle'
import {getRandom, getRandomNumberBetweenTwo} from '../../utilities/utils'
import {RESET_OBSTACLE_VALUE_ODD, RESET_OBSTACLE_VALUE_EVEN} from '../../constants'

type Props = NativeStackScreenProps<AppStackParamList, RouteKey.GamePlayScreen> & PropsWithChildren

export const GamePlayScreen: React.FC<Props> = ({navigation}) => {
  const gameEngineRef = useRef(null)
  const width = Dimensions.get('window').width
  const height = Dimensions.get('window').height
  const [running, setRunning] = useState(true)
  const [startTime, setStartTime] = useState(0)
  const engine = useMemo(() => {
    const gameEngine = Matter.Engine.create({enableSleeping: false})
    gameEngine.gravity.y = 0.25
    return gameEngine
  }, [])

  const gameEntities = useMemo(
    () => ({
      physics: {engine, world: engine.world},
      Ball: getBall({
        world: engine.world,
        position: {x: width / 2, y: 10},
      }),
      Floor: getFloor({
        world: engine.world,
        width,
        height: 10,
        position: {x: 0, y: height - 10},
      }),
      RoofTop: getFloor({
        world: engine.world,
        width,
        height: 10,
        position: {x: 0, y: -10},
      }),
      Obstacle1: getObstacle({
        world: engine.world,
        position: {
          x: getRandom(0, width / 2),
          y: getRandom(200, 300),
        },
        height: 20,
        width: getRandom(200, 250),
        angle: getRandomNumberBetweenTwo(0, Math.PI * 0.06),
      }),
      Obstacle2: getObstacle({
        world: engine.world,
        position: {
          x: getRandom(width / 2, width - 100),
          y: getRandom(400, 500),
        },
        height: 20,
        width: getRandom(200, 250),
        angle: getRandomNumberBetweenTwo(-Math.PI * 0.07, -Math.PI * 0.06),
      }),
      Obstacle3: getObstacle({
        world: engine.world,
        position: {
          x: getRandom(0, width / 2),
          y: getRandom(600, 700),
        },
        height: 20,
        width: getRandom(200, 250),
      }),
      Obstacle4: getObstacle({
        world: engine.world,
        position: {
          x: getRandom(width / 2, width - 100),
          y: getRandom(800, 900),
        },
        height: 20,
        width: getRandom(200, 250),
        angle: getRandomNumberBetweenTwo(0, -Math.PI * 0.06),
      }),
    }),
    [engine, width, height],
  )

  const physics = useCallback((entities: {physics: {engine: any}}, {time}: any) => {
    Matter.Engine.update(entities.physics.engine, time.delta)
    return entities
  }, [])

  const updateObstacle = useCallback(
    (entities: {[x: string]: {body: Matter.Body; type: string; scored: boolean}}) => {
      for (let i = 1; i <= 4; i++) {
        if (i === 1 && entities['Obstacle' + i].body.position.y <= -1 * RESET_OBSTACLE_VALUE_ODD) {
          Matter.Body.setPosition(entities['Obstacle' + i].body, {
            x: getRandom(0, width / 2),
            y: height - RESET_OBSTACLE_VALUE_ODD,
          })
        } else if (i === 2 && entities['Obstacle' + i].body.position.y <= -1 * RESET_OBSTACLE_VALUE_EVEN) {
          Matter.Body.setPosition(entities['Obstacle' + i].body, {
            x: getRandom(width / 2, width - 100),
            y: height - RESET_OBSTACLE_VALUE_EVEN,
          })
        } else if (i === 3 && entities['Obstacle' + i].body.position.y <= -1 * RESET_OBSTACLE_VALUE_ODD) {
          Matter.Body.setPosition(entities['Obstacle' + i].body, {
            x: getRandom(0, width / 2),
            y: height - RESET_OBSTACLE_VALUE_ODD,
          })
        } else if (i === 4 && entities['Obstacle' + i].body.position.y <= -1 * RESET_OBSTACLE_VALUE_EVEN) {
          Matter.Body.setPosition(entities['Obstacle' + i].body, {
            x: getRandom(width / 2, width - 100),
            y: height - RESET_OBSTACLE_VALUE_EVEN,
          })
        } else {
          if (i % 2 !== 0) {
            Matter.Body.translate(entities['Obstacle' + i].body, {x: i === 1 ? 1 : -1, y: -2})
          } else {
            Matter.Body.translate(entities['Obstacle' + i].body, {x: 0, y: -2})
          }
        }
      }
      return entities
    },
    [height, width],
  )

  const updateBall = useCallback(
    (
      entities: {physics: {engine: any}; Ball: {body: Matter.Body}; ControllerLeft: any},
      {touches, time}: any,
    ) => {
      touches
        .filter((t: {type: string}) => t.type === 'press')
        .forEach((t: any) => {
          const positionX = entities.Ball.body.position.x
          if (t.event.locationX < width / 2) {
            Body.setVelocity(entities.Ball.body, {
              x: positionX <= 0 ? -entities.Ball.body.velocity.x : -3,
              y: entities.Ball.body.velocity.y,
            })
          } else {
            Body.setVelocity(entities.Ball.body, {
              x: positionX > width ? -entities.Ball.body.velocity.x : +3,
              y: entities.Ball.body.velocity.y,
            })
          }
        })
      Matter.Engine.update(entities.physics.engine, time.delta)
      return entities
    },
    [width],
  )

  const collisionSystem = useCallback(
    (entities: {RoofTop: any; Ball: any; Floor: any}, {dispatch}: any) => {
      // Check for collisions between the box and obstacle
      const collisions = Query.collides(entities.Ball.body, [entities.Floor.body, entities.RoofTop.body])
      if (collisions.length > 0 && running) {
        // Collision between box and obstacle detected
        dispatch({type: 'game-over'})
      }

      return entities
    },
    [running],
  )

  useEffect(() => {
    setStartTime(performance.now())
  }, [])

  const onEvent = useCallback((e: any) => {
    switch (e.type) {
      case 'game-over':
        setRunning(false)
        navigation.replace(RouteKey.GameOverScreen, {
          totalTime: performance.now() - startTime,
        })
        break
      default:
        break
    }
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <GameEngine
        running={running}
        ref={gameEngineRef}
        entities={gameEntities}
        onEvent={onEvent}
        systems={[physics, updateBall, updateObstacle, collisionSystem]}>
        <StatusBar hidden={true} />
      </GameEngine>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
