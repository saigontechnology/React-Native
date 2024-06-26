import React, {useState, useEffect, useCallback} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import PowerButton from './PowerButton';

interface ConnectingTimeProps {
  onToggleTimer: (isRunning: boolean) => void;
  isRunningTimer: boolean;
  isError: boolean;
}

const ConnectingTime: React.FC<ConnectingTimeProps> = ({
  onToggleTimer,
  isRunningTimer,
  isError,
}) => {
  const [timeInSeconds, setTimeInSeconds] = useState(0);
  const [timeFormatted, setTimeFormatted] = useState('00:00:00');
  const [timerRunning, setTimerRunning] = useState(false);
  const timerIntervalRef = React.useRef<NodeJS.Timeout | null>(null);
  // const [isPressPowerButton, setIsPressPowerButton] = useState(false);

  const updateTimeFormatted = useCallback(() => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;

    const formattedTime = `${padNumber(hours)}:${padNumber(
      minutes,
    )}:${padNumber(seconds)}`;
    setTimeFormatted(formattedTime);
  }, [timeInSeconds]);

  const padNumber = (num: number) => {
    return num.toString().padStart(2, '0');
  };

  const handleToggleTimer = () => {
    onToggleTimer?.(isRunningTimer);
  };

  const stopTimer = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  };

  const resetTimer = useCallback(() => {
    setTimeInSeconds(0);
    setTimerRunning(false);
    updateTimeFormatted();
    stopTimer();
  }, [updateTimeFormatted]);

  useEffect(() => {
    console.log('isRunningTimer: ', isRunningTimer);
    if (!isRunningTimer) {
      resetTimer();
      // setIsPressPowerButton(false);
    } else {
      setTimerRunning(true);
      // setIsPressPowerButton(true);
    }
  }, [isRunningTimer, resetTimer]);

  useEffect(() => {
    if (timerRunning) {
      timerIntervalRef.current = setInterval(() => {
        setTimeInSeconds(prev => prev + 1);
        updateTimeFormatted();
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [timerRunning, updateTimeFormatted]);

  return (
    <View style={styles.timeContainer}>
      <Text style={styles.timeText}>Connecting Time</Text>
      <Text style={styles.time}>{timeFormatted}</Text>
      <PowerButton
        isPressingButton={isRunningTimer}
        onPress={handleToggleTimer}
      />
      {isError && (
        <View style={styles.status}>
          <Text style={styles.textStatus}>Error: Can't connect VPN</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  timeContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  timeText: {
    color: '#fff',
    fontSize: 16,
    marginVertical: 10,
  },
  time: {
    color: '#fff',
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  status: {
    marginTop: 10,
  },
  textStatus: {
    color: 'red',
  },
});

//export memoized component
export default React.memo(ConnectingTime);
