import React, {useRef, useState} from "react";
import {View, Text, StyleSheet, TouchableOpacity} from "react-native";
import {Dialog} from "../Dialog";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import FeatherIcon from "react-native-vector-icons/Feather";
import {Colors} from "../../../styles";
import LottieView from "lottie-react-native";
import {Spinner} from "../../Spinner";
import {useNavigation} from "@react-navigation/native";
import trashIcon from "../../../assets/lottie/trash-success.json";

interface DeletionConfirmationDialogProps {
  // Se il model è apert
  isOpen: boolean;
  // Imposta se il model è aperto
  setIsOpen: (isOpen: boolean) => void;
  // testo del modal
  text: string;
  // Funzione che elimina il contenuto in questione
  deleteContent: () => Promise<void>;
}

export const DeletionConfirmationDialog: React.FC<DeletionConfirmationDialogProps> = ({
  isOpen,
  setIsOpen,
  text,
  deleteContent,
}) => {
  // Se sta caricando
  const [isLoading, setIsLoading] = useState(false);
  // Se l'operazione ha avuto successo o si è verificato un errore
  const [state, setState] = useState<"success" | "error" | null>(null);
  // Icona animata
  const iconRef = useRef<LottieView | null>(null);
  // Navigazione
  const navigation = useNavigation();

  /**
   * Funzione chiamata alla presssione del pulsante per eliminare il contenuto
   */
  const handleDeleteButtonPress = async () => {
    if (isLoading || state === "success") return;
    setIsLoading(true);

    try {
      // Elimina il contenuto
      await deleteContent();
      // Aggiorna lo stato
      setState("success");
      // Avvvia l'animazione dell'icona
      if (iconRef.current) iconRef.current.play();
    } catch (err) {
      setState("error");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Porta l'utente alla home
   */
  const goHome = () => navigation.navigate("Home");

  /**
   * Funzione chiamata alla pressione del pulsante per chiudere il modal
   */
  const handleCloseButton = () => {
    // Porta alla home
    if (state === "success") goHome();
    // Chiude il modal
    else setIsOpen(false);
  };

  return (
    <Dialog isOpen={isOpen} setIsOpen={setIsOpen}>
      {() => (
        <View>
          {/** HEADER */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleCloseButton}>
              <FontAwesome5Icon
                name="times"
                size={22}
                color={Colors.mediumGrey}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.content}>
            {/** ICONA */}
            <LottieView
              ref={iconRef}
              loop={false}
              source={trashIcon}
              resizeMode="cover"
              style={{width: 140, height: 140}}
            />

            {state === "success" ? (
              // ------- SCHERMATA DI SUCCESSO -------
              <>
                {/** TITOLO */}
                <Text style={styles.title}>
                  Eliminazione avvenuta con successo
                </Text>
                <View style={styles.footer}>
                  {/** LINK PER LA HOME */}
                  <TouchableOpacity onPress={goHome} style={styles.linkButton}>
                    <Text
                      style={[
                        styles.buttonText,
                        {color: Colors.successGreen, marginRight: 5},
                      ]}>
                      Vai alla home
                    </Text>
                    <FeatherIcon
                      name="arrow-right"
                      color={Colors.successGreen}
                      size={24}
                    />
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              // ------- SCHERMATA DI CONFERMA -------
              <>
                {/** TITOLO */}
                <Text style={styles.title}>Sei sicuro?</Text>
                {/** TESTO */}
                <Text style={styles.text}>
                  {state === "error"
                    ? "Non è stato possibile poratre a termine l'operazione. Riporva più tardi."
                    : text}
                </Text>
                <View style={styles.footer}>
                  {/** TORNA INDIETRO */}
                  <TouchableOpacity
                    onPress={handleCloseButton}
                    style={[styles.button, styles.outlinedButton]}>
                    <Text
                      style={[styles.buttonText, {color: Colors.mediumGrey}]}>
                      Indietro
                    </Text>
                  </TouchableOpacity>
                  {/** ELIMINA IL CONTENUTO*/}
                  <TouchableOpacity
                    onPress={handleDeleteButtonPress}
                    style={[
                      styles.button,
                      {
                        borderColor: Colors.errorRed,
                        backgroundColor: Colors.errorRed,
                      },
                    ]}
                    disabled={isLoading}>
                    {isLoading && (
                      <View style={StyleSheet.absoluteFillObject}>
                        <Spinner color="#fff" size={30} />
                      </View>
                    )}
                    <Text
                      style={[styles.buttonText, {opacity: isLoading ? 0 : 1}]}>
                      {state === "error" ? "Riprova" : "Elimina"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      )}
    </Dialog>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 10,
  },
  title: {
    color: Colors.darkGrey,
    fontSize: 25,
    fontWeight: "bold",
    paddingVertical: 15,
    textAlign: "center",
  },
  text: {
    color: "#707070",
    fontSize: 18,
    textAlign: "center",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  button: {
    marginHorizontal: 7,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 35,
    borderWidth: 3,
    justifyContent: "center",
  },
  outlinedButton: {
    borderColor: Colors.mediumGrey,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  linkButton: {
    marginHorizontal: 7,
    paddingVertical: 12,
    paddingHorizontal: 35,
    borderBottomWidth: 2.5,
    borderColor: Colors.successGreen,
    alignItems: "center",
    flexDirection: "row",
  },
});
