import {StyleSheet} from 'react-native'
import {metrics, colors, fonts} from '../../themes'

export const styles = StyleSheet.create({
  localStream: {
    flex: 1,
    marginVertical: metrics.huge,
  },
  flex: {
    flex: 1,
  },
  remoteControlWithCameraOn: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: metrics.massive + metrics.huge,
  },
  noCamera: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '65%',
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  input: {
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: metrics.borderRadius,
    marginRight: metrics.small,
    paddingHorizontal: metrics.small,
    fontFamily: fonts.bold,
    flex: 1,
    color: colors.dark,
  },
  nameInput: {
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: metrics.borderRadius,
    padding: metrics.small,
    fontFamily: fonts.bold,
    color: colors.dark,
    marginHorizontal: metrics.small,
    marginTop: metrics.small,
  },
  button: {
    padding: metrics.small,
    marginTop: metrics.small,
    marginHorizontal: metrics.small,
    borderRadius: metrics.borderRadius,
    backgroundColor: colors.dark,
  },
  buttonTitle: {
    color: colors.white,
    fontFamily: fonts.bold,
  },
  buttonDisabled: {
    backgroundColor: colors.lightGray,
  },
  noCameraInRoom: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.lightGray,
    borderWidth: 1,
    borderColor: colors.border,
  },
  borderWidthDisplay: {},
  joinContainer: {
    flexDirection: 'row',
    padding: metrics.small,
  },
  joinButton: {
    padding: metrics.small,
    borderRadius: metrics.borderRadius,
    backgroundColor: colors.dark,
  },
  flexWrap: {
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  controlContainer: {
    backgroundColor: colors.dark,
    position: 'absolute',
    bottom: metrics.xxl,
    left: 0,
    right: 0,
    padding: metrics.xxs,
    borderRadius: metrics.borderRadiusLarge,
  },
  localControl: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: metrics.large,
  },
  remoteControlContainer: {
    position: 'absolute',
    bottom: metrics.massive + metrics.huge,
  },
  spacingBottom: {
    marginBottom: metrics.small,
  },
  noUsersContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noUserText: {
    color: colors.dark,
    textAlign: 'center',
  },
})
