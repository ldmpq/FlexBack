import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, AppState } from 'react-native';
import { Feather } from '@expo/vector-icons';

const TimerWidget = React.memo(({ startTimeRef }: { startTimeRef: React.MutableRefObject<Date | null> }) => {
  const [timerString, setTimerString] = useState("00:00");

  useEffect(() => {
    const updateTimer = () => {
      if (!startTimeRef.current) return;

      const now = new Date();
      const diff = now.getTime() - startTimeRef.current.getTime();
      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setTimerString(`${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
    };

    updateTimer();

    const interval = setInterval(updateTimer, 1000);
    
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') updateTimer();
    });

    return () => {
      clearInterval(interval);
      subscription.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
       <Feather name="clock" size={13} color="#009688" style={{marginRight: 4}} />
       <Text style={styles.timerText}>{timerString}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0f2f1', 
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  },
  timerText: {
    color: '#009688',
    fontWeight: 'bold',
    fontSize: 13,
    includeFontPadding: false
  }
});

export default TimerWidget;