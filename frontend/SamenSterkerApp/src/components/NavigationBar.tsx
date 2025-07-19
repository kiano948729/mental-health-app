import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
// Je kunt @expo/vector-icons gebruiken voor echte iconen

const tabs = [
  { label: 'Home', icon: '🌿' },
  { label: 'Chat', icon: '💬' },
  { label: 'Delen', icon: '📖' },
  { label: 'Profiel', icon: '🧘' },
];

interface NavigationBarProps {
  activeTab: number;
  onTabPress: (idx: number) => void;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ activeTab, onTabPress }) => {
  return (
    <View style={styles.container}>
      {tabs.map((tab, idx) => (
        <TouchableOpacity key={tab.label} onPress={() => onTabPress(idx)} style={styles.tab}>
          <Text style={[styles.icon, activeTab === idx && styles.active]}>{tab.icon}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingVertical: 12,
    shadowColor: '#9DC183',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  tab: {
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    fontSize: 28,
    color: '#9DC183',
    opacity: 0.7,
  },
  active: {
    color: '#3E3E3E',
    opacity: 1,
  },
});

export default NavigationBar; 