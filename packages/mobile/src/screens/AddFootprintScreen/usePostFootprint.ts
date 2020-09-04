import {AddFootprintFormValues} from "./";
import {FormikHelpers} from "formik";
import Snackbar from "react-native-snackbar";
import {Colors} from "react-native/Libraries/NewAppScreen";
import {useNavigation} from "@react-navigation/native";
import {
  useAddFootprintMutation,
  GetNewsFeedDocument,
} from "../../generated/graphql";
import {uploadImage} from "../../utils/cloudinary";
import {FEED_ITEMS_PER_QUERY} from "../HomeScreen";
import {useStoreState} from "../../store";

export const usePostFootprint = (
  uploadedImage: string | null,
  setUploadedImage: (src: string | null) => void,
): ((
  values: AddFootprintFormValues,
  helpers: FormikHelpers<AddFootprintFormValues>,
) => void) => {
  // Navigazione
  const navigation = useNavigation();
  // Utente autenticato
  const loggesUser = useStoreState((s) => s.auth.userId);
  // GRAPHQL
  const [postFootprintMutation] = useAddFootprintMutation();

  /**
   * Posta un nuovo footprint
   */
  const postFootprint = async (
    values: AddFootprintFormValues,
    {resetForm}: FormikHelpers<AddFootprintFormValues>,
  ) => {
    const {title, body, media, coordinates, locationName} = values;
    if (!media || !coordinates) return;

    try {
      let mediaURL: string;
      // Controlla se è già stata caricata un'immagine
      if (uploadedImage) {
        mediaURL = uploadedImage;
      } else {
        // Carica l'immagine nel server
        const {url} = await uploadImage(media);
        // Salva nello stato l'immagine caricata
        setUploadedImage(url);
        mediaURL = url;
      }

      const {data, errors} = await postFootprintMutation({
        variables: {title, body, media: mediaURL, coordinates, locationName},
        refetchQueries: [
          {
            query: GetNewsFeedDocument,
            variables: {pagination: {limit: FEED_ITEMS_PER_QUERY}},
          },
        ],
      });

      if (!data || !data.addFootprint.id || errors) throw new Error();

      // Resetta il form
      resetForm();

      // Porta l'utete alla schermata del footprint
      navigation.navigate("Footprint", {
        id: data.addFootprint.id,
        title,
        image: mediaURL,
        authorUsername: data.addFootprint.author.username,
        authorProfileImage: data.addFootprint.author.profileImage,
      });
    } catch (err) {
      Snackbar.show({
        text:
          "Non è stato possibile pubblicare il footprint. Riprova più tardi",
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: Colors.primary,
      });
    }
  };

  return postFootprint;
};
