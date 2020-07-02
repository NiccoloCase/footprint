import React, {useState, useEffect} from "react";
import {GoogleSignin, statusCodes} from "@react-native-community/google-signin";
import {TouchableOpacity, StyleSheet, Image, Text, View} from "react-native";
import {useNavigation} from "@react-navigation/native";
import {StackNavigationProp} from "@react-navigation/stack";
import {AuthStackParamList} from "../../navigation";
import {useLoginWithGoogleMutation} from "../../generated/graphql";
import {useStoreActions} from "../../store";

interface GoogleSigninButtonProps {
  /** Testo del bottone */
  label?: string;
  /**
   * Funziona che viene chiamata quando l'operazione
   * si concliude con successo
   */
  onSuccess?: () => void;
}

export const GoogleSigninButton: React.FC<GoogleSigninButtonProps> = (
  props,
) => {
  const [error, setError] = useState<string | null>(null);
  const [loginWithGoogle] = useLoginWithGoogleMutation();
  const singin = useStoreActions((actions) => actions.auth.singin);
  const navigation = useNavigation<StackNavigationProp<AuthStackParamList>>();

  // rimuove il messaggio di errore dopo 3 secondi
  useEffect(() => {
    if (error === null) return;
    const timer = setTimeout(() => setError(null), 3000);
    return () => clearTimeout(timer);
  }, [error]);

  /**
   * Mostra la finestra per scegliere l'account con il quale
   * registrarsi
   * @returns Restituisce una promessa che si risolve quando l'utente sceglie
   * l'account nella finestra di dialogo. Viene restituito il token di accesso
   */
  const showGoogleDialog = async (): Promise<string | null> => {
    setError(null);
    try {
      // controlla che siano installati i google Play Services sul dipsositivo
      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
      // ottiene le inforamazioni dell'account google
      await GoogleSignin.signIn();
      const {accessToken} = await GoogleSignin.getTokens();
      return accessToken;

      // In caso di errore:
    } catch (error) {
      // renderizza un messaggio di errore
      if (error.code === statusCodes.IN_PROGRESS)
        setError("L'operazione è già in corso");
      else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE)
        setError(
          "I Google Play Services non sono disponibili o devono essere aggiornati.",
        );
      else if (error.code !== statusCodes.SIGN_IN_CANCELLED)
        setError("È stato riscontrato un errore. Riprova più tardi.");

      return null;
    }
  };

  /**
   * Funziona chimata quando il pulsante viene premuto
   */
  const handleSubmit = async () => {
    // mostra la finestra per l'accesso con google
    // e restituisce il token di accesso
    const access_token = await showGoogleDialog();
    if (!access_token) return;
    // richiede i tokens di accesso all'API
    try {
      const {data, errors} = await loginWithGoogle({
        context: {
          headers: {access_token},
        },
      });

      if (errors || !data)
        return setError("È stato riscontrato un errore. Riprova più tardi.");

      const {
        isRegistrationRequired,
        tokens,
        googleProfile,
      } = data.loginWithGoogle;

      // controlla se l'utente è stato loggato o necessita di completare la registrazione
      if (isRegistrationRequired || !tokens) {
        if (!googleProfile) throw new Error();
        console.log(googleProfile);
        // l'utente deve completare la registrazione del proprio account
        // viene rinderizzatto alla schemrata di registrazione
        navigation.navigate("SignUp", {
          withGoogle: true,
          googleAccessToken: access_token,
          email: googleProfile.email,
          picture: googleProfile.picture,
        });
      } else {
        // completa l'accesso salvando i token nello stato
        const {accessToken, refreshToken} = tokens;
        singin({accessToken, refreshToken});
      }

      // chiama il callback
      if (typeof props.onSuccess === "function") props.onSuccess();
    } catch (err) {
      setError("È stato riscontrato un errore. Riprova più tardi.");
    }
  };

  return (
    <View>
      <TouchableOpacity style={styles.googleButton} onPress={handleSubmit}>
        <Image
          source={require("../../assets/images/google-logo.png")}
          style={styles.googleLogo}
        />
        <Text style={styles.text}>{props.label || "Accedi con Google"}</Text>
      </TouchableOpacity>
      <Text style={styles.errorMsg}>{error}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  googleButton: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(171, 180, 189, 0.65)",
    borderRadius: 4,
    backgroundColor: "#fff",
    shadowColor: "rgba(171, 180, 189, 0.35)",
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
    fontWeight: "bold",
    color: "#606060",
  },
  errorMsg: {
    marginTop: 8,
    textAlign: "center",
    color: "#ff0033",
  },
});
