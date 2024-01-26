import Slider from '@react-native-community/slider'
import React, {useCallback, useEffect, useState} from 'react'
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import FastImage from 'react-native-fast-image'
import Headset from '../../assets/icons/headset-outline.svg'
import Pause from '../../assets/icons/pause-outline.svg'
import Play from '../../assets/icons/play-outline.svg'
import Prev from '../../assets/icons/play-skip-back-outline.svg'
import Next from '../../assets/icons/play-skip-forward-outline.svg'
import Shuffle from '../../assets/icons/shuffle-outline.svg'
import {ScreenContainer} from '../../components'
import {Colors} from '../../utilities/colors'
import TrackPlayer, {State, useProgress} from 'react-native-track-player'
import {convertTime} from '../../utilities/utils'

const Icon = ({icon, onPress, isCenter, isSelected}) => {
  const IconName = icon
  return (
    <TouchableOpacity onPress={onPress} style={[styles.iconButton, isCenter && styles.iconCenter]}>
      <IconName style={{color: isSelected ? Colors.jade : Colors.primary}} />
    </TouchableOpacity>
  )
}

export const TrackDetail = () => {
  const [songSelected, setSongSelected] = useState({})
  const [isPlaying, setIsPlaying] = useState(false)
  const [isEarPhone, setIsEarPhone] = useState(false)
  const [isShuffle, setIsShuffle] = useState(false)

  const {position} = useProgress()

  const handlePlayOrPause = () => {
    setIsPlaying(!isPlaying)
    if (isPlaying) {
      TrackPlayer.pause()
    } else {
      TrackPlayer.play()
    }
  }

  const handleSetEarPhone = () => {
    setIsEarPhone(!isEarPhone)
  }

  const handleSetShuffle = () => {
    setIsShuffle(!isShuffle)
  }

  const handlePrev = async () => {
    TrackPlayer.skipToPrevious()
    await handleSetSelectedSong()
  }
  const handleNext = async () => {
    TrackPlayer.skipToNext()
    await handleSetSelectedSong()
  }

  const handleSeekDuration = async value => {
    await TrackPlayer.seekTo(value)
  }

  const handleCheckTrackStatus = useCallback(async () => {
    const state = await TrackPlayer.getState()
    console.log(state)
    if (state === State.Playing || state === State.Buffering) {
      setIsPlaying(true)
    } else {
      setIsPlaying(false)
    }
  }, [])

  const handleSetSelectedSong = useCallback(async () => {
    const currentTrack = await TrackPlayer.getCurrentTrack()
    const trackObject = await TrackPlayer.getTrack(currentTrack)
    setSongSelected(trackObject)
  }, [])

  useEffect(() => {
    handleSetSelectedSong()
    console.log(songSelected)
  }, [handleSetSelectedSong])

  useEffect(() => {
    handleCheckTrackStatus()
  }, [handleCheckTrackStatus])

  return (
    <ScreenContainer style={styles.container}>
      <View style={styles.firstFlex}>
        <FastImage style={styles.image} source={{uri: songSelected?.artwork}} />
      </View>

      <View style={styles.seccondFlex}>
        <View style={styles.infoBlock}>
          <Text style={styles.title}>{songSelected?.title}</Text>
          <Text style={styles.artist}>{songSelected?.artist}</Text>
        </View>
        <View>
          <View style={styles.durationContainer}>
            <Text style={styles.artist}>{convertTime(Math.floor(position))}</Text>
            <Text style={styles.artist}>{convertTime(songSelected?.duration)}</Text>
          </View>
          <Slider
            style={styles.slider}
            // minimumValue={0}
            maximumValue={songSelected.duration}
            minimumTrackTintColor={'lightseagreen'}
            maximumTrackTintColor={Colors.primary}
            tapToSeek
            onValueChange={handleSeekDuration}
            value={position}
          />
        </View>
        <View style={styles.controlContainer}>
          <Icon icon={Shuffle} onPress={handleSetShuffle} isSelected={isShuffle} />
          <Icon icon={Prev} onPress={handlePrev} />
          <Icon icon={isPlaying ? Pause : Play} isCenter onPress={handlePlayOrPause} />
          <Icon icon={Next} onPress={handleNext} />
          <Icon icon={Headset} onPress={handleSetEarPhone} isSelected={isEarPhone} />
        </View>
      </View>
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.seccond,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 5,
  },
  artist: {
    fontSize: 14,
    color: Colors.primary,
  },
  image: {
    width: 350,
    height: 350,
    borderRadius: 20,
  },
  firstFlex: {
    flex: 0.6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  seccondFlex: {
    flex: 0.4,
    paddingHorizontal: 40,
  },
  infoBlock: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  slider: {
    height: 5,
  },
  controlContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  iconButton: {
    width: 35,
    height: 35,
  },
  iconCenter: {
    width: 60,
    height: 60,
  },
  durationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
})
