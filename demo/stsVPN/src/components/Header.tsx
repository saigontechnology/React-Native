// src/components/Header.tsx
import React from 'react';
import {StyleSheet, View, TouchableOpacity, Text} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Header: React.FC = () => {
  return (
    <View style={styles.header}>
      <Icon name="vpn-key" size={24} color="#fff" />
      <TouchableOpacity style={styles.premiumButton}>
        <Text style={styles.premiumText}>Premium</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  premiumButton: {
    backgroundColor: '#2a2a50',
    padding: 10,
    borderRadius: 20,
  },
  premiumText: {
    color: '#ffdf00',
    fontWeight: 'bold',
  },
});

export default Header;
