import {EditProfileFormValues} from "./EditProfileFormValues";
import {FormikHelpers} from "formik";
import {
  useEditProfileMutation,
  User,
  PointLocation,
} from "../../generated/graphql";
import Snackbar from "react-native-snackbar";
import {Colors} from "../../styles";
import {uploadImage} from "../../utils/cloudinary";

interface DefaultUserValues {
  [key: string]: any;
  username: string;
  email: string;
  profileImage: string;
  location: PointLocation;
}

export const useSubmitChanges = (defaultValues: DefaultUserValues | null) => {
  const [editProfile] = useEditProfileMutation();

  const submitChanges = async (
    changes: EditProfileFormValues,
    helpers: FormikHelpers<EditProfileFormValues>,
  ) => {
    if (!defaultValues) return;

    // Elimina i campi rimasti invariati
    for (let field in changes)
      if (
        JSON.stringify(changes[field]) === JSON.stringify(defaultValues[field])
      )
        delete changes[field];

    console.log(changes);

    try {
      // Se è stata modifica la foto profilo carica la nuova immagine in cloudinary
      let profileImage: string | undefined = undefined;
      if (changes.profileImage) {
        const {url} = await uploadImage(changes.profileImage);
        profileImage = url;
      }

      // Esegue la modifica del profilo
      const {username, email, location} = changes;

      const {data, errors} = await editProfile({
        variables: {username, email, location, profileImage},
      });

      console.log(data, errors);
      if (!data || errors) throw new Error();

      //
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
