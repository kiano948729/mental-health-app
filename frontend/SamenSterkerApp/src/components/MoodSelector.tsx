import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';

const moods = [
  { emoji: '😞', label: 'Slecht' },
  { emoji: '😕', label: 'Matig' },
  { emoji: '😐', label: 'Neutraal' },
  { emoji: '🙂', label: 'Goed' },
  { emoji: '😄', label: 'Top' },
];

interface MoodSelectorProps {
  onSelect?: (mood: number) => void;
}

const MoodSelector: React.FC<MoodSelectorProps> = ({ onSelect }) => {
  const [selected, setSelected] = useState<number | null>(null);
  return (
    <View style={styles.container}>
      {moods.map((m, idx) => (
        <TouchableOpacity
          key={idx}
          onPress={() => {
            setSelected(idx + 1);
            onSelect && onSelect(idx + 1);
          }}
          activeOpacity={0.7}
        >
          <Animated.View style={[styles.emojiWrap, selected === idx + 1 && styles.selected]}>
            <Text style={styles.emoji}>{m.emoji}</Text>
          </Animated.View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
    width: '100%',
    paddingHorizontal: 8,
  },
  emojiWrap: {
    backgroundColor: '#FFF6B0',
    borderRadius: 32,
    padding: 12,
    marginHorizontal: 6,
    shadowColor: '#9DC183',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 2,
    transform: [{ scale: 1 }],
  },
  selected: {
    backgroundColor: '#9DC183',
    shadowOpacity: 0.3,
    transform: [{ scale: 1.2 }],
  },
  emoji: {
    fontSize: 32,
  },
});

export default MoodSelector; 