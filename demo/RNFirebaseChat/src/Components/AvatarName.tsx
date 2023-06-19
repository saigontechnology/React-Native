import React from 'react';
import {StyleProp, StyleSheet, Text, View, ViewStyle} from 'react-native';
import randomColor from 'randomcolor';

interface IAvatarName {
  fullName: string;
  style?: StyleProp<ViewStyle>;
}

const AvatarName: React.FC<IAvatarName> = ({fullName, style}) => {
  const bg = randomColor({seed: fullName});
  const getContrastYIQ = (hexColor: string) => {
    hexColor = hexColor.replace('#', '');
    let r = parseInt(hexColor.substr(0, 2), 16);
    let g = parseInt(hexColor.substr(2, 2), 16);
    let b = parseInt(hexColor.substr(4, 2), 16);
    let yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? 'black' : 'white';
  };

  const getInitials = (string: string) => {
    let names = string.split(' '),
      initials = names[0].substring(0, 1).toUpperCase();

    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }
    return initials;
  };

  return (
    <View style={[styles.container, {backgroundColor: bg}, style]}>
      <Text style={[styles.text, {color: getContrastYIQ(bg)}]}>
        {getInitials(fullName)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 30,
    aspectRatio: 1,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 12,
  },
});

export default React.memo(AvatarName);
