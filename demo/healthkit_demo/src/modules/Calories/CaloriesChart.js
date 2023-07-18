/**
 * Created by NL on 07/06/2022.
 */
import React, {useCallback, useMemo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryContainer,
  VictoryLine,
  VictoryStack,
} from 'victory-native';
import {deviceWidth, responsiveHeight} from '../../theme/Metrics';
import {Colors, Images} from '../../theme';
import {LinesChart} from './constants';
import {Text} from '../../common';
import moment from 'moment';
import {Fonts} from '../../theme/Fonts';
import {CaloriesButton} from './component';

const BAR_WIDTH = 18;
const TOOLTIP_WIDTH = 200;

export const CaloriesChart = ({
  activeBurned,
  workouts,
  fetchMessageTypes,
  fetchLessons,
  handleChangeScrollAble,
}) => {
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const yAxis = [0, 1000, 2000, 3000, 4000];

  const [isShowTooltip, setShowTooltip] = useState(false);
  const [touchLocationX, setTouchLocationX] = useState(0);
  const [selectedData, setSelectedData] = useState({});

  const barLine = useMemo(() => {
    return activeBurned?.map(i => ({...i, value: 40}));
  }, [activeBurned]);

  const calculateXTooltip = useMemo(() => {
    const {x} = selectedData;
    switch (touchLocationX) {
      case 1:
        return 0;
      case 2:
      case 3:
      case 4:
        return x - 40;
      case 5:
      case 6:
      case 7:
        return deviceWidth() - 40 - TOOLTIP_WIDTH;
    }
  }, [touchLocationX, selectedData]);

  const calculateXTriangle = useMemo(() => {
    switch (touchLocationX) {
      case 1:
      case 2:
      case 3:
      case 4:
        return 20;
      case 5:
        return 50;
      case 6:
        return 105;
      case 7:
        return 160;
    }
  }, [touchLocationX]);

  const caloriesBurned = useMemo(() => {
    const {datum} = selectedData;
    return {
      workoutCal: workouts.find(w => w.weekDay === datum?.weekDay)?.value || 0,
      activeBurnedCal:
        activeBurned.find(a => a.weekDay === datum?.weekDay)?.value || 0,
    };
  }, [activeBurned, selectedData, workouts]);

  const renderTooltip = useCallback(() => {
    const {datum} = selectedData;
    if (datum?.weekDay && isShowTooltip) {
      const workoutCal =
        workouts.find(w => w.weekDay === datum.weekDay)?.value || 0;
      const activeBurnedCal =
        activeBurned.find(a => a.weekDay === datum.weekDay)?.value || 0;

      return (
        <View style={[styles.infoContainer, {left: calculateXTooltip}]}>
          <View>
            <Text textStyle={styles.blackText}>
              {workoutCal + activeBurnedCal}
            </Text>
            <View style={styles.unitContainer}>
              <Text textStyle={styles.grayText}>Kcal Burned</Text>
              <View style={styles.circle} />
              <Text textStyle={styles.grayText}>
                {moment(datum?.end || datum?.endDate).format('DD MMM')}
              </Text>
            </View>
          </View>
          <View
            style={[
              styles.triangle,
              {
                left: calculateXTriangle,
              },
            ]}
          />
        </View>
      );
    }
    return null;
  }, [
    activeBurned,
    calculateXTooltip,
    calculateXTriangle,
    isShowTooltip,
    selectedData,
    workouts,
  ]);

  const selectedLine = useMemo(() => {
    return [
      {x: touchLocationX, y: 0},
      {x: touchLocationX, y: 1000},
      {x: touchLocationX, y: 2000},
      {x: touchLocationX, y: 3000},
      {x: touchLocationX, y: 4000},
      {x: touchLocationX, y: 4300},
    ];
  }, [touchLocationX]);

  return (
    <View style={styles.container}>
      {renderTooltip()}
      <View style={styles.content}>
        <VictoryChart
          padding={{left: 28, right: 60, top: 20, bottom: 50}}
          width={deviceWidth()}
          events={[
            {
              childName: ['bar-1', 'bar-2'],
              target: 'data',
              eventHandlers: {
                onPress: () => {
                  return [
                    {
                      childName: ['bar-1', 'bar-2'],
                      mutation: props => {
                        if (props?.datum?.weekDay) {
                          setSelectedData(props);
                          setShowTooltip(true);
                          setTouchLocationX(props?.datum?.weekDay);
                        }
                      },
                    },
                  ];
                },
              },
            },
          ]}
          containerComponent={
            <VictoryContainer
              onTouchStart={() => handleChangeScrollAble(false)}
              onTouchEnd={() => handleChangeScrollAble(true)}
            />
          }>
          <VictoryAxis
            dependentAxis
            tickValues={yAxis}
            tickFormat={x => (x === 0 ? '0' : `${x / 1000}k`)}
            style={styles.axisStyles}
          />
          <VictoryAxis
            domainPadding={{x: [15, 0]}}
            tickValues={weekDays}
            style={styles.axisStyles}
          />
          <VictoryLine
            style={{
              data: {stroke: Colors.chartLine},
            }}
            data={selectedLine}
          />
          {LinesChart.map((line, index) => (
            <VictoryLine
              key={index}
              style={{
                data: {stroke: Colors.chartLine, strokeWidth: 1.5},
              }}
              data={line}
            />
          ))}
          <VictoryStack>
            <VictoryBar
              name={'bar-1'}
              animate={{
                duration: 500,
                onLoad: {duration: 0},
              }}
              barWidth={BAR_WIDTH}
              style={{
                data: {fill: Colors.orange},
              }}
              data={activeBurned}
              x="weekDay"
              y="value"
              cornerRadius={{
                bottomLeft: 10,
                bottomRight: 10,
                topLeft: 2,
                topRight: 2,
              }}
            />
            <VictoryBar
              animate={{
                duration: 500,
                onLoad: {duration: 0},
              }}
              barWidth={BAR_WIDTH}
              style={{
                data: {fill: Colors.white},
              }}
              data={barLine}
              x="weekDay"
              y="value"
            />
            <VictoryBar
              name={'bar-2'}
              animate={{
                duration: 500,
                onLoad: {duration: 0},
              }}
              barWidth={BAR_WIDTH}
              style={{
                data: {fill: Colors.blue},
              }}
              data={workouts}
              x="weekDay"
              y="value"
              cornerRadius={{
                bottomLeft: 2,
                bottomRight: 2,
                topLeft: 8,
                topRight: 8,
              }}
            />
          </VictoryStack>
        </VictoryChart>
      </View>
      <View style={styles.separateLine} />
      <CaloriesButton
        icon={Images.calories.inActive}
        text={'In-Active Calories Burned'}
        value={caloriesBurned?.activeBurnedCal}
        unit={'BPM'}
        onPress={fetchMessageTypes}
      />
      <CaloriesButton
        containerStyle={{
          marginTop: responsiveHeight(16),
        }}
        icon={Images.calories.workout}
        text={'Workout Calories Burned'}
        value={caloriesBurned?.workoutCal}
        onPress={fetchLessons}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 5,
  },
  separateLine: {
    backgroundColor: Colors.borderColor,
    height: 1,
    marginBottom: 30,
  },
  content: {
    marginTop: 95,
  },
  circle: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: Colors.gray,
    marginHorizontal: 12,
  },
  unitContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  grayText: {
    fontSize: 13,
    color: Colors.grayText,
  },
  blackText: {
    fontSize: 32,
    color: Colors.blackText,
  },
  infoContainer: {
    width: TOOLTIP_WIDTH,
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 4,
    marginTop: 15,
    shadowColor: Colors.black,
    shadowRadius: 20,
    elevation: 20,
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 15},
    paddingVertical: 15,
    position: 'absolute',
  },
  triangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 20,
    borderLeftColor: 'transparent',
    borderRightWidth: 20,
    borderRightColor: 'transparent',
    borderTopColor: Colors.white,
    borderTopWidth: 16,
    position: 'absolute',
    bottom: -10,
    left: 20,
  },
  axisStyles: {
    axis: {stroke: 'none'},
    tickLabels: {
      fill: Colors.grayText,
      fontSize: 11,
      fontFamily: Fonts.SFRegular,
    },
  },
});
