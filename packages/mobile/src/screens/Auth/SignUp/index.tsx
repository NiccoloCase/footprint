import React from 'react';
import {View, Text, Button} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {AuthStackParamList} from '../../../navigation';

type SignUpScreenProps = StackScreenProps<AuthStackParamList, 'SignUp'>;

export const SignUpScreen: React.FC<SignUpScreenProps> = ({navigation}) => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>SignUp</Text>
      <Button title="Accedi" onPress={() => navigation.push('SignIn')}></Button>
    </View>
  );
};
