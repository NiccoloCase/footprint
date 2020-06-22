import React from 'react';
import {View, Text, Button} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {AuthStackParamList} from '../../../navigation';

type SignInScreenProps = StackScreenProps<AuthStackParamList, 'SignIn'>;

export const SignInScreen: React.FC<SignInScreenProps> = ({navigation}) => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>SignIn</Text>
      <Button
        title="Crea un account"
        onPress={() => navigation.push('SignUp')}></Button>
    </View>
  );
};
