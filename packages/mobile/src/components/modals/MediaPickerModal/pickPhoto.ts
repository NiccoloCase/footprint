import ImagePicker from "react-native-image-crop-picker";
import {Colors} from "../../../styles";
import {ImageSource} from "../../../utils/types";
import {Platform} from "react-native";
import Snackbar from "react-native-snackbar";

/**
 * Seleziona una foto dalla galleria o apre la fotoamera per
 * scattarne una
 * @param form dove recuperare la foto
 * @param callback
 */
export const pickPhoto = (
  from: "library" | "camera",
  callback: (src: ImageSource) => void,
) => {
  const options: any = {
    width: 300,
    height: 400,
    cropping: true,
    mediaType: "photo",
    cropperActiveWidgetColor: Colors.primary,
    cropperToolbarTitle: "Modifica la foto",
    loadingLabelText: "Caricamento...",
    // cropperToolbarColor: Colors.primary,
    // cropperStatusBarColor: Colors.primary,
    includeBase64: true,
  };

  Promise.resolve(
    from === "library"
      ? ImagePicker.openPicker(options)
      : ImagePicker.openCamera(options),
  )
    .then((image) => {
      // se sono piu immagini considera solo la prima
      if (Array.isArray(image)) image = image[0];
      // salva i dati dell'immagine
      const source: ImageSource = {
        uri: image.path,
        type: image.mime,
        name:
          Platform.OS === "ios"
            ? image.filename
            : image.path.substring(image.path.lastIndexOf("/") + 1),
      };
      callback(source);
    })
    .catch((err) => {
      if (err.code === "E_PICKER_CANCELLED") return;
      Snackbar.show({
        text:
          "Spiacenti, si è verificato un problema durante il tentativo di caricare la risorsa selezionata. Per favore riprova Prova più tardi",
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: Colors.primary,
      });
    });
};
