import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

interface AiAdviceProps {
  advice: string;
}

const AiAdvice: React.FC<AiAdviceProps> = ({ advice }) => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [advice]);
  return (
    <Animated.View style={[styles.card, { opacity: fadeAnim }]}> 
      <Text style={styles.text}>{advice}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF6B0',
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#9DC183',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 2,
    width: '100%',
  },
  text: {
    color: '#3E3E3E',
    fontSize: 16,
    fontStyle: 'italic',
  },
});

export default AiAdvice; 