import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
// import LottieView from 'lottie-react-native';

const NatureBackground = () => {
  return (
    <View style={styles.background} pointerEvents="none">
      {/*
      <LottieView
        source={require('../../assets/lottie/grass.json')}
        autoPlay
        loop
        style={{ width: '100%', height: 300 }}
      />
      */}
      {/* Placeholder voor animatie */}
      <View style={{ height: 120, backgroundColor: '#DFF2E1', borderBottomLeftRadius: 60, borderBottomRightRadius: 60, opacity: 0.7 }} />
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: Dimensions.get('window').height,
    zIndex: -1,
  },
});

export default NatureBackground; 