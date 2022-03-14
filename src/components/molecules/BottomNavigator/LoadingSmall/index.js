import React from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';

const LoadingSmall = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#1ABC9C" />
    </View>
  );
};

export default LoadingSmall;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {fontSize: 18, fontFamily: 'Poppins-Regular', marginTop: 12},
});
