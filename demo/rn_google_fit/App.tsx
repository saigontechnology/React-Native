import React, {useCallback, useState} from 'react';
import {Button, StyleSheet, View} from 'react-native';
import GoogleFit, {BucketUnit, Scopes} from 'react-native-google-fit';
import {BarChart, Grid, XAxis} from 'react-native-svg-charts';
import * as scale from 'd3-scale';
import {Text} from 'react-native-svg';

type Step = {date: string; value: number};
export const App = () => {
  const [stepList, setStepsList] = useState<Step[]>([]);

  const authorizeGoogleFit = useCallback(async () => {
    const options = {
      scopes: [
        Scopes.FITNESS_ACTIVITY_READ,
        Scopes.FITNESS_ACTIVITY_WRITE,
        Scopes.FITNESS_BODY_READ,
        Scopes.FITNESS_ACTIVITY_READ,
      ],
    };
    return await GoogleFit.authorize(options);
  }, []);

  const handleGetStep = useCallback(async () => {
    const res = await authorizeGoogleFit();
    if (res.success) {
      const opt = {
        startDate: '2023-07-20T00:00:17.971Z', // required ISO8601Timestamp
        endDate: new Date().toISOString(), // required ISO8601Timestamp
        bucketUnit: BucketUnit.DAY, // optional - default "DAY". Valid values: "NANOSECOND" | "MICROSECOND" | "MILLISECOND" | "SECOND" | "MINUTE" | "HOUR" | "DAY"
        bucketInterval: 1, // optional - default 1.
      };
      GoogleFit.getDailyStepCountSamples(opt)
        .then(res => {
          const indexMergeStep = res.findIndex(
            a => a.source === 'com.google.android.gms:merge_step_deltas',
          );
          const steps = res[indexMergeStep].steps;
          setStepsList(steps);
        })
        .catch(err => {
          console.log('Daily steps err >>> ', err);
        });
    }
  }, []);

  const fill = 'rgb(134, 65, 244)';
  // @ts-ignore
  const Labels = ({x, y, bandwidth, data}) =>
    data.map((value: Step, index: number) => {
      return (
        <Text
          key={index}
          x={x(index) + bandwidth / 2}
          y={y(value.value) - 10}
          fill={'black'}
          alignmentBaseline={'middle'}
          textAnchor={'middle'}>
          {value.value}
        </Text>
      );
    });

  return (
    <View style={styles.container}>
      <Button title={'Get Step'} onPress={handleGetStep} />
      <BarChart<Step>
        data={stepList}
        yAccessor={({item}) => item.value}
        contentInset={{top: 30, bottom: 60}}
        style={{flex: 1}}
        svg={{fill}}>
        <Grid belowChart={true} />
        {/*@ts-ignore*/}
        <Labels />
      </BarChart>
      {stepList.length ? (
        <XAxis<Step>
          data={stepList}
          xAccessor={({item}) => item.date}
          scale={scale.scaleBand}
          contentInset={{left: 10, right: 10}}
        />
      ) : null}
      <View style={{flex: 1}} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
  },
});
