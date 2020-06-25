import React, {useState, useEffect} from 'react';
import {
  GoogleSignin,
  statusCodes,
  User,
} from '@react-native-community/google-signin';
import {TouchableOpacity, StyleSheet, Image, Text, View} from 'react-native';

interface GoogleSigninButtonProps {
  onLoginSuccess: (user: User) => void;
}

export const GoogleSigninButton: React.FC<GoogleSigninButtonProps> = (
  props,
) => {
  const [error, setError] = useState<string | null>(null);

  // rimuove il messaggio di errore dopo 3 secondi
  useEffect(() => {
    if (error === null) return;
    const timer = setTimeout(() => setError(null), 3000);
    return () => clearTimeout(timer);
  }, [error]);

  const singInWithGoogle = async () => {
    setError(null);
    try {
      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
      const userInfo = await GoogleSignin.signIn();
      // chiama il callback
      props.onLoginSuccess(userInfo);
      // in caso di errore:
    } catch (error) {
      // renderizza un messaggio di errore
      if (error.code === statusCodes.IN_PROGRESS)
        setError("L'operazione è già in corso");
      else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE)
        setError(
          'I Google Play Services non sono disponibili o devono essere aggiornati.',
        );
      else if (error.code !== statusCodes.SIGN_IN_CANCELLED)
        setError('È stato riscontrato un errore. Riprova più tardi.');
    }
  };

  return (
    <View>
      <TouchableOpacity style={styles.googleButton} onPress={singInWithGoogle}>
        <Image
          source={require('../../assets/images/google-logo.png')}
          style={styles.googleLogo}
        />
        <Text style={styles.text}>Accedi con Google</Text>
      </TouchableOpacity>
      <Text style={styles.errorMsg}>{error}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  googleButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(171, 180, 189, 0.65)',
    borderRadius: 4,
    backgroundColor: '#fff',
    shadowColor: 'rgba(171, 180, 189, 0.35)',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 1,
    shadowRadius: 40,
    elevation: 3,
  },
  googleLogo: {
    width: 16,
    height: 16,
    marginRight: 15,
  },
  text: {
    fontWeight: 'bold',
    color: '#606060',
  },
  errorMsg: {
    marginTop: 8,
    textAlign: 'center',
    color: '#ff0033',
  },
});
