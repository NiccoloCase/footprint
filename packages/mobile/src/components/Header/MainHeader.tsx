import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

export const MainHeader = () => {
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft} />
      <Text style={styles.headerTitle}>Footprint</Text>
      <View style={styles.headerRight} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flex: 1,
  },
  headerTitle: {
    flex: 3,
    fontWeight: 'bold',
    fontSize: 20,
    color: '#fff',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});
