import React, {useRef, useEffect} from "react";
import {Text, StyleSheet, View, TouchableHighlight} from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import Icon from "react-native-vector-icons/MaterialIcons";
import {Spacing, Colors} from "../../../styles";
import {pickPhoto} from "./pickPhoto";
import {ImageSource} from "../../../utils/types";

const TEXT_COLOR = "#808080";

interface MedaPickerModalProps {
  /** Tipo di contenuto */
  contentType: "footprint" | "avatar";
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
  contentType,
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

    // formato della foto
    let imageWidth = undefined;
    let imageHeight = undefined;

    switch (contentType) {
      case "footprint":
        imageWidth = 1080;
        imageHeight = 1920;
        break;
      case "avatar":
        imageWidth = 800;
        imageHeight = 800;
        break;
    }

    // apre il picker
    pickPhoto(from, onPhotoIsPicked, {imageWidth, imageHeight});
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
      height={300}
      customStyles={{container: styles.container}}>
      <Text style={styles.title}>Scegli foto</Text>

      <View style={styles.buttonsWrapper}>
        <TouchableHighlight
          underlayColor="#f6f6f6"
          style={styles.button}
          onPress={handlePickPhoto("library")}>
          <View style={styles.buttonWrapper}>
            <Icon name="photo" size={25} color={TEXT_COLOR} />
            <Text style={styles.buttonText}>Seleziona dalla galleria</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight
          underlayColor="#f6f6f6"
          style={styles.button}
          onPress={handlePickPhoto("camera")}>
          <View style={styles.buttonWrapper}>
            <Icon name="add-a-photo" size={25} color={TEXT_COLOR} />
            <Text style={styles.buttonText}>Scatta una foto</Text>
          </View>
        </TouchableHighlight>

        <TouchableHighlight
          underlayColor="#eee"
          onPress={onClose}
          style={[styles.button, {backgroundColor: "#f6f6f6"}]}>
          <View style={styles.buttonWrapper}>
            <Text style={styles.closeText}>Chiudi</Text>
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
    fontSize: 24,
    paddingVertical: 10,
  },
  buttonsWrapper: {
    flex: 1,
    justifyContent: "space-around",
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 5,
    borderRadius: 10,
  },
  buttonWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: TEXT_COLOR,
    marginLeft: 10,
    fontSize: 18,
  },
  closeText: {
    fontWeight: "bold",
    color: Colors.darkGrey,
    fontSize: 18,
  },
});

MediaPickerModal.defaultProps = {
  isOpen: false,
};

export {MediaPickerModal};
