import React, {useState, useRef} from "react";
import {GoogleSignin, statusCodes} from "@react-native-community/google-signin";
import {
  TouchableOpacity,
  StyleSheet,
  Image,
  Text,
  View,
  Alert,
} from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import {useNavigation} from "@react-navigation/native";
import {StackNavigationProp} from "@react-navigation/stack";
import {AuthStackParamList} from "../../../navigation";
import {
  useLoginWithGoogleMutation,
  IsEmailAlreadyUsedDocument,
} from "../../../generated/graphql";
import {client} from "../../../graphql";
import {useStoreActions} from "../../../store";
import {Colors} from "../../../styles";

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
  // graphql
  const [loginWithGoogle] = useLoginWithGoogleMutation();
  // stato
  const singin = useStoreActions((actions) => actions.auth.singin);
  // navigazione
  const navigation = useNavigation<StackNavigationProp<AuthStackParamList>>();
  // modal
  const refModal = useRef<RBSheet | null>(null);
  const [modal, setModal] = useState({title: "", body: ""});

  /**
   * Mostra la finestra per scegliere l'account con il quale
   * registrarsi
   * @returns Restituisce una promessa che si risolve quando l'utente sceglie
   * l'account nella finestra di dialogo. Viene restituito il token di accesso
   */
  const showGoogleDialog = async (): Promise<string | null> => {
    try {
      // controlla che siano installati i google Play Services sul dipsositivo
      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
      // esegue l'accesso con google mostrando il dialog
      await GoogleSignin.signIn();
      // ottiene il token di accesso
      const {accessToken} = await GoogleSignin.getTokens();
      // elimina la sessione
      await GoogleSignin.signOut();
      return accessToken;

      // In caso di errore:
    } catch (error) {
      let msg: null | {title: string; body: string} = null;

      // renderizza un messaggio di errore
      if (error.code === statusCodes.IN_PROGRESS)
        msg = {
          title: "L'operazione è già in corso",
          body: "Attendi perfavore",
        };
      else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE)
        msg = {
          title: "Non è possibile continuare",
          body:
            "I Google Play Services non sono disponibili o devono essere aggiornati.",
        };
      else if (error.code !== statusCodes.SIGN_IN_CANCELLED)
        msg = {
          title: "Non è possibile continuare",
          body: "È stato riscontrato un errore. Riprova più tardi.",
        };

      if (!msg) return null;

      // Mostra il messaggio di errore
      if (refModal.current) {
        setModal(msg);
        refModal.current.open();
      } else Alert.alert(msg.title, msg.body);

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

      if (errors || !data) throw new Error();

      const {
        isRegistrationRequired,
        tokens,
        googleProfile,
      } = data.loginWithGoogle;

      // Controlla se l'utente è stato loggato o necessita di completare la registrazione
      if (isRegistrationRequired || !tokens) {
        if (!googleProfile) throw new Error();
        // L'utente non è registrato:
        // Viene per prima cosa controllato se l'email associata all'account
        // google è già stata utilizzata

        const {data, errors} = await client.query({
          query: IsEmailAlreadyUsedDocument,
          variables: {email: googleProfile.email},
        });

        if (!data || errors) throw new Error();

        if (data.isEmailAlreadyUsed) {
          const title = "Non è possibile continuare";
          const body =
            "Non è stato possibile portare a termine la registrazione poiché l'email associata all'account Google selezionato è già utilizzata da un altro utente. Prova ad accedere con la password.";

          if (refModal.current) {
            setModal({title, body});
            refModal.current.open();
          } else {
            Alert.alert(title, body);
          }
        } else {
          // L'email non è già stata utilizzata. L'utente può quindi proseguire con
          // la registrazione:
          // Viene rinderizzatto alla schermata di registrazione
          navigation.navigate("SignUp", {
            withGoogle: true,
            email: googleProfile.email,
            googleAccessToken: access_token,
            picture: googleProfile.picture,
          });
        }
      } else {
        // Completa l'accesso salvando i token nello stato
        const {accessToken, refreshToken} = tokens;
        singin({accessToken, refreshToken});
      }

      // Chiama il callback
      if (typeof props.onSuccess === "function") props.onSuccess();
    } catch (err) {
      const title = "Non è possibile continuare";
      const body = "È stato riscontrato un errore. Riprova più tardi.";

      if (refModal.current) {
        setModal({title, body});
        refModal.current.open();
      } else {
        Alert.alert(title, body);
      }
    }
  };

  return (
    <>
      {/** BOTTONE */}
      <View>
        <TouchableOpacity style={styles.googleButton} onPress={handleSubmit}>
          <Image
            source={require("../../../assets/images/google-logo.png")}
            style={styles.googleLogo}
          />
          <Text style={styles.text}>{props.label || "Accedi con Google"}</Text>
        </TouchableOpacity>
      </View>
      {/** POP-UP */}
      <RBSheet
        ref={refModal}
        animationType="fade"
        customStyles={{container: {elevation: 100}}}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>{modal.title}</Text>
          <Text style={styles.modal}>{modal.body}</Text>
          <View style={styles.modalButtonContainer}>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => refModal.current!.close()}>
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </RBSheet>
    </>
  );
};

const styles = StyleSheet.create({
  googleButton: {
    maxWidth: 500,
    width: "100%",
    height: 55,
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
    borderRadius: 10,
    backgroundColor: "#EAEEF4",
    /*hadowColor: "rgba(171, 180, 189, 0.35)",
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 1,
    shadowRadius: 40,
    elevation: 3,*/
  },
  googleLogo: {
    width: 16,
    height: 16,
    marginRight: 15,
  },
  text: {
    fontWeight: "bold",
    color: "#707070",
  },
  // MODAL:
  modalContainer: {
    flex: 1,
    padding: 25,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.primary,
  },
  modal: {
    fontSize: 17,
    lineHeight: 24,
    marginVertical: 20,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  modalButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderWidth: 2,
    borderRadius: 2,
    borderColor: Colors.primary,
    marginLeft: 10,
  },
  modalButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: "bold",
  },
});
