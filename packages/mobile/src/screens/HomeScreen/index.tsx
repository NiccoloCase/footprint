import React from 'react';
import {View, Text, Button} from 'react-native';
import {MapView} from '../../components/MapView';

export const HomeScreen: React.FC = () => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <View
        style={{
          height: '100%',
          width: '100%',
        }}>
        <MapView />
      </View>
    </View>
  );
};
