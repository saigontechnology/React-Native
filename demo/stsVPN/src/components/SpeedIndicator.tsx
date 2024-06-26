// src/components/SpeedIndicator.tsx
import React from 'react';
import {StyleSheet, View, Text} from 'react-native';

interface SpeedIndicatorProps {
  downloadSpeed: string;
  uploadSpeed: string;
}

const SpeedIndicator: React.FC<SpeedIndicatorProps> = ({
  downloadSpeed,
  uploadSpeed,
}) => {
  return (
    <View style={styles.speedContainer}>
      <View style={styles.speedIndicator}>
        <Text style={styles.speedLabel}>Download</Text>
        <Text style={styles.speedValue}>{downloadSpeed} Mbps</Text>
      </View>
      <View style={styles.speedIndicator}>
        <Text style={styles.speedLabel}>Upload</Text>
        <Text style={styles.speedValue}>{uploadSpeed} Mbps</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  speedContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  speedIndicator: {
    alignItems: 'center',
    marginVertical: 30,
  },
  speedValue: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  speedLabel: {
    color: '#fff',
    marginBottom: 10,
  },
});

export default SpeedIndicator;
