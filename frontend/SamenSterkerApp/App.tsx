import React from 'react';
import { SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import NatureBackground from './src/components/NatureBackground';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#DFF2E1' }}>
      <NatureBackground />
      <AppNavigator />
      <StatusBar style="dark" />
    </SafeAreaView>
  );
}
