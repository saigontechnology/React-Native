/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect, useState} from 'react';
import type {Node} from 'react';
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  useColorScheme,
} from 'react-native';

import {Header} from './src/common';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {CaloriesWeekComponent} from './src/modules/Calories/component';
import {isIOS} from './src/theme/Metrics';
import {Colors} from './src/theme';
import {CaloriesChart} from './src/modules/Calories';
import {getLessons, getMessageTypes} from './src/utilities/APIManage';
import {initHealthKit} from './src/services/healthkit';
import AppleHealthKit, {HealthValue} from 'react-native-health';
import {formatHealthKitData} from './src/modules/Calories/helper';

const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [workouts, setWorkouts] = useState([{weekDay: 0, value: 0}]);
  const [activeBurned, setActiveBurned] = useState([{weekDay: 0, value: 0}]);
  const [isScrollAble, setScrollAble] = useState(true);

  useEffect(() => {
    handleConnectHealthKit();
  }, []);

  const handleConnectHealthKit = () => {
    if (isIOS()) {
      setTimeout(() => {
        initHealthKit(() => {
          const options = {
            startDate: new Date(2021, 5, 1).toISOString(),
          };
          AppleHealthKit.isAvailable((error, results) => {
            if (results) {
              AppleHealthKit.getActiveEnergyBurned(
                options,
                (callbackError: string, results: HealthValue[]) => {
                  setActiveBurned(
                    formatHealthKitData(results, 'endDate', 'value', [
                      {weekDay: 0, value: 0},
                    ]),
                  );
                },
              );
              AppleHealthKit.getSamples(
                {...options, type: 'Workout'},
                (callbackError: string, results: HealthValue[]) => {
                  setWorkouts(
                    formatHealthKitData(results, 'end', 'calories', [
                      {weekDay: 0, value: 0},
                    ]),
                  );
                },
              );
            }
          });
        });
      }, 2000);
    }
  };

  const fetchMessageTypes = () => {
    getMessageTypes().then(res => {
      Alert.alert('Fetching API success', `URL: ${res?.url}`);
    });
  };

  const fetchLessons = () => {
    getLessons().then(res => {
      Alert.alert('Fetching API success', `URL: ${res?.intro}`);
    });
  };

  const handleChangeScrollAble = value => {
    setScrollAble(value);
  };

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Header title={'Calories Burned'} />
      <ScrollView
        scrollEnabled={isScrollAble}
        style={styles.container}
        contentContainerStyle={styles.content}>
        <CaloriesWeekComponent />
        <CaloriesChart
          handleChangeScrollAble={handleChangeScrollAble}
          activeBurned={activeBurned}
          workouts={workouts}
          fetchMessageTypes={fetchMessageTypes}
          fetchLessons={fetchLessons}
        />
      </ScrollView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 25,
  },
});

export default App;
