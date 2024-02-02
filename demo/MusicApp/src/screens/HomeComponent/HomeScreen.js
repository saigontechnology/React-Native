import {useNavigation} from '@react-navigation/native'
import React, {useCallback, useEffect, useState} from 'react'
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import TrackPlayer, {Capability, State} from 'react-native-track-player'
import {MUSIC_LIBRARIES} from '../../assets/musiclibrary'
import {ScreenContainer} from '../../components'
import Tracker from '../../components/Tracker'
import RouteKey from '../../navigation/RouteKey'
import {Colors} from '../../utilities/colors'
import {convertTime} from '../../utilities/utils'

const HomeScreen = () => {
  const navigation = useNavigation()
  const [songSelected, setSongSelected] = useState({})
  const [isPlaying, setIsPlaying] = useState(false)

  const getCurrentTrack = useCallback(async () => {
    let trackIndex = await TrackPlayer.getCurrentTrack()
    let trackObject = await TrackPlayer.getTrack(trackIndex)
    return trackObject
  }, [])

  const handleSetSelectedSong = useCallback(async () => {
    let trackIndex = await TrackPlayer.getCurrentTrack()
    let trackObject = await TrackPlayer.getTrack(trackIndex)
    setSongSelected(trackObject)
  }, [])

  const handleSelect = async song => {
    const currentTrack = await getCurrentTrack()
    TrackPlayer.skip(song.id)
    if (currentTrack?.id !== song?.id) {
      await handleSetSelectedSong()
    }
    handleOnPlay()
  }

  const handleOnPlay = async song => {
    const state = await TrackPlayer.getState()
    const currentTrack = await getCurrentTrack()
    const isCurrentTrack = currentTrack?.id === song?.id
    if (state === State.Paused && isCurrentTrack) {
      setIsPlaying(!isPlaying)
      TrackPlayer.play()
      setSongSelected(song)
      return
    }
    if (state === State.Playing && isCurrentTrack) {
      setIsPlaying(!isPlaying)
      TrackPlayer.pause()
      setSongSelected(song)
      return
    }
    setIsPlaying(true)
    TrackPlayer.play()
  }

  const handleOnPrev = async () => {
    const index = MUSIC_LIBRARIES.findIndex(item => item.id === songSelected.id)
    if (index > 0) {
    }

    if (index === 0) {
    }

    TrackPlayer.skipToPrevious()
    await handleSetSelectedSong()
    handleOnPlay()
  }

  const handleOnNext = async () => {
    const index = MUSIC_LIBRARIES.findIndex(item => item.id === songSelected.id)
    if (index < MUSIC_LIBRARIES.length - 1) {
    }

    if (index === MUSIC_LIBRARIES.length - 1) {
    }

    TrackPlayer.skipToNext()
    await handleSetSelectedSong()
    handleOnPlay()
  }

  useEffect(() => {
    const handleSetupTrackPlayer = async () => {
      await TrackPlayer.setupPlayer({})
      await TrackPlayer.updateOptions({
        stopWithApp: true,
        capabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
          Capability.Stop,
        ],
        compactCapabilities: [Capability.Play, Capability.Pause],
      })
      await TrackPlayer.add(MUSIC_LIBRARIES)
    }
    handleSetupTrackPlayer()
  }, [])

  const renderItem = ({item}) => (
    <TouchableOpacity style={styles.songContainer} onPress={() => handleSelect(item)}>
      <View>
        <Text style={styles.songTitle}>{item.title}</Text>
        <Text style={styles.songArtist}>{item.artist}</Text>
      </View>
      <Text style={styles.songDuration}>{convertTime(item.duration)}</Text>
    </TouchableOpacity>
  )

  const handleOnPressTrackDetail = () => {
    navigation.navigate(RouteKey.TrackDetailScreen)
  }

  return (
    <ScreenContainer style={styles.container}>
      <FlatList keyExtractor={(_, id) => id.toString()} data={MUSIC_LIBRARIES} renderItem={renderItem} />
      {!!Object.keys(songSelected).length && (
        <Tracker
          song={songSelected}
          onPlay={handleOnPlay}
          onPrev={handleOnPrev}
          onNext={handleOnNext}
          isPlaying={isPlaying}
          onPress={handleOnPressTrackDetail}
        />
      )}
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.seccond,
  },
  songContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  songTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  songArtist: {
    fontSize: 12,
  },
  songDuration: {
    fontSize: 12,
    fontWeight: 'bold',
  },
})

export default HomeScreen
