import moment from 'moment';

/**
 * Created by NL on 08/06/2022.
 */
export const formatHealthKitData = (
  arr,
  endDateKey,
  valueKey = 'value',
  initialValue = [],
) => {
  if (arr?.length > 0) {
    let format = arr
      ?.map(i => {
        return {
          ...i,
          weekDay:
            moment(i[endDateKey]).day() === 0
              ? 1
              : moment(i[endDateKey]).day() + 1,
          value: +i[valueKey]?.toFixed(2),
        };
      })
      .sort(({weekDay: a}, {weekDay: b}) => a - b);
    format = format.reduce((a, b) => {
      const weekDay = b.weekDay;
      const found = a.find(i => i.weekDay === weekDay);
      if (found) {
        found.value += b.value;
      } else {
        a.push(b);
      }
      return a;
    }, []);
    return format;
  } else {
    return initialValue;
  }
};
