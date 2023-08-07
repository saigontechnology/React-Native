import {StyleSheet, Text} from 'react-native'
import React, {useEffect} from 'react'
import {ScreenContainer} from '../../components/ScreenContainer'
import {responsiveHeight} from '../../themes'
import {useDispatch, useSelector} from 'react-redux'
import {userActions} from '../../store/reducers'
import {getUserInfo} from '../../store/selectors'

export const ProfileScreen = () => {
  const dispatch = useDispatch()
  const profileData = useSelector(getUserInfo) || {}
  console.log('profileData', profileData)
  useEffect(() => {
    dispatch(userActions.getUserProfileHandle({id: ''}))
  }, [dispatch])

  return (
    <ScreenContainer style={styles.container}>
      <Text style={styles.titleText}>ProfileScreen</Text>
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    alignItems: 'center',
  },
  titleText: {
    fontSize: responsiveHeight(25),
    fontWeight: '600',
    marginVertical: responsiveHeight(20),
  },
})
