// src/components/CountrySelector.tsx
import React from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Country} from './ModalBottom';

interface CountrySelectorProps {
  onPressCountry: () => void;
  item: Country;
}

const CountrySelector: React.FC<CountrySelectorProps> = ({
  onPressCountry,
  item,
}) => {
  return (
    <TouchableOpacity onPress={onPressCountry} style={styles.container}>
      <Image source={item.uri} style={styles.flag} />
      <View style={styles.textContainer}>
        <Text style={styles.countryText}>{item.country}</Text>
        <Text style={styles.ipText}>{item.ip}</Text>
      </View>
      <Icon name="chevron-right" size={24} color="gray" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ccecac',
    padding: 20,
    borderRadius: 30,
  },
  flag: {
    width: 30,
    height: 20,
    marginRight: 10,
    borderRadius: 5,
  },
  textContainer: {
    flex: 1,
  },
  countryText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  ipText: {
    fontSize: 12,
    marginTop: 3,
  },
});

export default CountrySelector;
