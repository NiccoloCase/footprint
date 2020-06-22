import React from 'react';
import {View, Text, Button} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {DrawerScreenProps} from '@react-navigation/drawer';
import {HomeStackParamList, DrawerParamList} from '../../navigation';

type HomeScreenProps = StackScreenProps<HomeStackParamList, 'Home'> &
  DrawerScreenProps<DrawerParamList, 'Home'>;

export const HomeScreen: React.FC<HomeScreenProps> = ({navigation}) => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Button title="Drawer" onPress={() => navigation.toggleDrawer()} />
      <Text>Home</Text>
    </View>
  );
};
