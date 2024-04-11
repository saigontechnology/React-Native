import React, {ReactNode, forwardRef, useCallback, useImperativeHandle, useRef} from 'react'
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetProps as RNBottomSheetProps,
} from '@gorhom/bottom-sheet'
import {StyleSheet, View} from 'react-native'
import {colors, metrics, responsiveWidth} from '../themes'

const SNAP_POINTS = ['50%']

export type BottomSheetMethods = {
  open: () => void
  close: () => void
  snapToIndex: (index: number) => void
}

export interface BottomSheetProps extends RNBottomSheetProps {
  showSearchBox?: boolean
  searchValue?: string
  onSearchChange?: (text: string) => void
  children: ReactNode | React.JSX.Element
  snapPoints?: string[]
  onClose?: () => void
}

export const BottomSheet = forwardRef<BottomSheetMethods, BottomSheetProps>(
  ({children, snapPoints = SNAP_POINTS, onClose, ...rest}, ref) => {
    const sheetRef = useRef<BottomSheetModal>(null)

    useImperativeHandle(ref, () => ({
      open: () => {
        sheetRef.current?.present()
      },
      close: () => {
        sheetRef.current?.close()
      },
      snapToIndex: (index: number) => {
        sheetRef.current?.snapToIndex(index)
      },
    }))

    const handleDismiss = useCallback(() => {
      onClose?.()
    }, [onClose])

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => <BottomSheetBackdrop {...props} pressBehavior="none" />,
      [],
    )

    return (
      <BottomSheetModal
        ref={sheetRef}
        index={0}
        snapPoints={snapPoints}
        handleIndicatorStyle={styles.indicator}
        enablePanDownToClose
        onDismiss={handleDismiss}
        backdropComponent={renderBackdrop}
        stackBehavior="push"
        {...rest}>
        <View style={styles.container}>{children}</View>
      </BottomSheetModal>
    )
  },
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    paddingHorizontal: metrics.marginHorizontal,
    backgroundColor: colors.white,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  indicator: {
    backgroundColor: colors.gray700,
    width: responsiveWidth(36),
    borderRadius: metrics.tiny,
    height: metrics.tiny,
  },
})

BottomSheet.displayName = 'BottomSheet'
