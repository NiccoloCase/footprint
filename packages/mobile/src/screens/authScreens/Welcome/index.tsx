import React from 'react';
import {
  View,
  Text,
  Button,
  ImageBackground,
  StyleSheet,
  Image,
} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {AuthStackParamList} from '../../../navigation';
import {TouchableNativeFeedback} from 'react-native-gesture-handler';

type WelcomeScreenProps = StackScreenProps<AuthStackParamList, 'Welcome'>;

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({navigation}) => {
  return (
    <View style={{flex: 1}}>
      <ImageBackground
        style={styles.imageBackground}
        source={require('../../../assets/images/welcome-screen-background.png')}>
        <View style={styles.overlay} />
      </ImageBackground>
      <View style={styles.wrapper}>
        <Text style={styles.title}>Ciao!</Text>

        <TouchableNativeFeedback
          style={[styles.button, styles.loginButton]}
          onPress={() => navigation.push('SignIn')}>
          <Text style={styles.buttonText}>Accedi</Text>
        </TouchableNativeFeedback>

        <TouchableNativeFeedback
          style={[styles.button, {backgroundColor: '#fff'}]}
          onPress={() => navigation.push('SignUp')}>
          <Text style={[styles.buttonText, {color: '#FF596E'}]}>
            Registrati
          </Text>
        </TouchableNativeFeedback>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    backgroundColor: '#FF596E',
    opacity: 0.6,
    flex: 1,
    alignItems: 'center',
  },
  wrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'column',
    paddingVertical: 70,
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 60,
    color: '#404040',
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  button: {
    width: '100%',
    paddingVertical: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
  },
  loginButton: {
    borderColor: '#fff',
    borderWidth: 3,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
    textTransform: 'uppercase',
  },
});
