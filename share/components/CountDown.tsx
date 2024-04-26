import React, {useCallback, useEffect, useRef, useState} from 'react'
import {StyleProp, StyleSheet, TextStyle, View, ViewStyle} from 'react-native'
import dayjs from 'dayjs'
import {colors} from '../themes'
import {Text} from 'rn-base-component'

export interface Props {
  style?: StyleProp<ViewStyle>
  digitStyle?: StyleProp<ViewStyle>
  digitTxtStyle?: StyleProp<TextStyle>
  timeToShow?: string[]
  separatorStyle?: StyleProp<TextStyle>
  showSeparator?: boolean
  until?: number
  size?: number
  running?: boolean
  onFinish?: () => void
  countDownTo?: dayjs.Dayjs
}

export const CountDown: React.FC<Props> = ({
  style,
  until = 0,
  size = 14,
  timeToShow = ['D', 'H', 'M', 'S'],
  separatorStyle,
  showSeparator = true,
  digitStyle,
  digitTxtStyle,
  running = true,
  onFinish,
  countDownTo,
}) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [countDown, setCountDown] = useState(Math.max(until, 0))

  const updateTimer = useCallback(() => {
    if (!running) {
      return
    }
    if (countDown === 1) {
      if (onFinish) {
        onFinish()
      }
    }

    if (countDown === 0) {
      setCountDown(0)
    } else {
      setCountDown(Math.max(0, countDown - 1))
    }
  }, [countDown, onFinish, running])

  const updateCountDownTimer = useCallback(() => {
    if (countDownTo) {
      const count = Math.max(0, countDownTo.diff(dayjs(), 'seconds'))
      setCountDown(count)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      if (count > 0) {
        // Get current millisecond to calculate time left for next seconds change
        const milliSecond = 1000 - dayjs().millisecond()
        timeoutRef.current = setTimeout(() => {
          updateCountDownTimer()
        }, milliSecond)
      }
    }
  }, [countDownTo])

  useEffect(() => {
    if (countDownTo) {
      updateCountDownTimer()
    } else {
      timerRef.current = setInterval(updateTimer, 1000)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [countDownTo, updateCountDownTimer, updateTimer])

  const getTimeLeft = useCallback(() => {
    const padStart = (n: number) => (timeToShow.length > 1 && n < 10 ? '0' : '') + n
    return {
      seconds: padStart(countDown % 60),
      minutes: padStart(parseInt(`${countDown / 60}`, 10) % 60),
      hours: padStart(parseInt(`${countDown / (60 * 60)}`, 10) % 24),
      days: padStart(parseInt(`${countDown / (60 * 60 * 24)}`, 10)),
    }
  }, [countDown, timeToShow.length])

  const renderDigit = useCallback(
    (d: string) => (
      <Text color={colors.gray500} style={[{fontSize: size}, digitTxtStyle]}>
        {timeToShow.length === 1 ? `(${d}s)` : d}
      </Text>
    ),
    [digitStyle, digitTxtStyle, size, timeToShow],
  )

  const renderDoubleDigits = (digits: string) => (
    <View style={styles.doubleDigitCont}>
      <View style={styles.timeInnerCont}>{renderDigit(digits)}</View>
    </View>
  )

  const renderSeparator = useCallback(() => <Text style={separatorStyle}>:</Text>, [separatorStyle, size])

  const renderCountDown = () => {
    const {days, hours, minutes, seconds} = getTimeLeft()

    return (
      <View style={styles.timeCont}>
        {timeToShow.includes('D') && renderDoubleDigits(days.toString())}
        {showSeparator && timeToShow.includes('D') && timeToShow.includes('H') ? renderSeparator() : null}
        {timeToShow.includes('H') && renderDoubleDigits(hours.toString())}
        {showSeparator && timeToShow.includes('H') && timeToShow.includes('M') ? renderSeparator() : null}
        {timeToShow.includes('M') && renderDoubleDigits(minutes.toString())}
        {showSeparator && timeToShow.includes('M') && timeToShow.includes('S') && renderSeparator()}
        {timeToShow.includes('S') && renderDoubleDigits(seconds.toString())}
      </View>
    )
  }

  return <View style={style}>{renderCountDown()}</View>
}

const styles = StyleSheet.create({
  timeCont: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  timeTxt: {
    backgroundColor: 'transparent',
  },
  timeInnerCont: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  doubleDigitCont: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  separatorContainer: {justifyContent: 'center', alignItems: 'center'},
})
