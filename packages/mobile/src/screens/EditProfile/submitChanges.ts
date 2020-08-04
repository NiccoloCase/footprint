import {EditProfileFormValues} from "./EditProfileFormValues";
import {isEqual, pickBy, identity} from "lodash";
import {FormikHelpers} from "formik";
import {
  useEditProfileMutation,
  User,
  PointLocation,
  MeDocument,
} from "../../generated/graphql";
import Snackbar from "react-native-snackbar";
import {Colors} from "../../styles";
import {uploadImage} from "../../utils/cloudinary";
import cloneWithoutTypename from "../../graphql/cloneWithoutTypename";
import {useState} from "react";
import {useNavigation} from "@react-navigation/native";
import {useStoreActions} from "../../store";

interface DefaultUserValues {
  [key: string]: any;
  username: string;
  email: string;
  profileImage: string;
  location: PointLocation;
}

export const useSubmitChanges = (defaultValues: DefaultUserValues | null) => {
  const navigation = useNavigation();
  const [editProfile] = useEditProfileMutation();
  const [uploadedImage, setUploadedImage] = useState({localUrl: "", url: ""});
  const logout = useStoreActions((a) => a.auth.logout);

  const submitChanges = async (
    changes: EditProfileFormValues,
    helpers: FormikHelpers<EditProfileFormValues>,
  ) => {
    if (!defaultValues) return;

    // Elimina i campi rimasti invariati
    const prevValues = cloneWithoutTypename(defaultValues);
    for (let field in changes)
      if (isEqual(changes[field], prevValues[field])) delete changes[field];

    try {
      // Se è stata modifica la foto profilo carica la nuova immagine in cloudinary o
      // utilizza quella precedentemente caricata
      let profileImage: string | undefined = undefined;

      if (changes.profileImage) {
        if (changes.profileImage.uri === uploadedImage.localUrl)
          profileImage = uploadedImage.url;
        else {
          const {url} = await uploadImage(changes.profileImage);
          setUploadedImage({
            localUrl: changes.profileImage.uri,
            url,
          });
          profileImage = url;
        }
      }

      // Esegue la modifica del profilo
      const {username, email, location} = changes;
      const variables = {username, email, location, profileImage};

      const {data, errors} = await editProfile({
        variables,
        // Aggiorna la cache
        update: (proxy) => {
          try {
            const data = proxy.readQuery({query: MeDocument}) as any;
            // rimuove i valori nulli
            const newData = pickBy(variables, identity);
            data.whoami = {...data.whoami, ...newData};
            proxy.writeQuery({query: MeDocument, data});
          } catch (error) {
            console.log(error);
          }
        },
      });

      if (!data || errors) throw new Error();

      if (data.editProfile.isEmailConfirmationRequired) {
        logout();
        navigation.navigate("VerifyEmail", {
          email: changes.email,
          editedProfile: true,
        });
      } else navigation.navigate("MyProfile");
    } catch (err) {
      console.log(err);
      Snackbar.show({
        text: "Si è verificto un errore, riprova più tardi",
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: Colors.primary,
      });
    }
  };

  return submitChanges;
};
