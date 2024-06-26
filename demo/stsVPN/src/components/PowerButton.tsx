// src/components/PowerButton.tsx
import React from 'react';
import {StyleSheet, View, TouchableOpacity, Image, Text} from 'react-native';

interface PowerButtonProps {
  onPress: () => void;
  isPressingButton: boolean;
}

const PowerButton: React.FC<PowerButtonProps> = ({
  onPress,
  isPressingButton,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.powerButtonContainer}>
        <TouchableOpacity style={styles.powerButton} onPress={onPress}>
          {isPressingButton ? (
            <View style={styles.disconnect}>
              <Text style={styles.textDisconnect}>Disconnect</Text>
            </View>
          ) : (
            <Image
              style={styles.image}
              source={require('../../images/power-button.png')}
            />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 30,
  },
  powerButtonContainer: {
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
  },
  powerButton: {
    margin: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 140,
    height: 140,
  },
  disconnect: {
    padding: 10,
    borderRadius: 10,
    borderColor: '#fff',
    borderWidth: 2,
    width: 140,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textDisconnect: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default PowerButton;
