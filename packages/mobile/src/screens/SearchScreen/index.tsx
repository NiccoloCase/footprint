import React from 'react';
import {View, Text, Button} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {SearchStackParamList, HomeStackParamList} from '../../navigation';

type SearchScreenProps = StackScreenProps<
  SearchStackParamList & HomeStackParamList,
  'Search'
>;

export const SearchScreen: React.FC<SearchScreenProps> = ({navigation}) => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>CERCA</Text>
      <Button
        onPress={() => navigation.navigate('Home')}
        title="Vai alla home"
      />
    </View>
  );
};
