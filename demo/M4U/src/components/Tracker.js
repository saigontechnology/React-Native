import React from 'react'
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native'
import FastImage from 'react-native-fast-image'
import {Colors} from '../utilities/colors'
import {useProgress} from 'react-native-track-player'
import {convertTime} from '../utilities/utils'
import Pause from '../assets/icons/pause-outline.svg'
import Play from '../assets/icons/play-outline.svg'
import Prev from '../assets/icons/play-skip-back-outline.svg'
import Next from '../assets/icons/play-skip-forward-outline.svg'

const Tracker = ({song, onPlay, onPrev, onNext, isPlaying, onPress}) => {
  const handleOnPlay = () => {
    onPlay?.(song)
  }

  const {position} = useProgress()

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.left}>
        <FastImage style={styles.image} source={{uri: song?.artwork}} />
        <View>
          <Text style={styles.title}>
            {song?.title} ({convertTime(Math.round(position))})
          </Text>
          <Text style={styles.artist}>{song?.artist}</Text>
        </View>
      </View>
      <View style={styles.right}>
        <TouchableOpacity onPress={onPrev} style={styles.button}>
          <Prev style={{color: Colors.seccond}} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleOnPlay} style={[styles.button, styles.buttonCenter]}>
          {isPlaying ? <Pause style={{color: Colors.seccond}} /> : <Play style={{color: Colors.seccond}} />}
        </TouchableOpacity>
        <TouchableOpacity onPress={onNext} style={styles.button}>
          <Next style={{color: Colors.seccond}} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    marginBottom: 30,
    padding: 5,
    marginHorizontal: 12,
    borderRadius: 10,
  },
  buttonIconText: {
    fontSize: 20,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  right: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.seccond,
    marginLeft: 10,
    marginBottom: 5,
  },
  artist: {
    fontSize: 12,
    color: Colors.seccond,
    marginLeft: 10,
  },
  button: {
    width: 25,
    height: 25,
  },
  buttonCenter: {
    width: 35,
    height: 35,
  },
})

export default Tracker
