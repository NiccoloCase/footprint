import React, {useRef, useEffect} from "react";
import {Text, StyleSheet, View, TouchableHighlight} from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import Icon from "react-native-vector-icons/MaterialIcons";
import {Spacing, Colors} from "../../../styles";
import {pickPhoto} from "./pickPhoto";
import {ImageSource} from "../../../utils/types";

const TEXT_COLOR = "#808080";

interface MedaPickerModalProps {
  /** Se il modal è aperto */
  isOpen?: boolean;
  /** Funzione chiamata quando il modal viene aperto/chiuso */
  onStateChange?: (isOpen: boolean) => void;
  /** Funcione chiamata quando l'utente sceglie una foto */
  onPhotoIsPicked: (image: ImageSource) => void;
}

/**
 * Modal Box per scegliere una foto dalla galleria del sipositivo
 * o scattarla sul momento
 */
const MediaPickerModal: React.FC<MedaPickerModalProps> = ({
  isOpen,
  onStateChange,
  onPhotoIsPicked,
}) => {
  // ref
  const modal = useRef<RBSheet | null>(null);

  useEffect(() => {
    if (!modal.current) return;
    // apre/chiude il popup
    if (isOpen) modal.current.open();
    else modal.current.close();
  }, [isOpen]);

  /**
   * Fuzione chiamata quando l'utente apre il modal
   */
  const onOpen = () => {
    if (typeof onStateChange === "function") onStateChange(true);
  };

  /**
   * Fuzione chiamata quando l'utente chiude il modal
   */
  const onClose = () => {
    if (typeof onStateChange === "function") onStateChange(false);
  };

  const handlePickPhoto = (from: "library" | "camera") => () => {
    // chiude la finestra
    onClose();
    // apre il picker
    pickPhoto(from, onPhotoIsPicked);
  };

  return (
    <RBSheet
      ref={modal}
      animationType="slide"
      openDuration={500}
      minClosingHeight={50}
      closeOnDragDown={true}
      closeOnPressMask={true}
      onClose={onClose}
      onOpen={onOpen}
      customStyles={{container: styles.container}}>
      <Text style={styles.title}>Scegli foto</Text>

      <View style={styles.buttonsWrapper}>
        <TouchableHighlight
          underlayColor="#eee"
          style={styles.button}
          onPress={handlePickPhoto("library")}>
          <View style={styles.buttonWrapper}>
            <Text style={styles.buttonText}>Seleziona dalla galleria</Text>
            <Icon name="photo" size={25} color={TEXT_COLOR} />
          </View>
        </TouchableHighlight>
        <TouchableHighlight
          underlayColor="#eee"
          style={[styles.button, styles.buttonOutile]}
          onPress={handlePickPhoto("camera")}>
          <View style={styles.buttonWrapper}>
            <Text style={styles.buttonText}>Scatta una foto</Text>
            <Icon name="add-a-photo" size={25} color={TEXT_COLOR} />
          </View>
        </TouchableHighlight>
      </View>
    </RBSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 15,
    paddingHorizontal: Spacing.screenHorizontalPadding,
  },
  title: {
    color: Colors.darkGrey,
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 26,
    paddingVertical: 10,
  },
  buttonsWrapper: {
    flex: 1,
    justifyContent: "space-around",
  },
  button: {
    backgroundColor: "#f6f6f6",
    paddingVertical: 15,
    paddingHorizontal: 5,
    borderRadius: 10,
  },
  buttonOutile: {
    borderColor: "#eee",
    borderWidth: 3,
    backgroundColor: "transparent",
  },
  buttonWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: TEXT_COLOR,
    marginRight: 15,
    fontSize: 18,
  },
});

MediaPickerModal.defaultProps = {
  isOpen: false,
};

export {MediaPickerModal};
