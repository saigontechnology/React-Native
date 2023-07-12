import React from 'react'
import {StyleSheet, View, TextInput} from 'react-native'
import {responsiveHeight, responsiveWidth} from '../themes/metrics'
import Icon from 'react-native-vector-icons/Ionicons'
import {TouchableOpacity} from 'react-native-gesture-handler'
import {colors} from '../themes'

function SearchBar({value, onChangeText, placeholder, style, ...rest}) {
  const onClear = () => {
    onChangeText('')
  }

  return (
    <View style={[styles.container, style]}>
      <View style={styles.icon}>
        <Icon color={'rgba(60,60,67,0.6)'} name="search" size={17} />
      </View>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.black}
        {...rest}
      />
      {value ? (
        <TouchableOpacity onPress={onClear} style={[styles.btnClose]}>
          <Icon color={'rgba(60,60,67,0.6)'} name="close-circle" size={20} />
        </TouchableOpacity>
      ) : null}
    </View>
  )
}

SearchBar.defaultProps = {
  placeholder: 'Search',
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'relative',
    height: responsiveHeight(36),
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'rgba(118,118,128,0.12)',
    borderRadius: 8,
  },
  icon: {
    width: responsiveWidth(30),
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    height: responsiveHeight(36),
    paddingVertical: 0,
  },
  btnClose: {
    width: responsiveWidth(30),
    height: '100%',
    justifyContent: 'center',
  },
  hideView: {
    display: 'none',
  },
})

export default React.memo(SearchBar)
