import {useNavigation} from '@react-navigation/native'
import React, {PropsWithChildren} from 'react'
import {StyleSheet, View, ViewStyle, StyleProp, TouchableOpacity} from 'react-native'
import {SvgXml} from 'react-native-svg'

interface IRowProps extends PropsWithChildren {
  hasBackButton?: boolean
  backButtonFill?: string
  style?: StyleProp<ViewStyle>
}

const BackArrowIcon = ({fillColor}: any): JSX.Element => (
  <SvgXml
    xml={`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9.22796 16.6666L16.9506 24.3893L16 25.3333L6.66663 16L16 6.66663L16.9506 7.61063L9.22796 15.3333H25.3333V16.6666H9.22796Z" fill=${
      fillColor || '#7B8794'
    }/>
    </svg>
    `}
  />
)

export const ScreenContainer = ({children, style, hasBackButton, backButtonFill, ...rest}: IRowProps) => {
  const navigation = useNavigation()

  return (
    <View style={[styles.container, style]} {...rest}>
      {hasBackButton && (
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack()
            }
          }}>
          <BackArrowIcon fillColor={backButtonFill || '#fff'} />
        </TouchableOpacity>
      )}
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 9,
    padding: 8,
  },
})
