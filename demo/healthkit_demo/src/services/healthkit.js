/**
 * Created by NL on 08/06/2022.
 */
import AppleHealthKit from 'react-native-health';

export const permissions = {
  permissions: {
    read: [
      AppleHealthKit.Constants.Permissions.ActiveEnergyBurned,
      AppleHealthKit.Constants.Permissions.ActivitySummary,
      AppleHealthKit.Constants.Permissions.Workout,
    ],
  },
};

export const initHealthKit = callback => {
  AppleHealthKit.initHealthKit(permissions, (error: string) => {
    /* Called after we receive a response from the system */

    if (error) {
      console.log('[ERROR] Cannot grant permissions!');
      return;
    }
    callback?.();
  });
};
