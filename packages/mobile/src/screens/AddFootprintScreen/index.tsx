import React, {useState, useEffect} from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
} from "react-native";
import {Spacing, Colors} from "../../styles";
import {SolidInput, TextArea} from "../../components/inputs";
import {useFormik, FormikHelpers} from "formik";
import Icon from "react-native-vector-icons/FontAwesome5";
import {useStoreState, useStoreActions} from "../../store";
import {getPlaceNameFromCoordinates} from "../../utils/geocode";
import {MediaPickerModal, SelectModal} from "../../components/modals";
import {AppStackParamList} from "../../navigation";
import {ImageSource} from "../../utils/types";
import {StackScreenProps} from "@react-navigation/stack";
import {AddFootprintFormValidationSchema} from "../../utils/validation";
import {ScrollView} from "react-native-gesture-handler";
import {ErrorBadge} from "../../components/badges";
import {useAddFootprintMutation} from "../../generated/graphql";
import {SubmitButton} from "../../components/buttons";
import {usePostComment} from "../../utils/hooks";
import {usePostFootprint} from "./usePostFootprint";

type AddFootprintScreenProps = StackScreenProps<AppStackParamList, "Home">;

export interface AddFootprintFormValues {
  title: string;
  body: string;
  media?: ImageSource;
  coordinates?: number[];
  locationName: string;
}

export const AddFootprintScreen: React.FC<AddFootprintScreenProps> = ({
  navigation,
}) => {
  // URL dell'immagine caricata nei server
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  // Posizione
  const GPSposition = useStoreState((s) => s.geo.userPosition);
  const GPSError = useStoreState((s) => s.geo.error);
  const fetchGPSPosition = useStoreActions((a) => a.geo.fetchPosition);
  const [locationNames, setLocationNames] = useState<string[]>([]);
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);
  // Modal per selezionare una foto
  const [isPickerModalOpen, setIsPickerModalOpen] = useState(false);

  // Posta il footprint
  const onSubmit = usePostFootprint(uploadedImage, setUploadedImage);

  // FORM
  const formik = useFormik<AddFootprintFormValues>({
    initialValues: {
      title: "",
      body: "",
      media: undefined,
      coordinates: undefined,
      locationName: "",
    },
    validationSchema: AddFootprintFormValidationSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit,
  });

  useEffect(() => {
    (async () => {
      if (GPSposition && GPSposition.latitude && GPSposition.longitude) {
        // Imposta le coordinate
        const {longitude, latitude} = GPSposition;
        formik.setFieldValue("coordinates", [longitude, latitude]);

        try {
          // Ricerca i nomi associati alla posizione
          const data = await getPlaceNameFromCoordinates(longitude, latitude);

          // Imposta i possibili nomi delle loclità
          const names = data.map((item) => item.text);
          setLocationNames(names);
          formik.setFieldValue("locationName", names[0]);
        } catch (err) {
          setLocationNames([]);
        }
      }
    })();
  }, [GPSposition]);

  /**
   * Visualizza l'immagine a schermo intero
   */
  const viewImage = () => {
    if (values.media) {
      const {uri} = values.media;
      navigation.navigate("Image", {uri});
    }
  };

  /**
   * Funzione chiamata quando l'utente seleziona una foto
   * @param media
   */
  const onPhotoIsPicked = (media: ImageSource) => {
    // dimenticata l'immagine precedentemente caricata
    if (uploadedImage) setUploadedImage(null);
    // imposta la nuova immagine
    setFieldValue("media", media);
  };

  const {
    values,
    handleChange,
    handleBlur,
    errors,
    setFieldValue,
    touched,
    isSubmitting,
  } = formik;

  return (
    <>
      <KeyboardAvoidingView style={{flex: 1}} behavior="height">
        <ScrollView contentContainerStyle={{flex: 1}}>
          <SafeAreaView style={styles.container}>
            {/** CASELLAPER IL TITOLO */}
            <SolidInput
              label="Titolo"
              onChangeText={handleChange("title") as any}
              onBlur={handleBlur("title") as any}
              value={values.title}
              errorMessage={touched.title ? errors.title : undefined}
              containerStyle={{marginBottom: 10}}
            />

            {/** CASELLA PER LA DESCRIZIONE */}
            <TextArea
              label="Descrizione (opzionale)"
              placeholder="Descrivi in poche parole il tuo nuovo footprint"
              placeholderTextColor={Colors.mediumGrey}
              onChangeText={handleChange("body") as any}
              onBlur={handleBlur("body") as any}
              value={values.body}
              errorMessage={touched.body ? errors.body : undefined}
              containerStyle={{marginBottom: 10}}
            />

            {/** BOTTONE PER CARICARE UN IMMAGINE*/}
            <View style={styles.inline}>
              <View style={[styles.inline, {flex: 1}]}>
                <TouchableOpacity
                  onPress={() => setIsPickerModalOpen(true)}
                  style={[styles.inline, {marginVertical: 10}]}>
                  <View style={styles.roundIcon}>
                    <Icon name="image" color="#fff" size={22} />
                  </View>

                  <Text style={styles.addButtonText}>{`${
                    values.media ? "Cambia" : "Carica"
                  } immagine`}</Text>
                </TouchableOpacity>
                {values.media && (
                  <TouchableOpacity onPress={viewImage}>
                    <Text style={styles.link}>Vedi immagine</Text>
                  </TouchableOpacity>
                )}
              </View>
              {errors.media && <ErrorBadge errorMessage={errors.media} />}
            </View>

            {/** POSIZIONE */}
            <View style={{marginVertical: 10}}>
              <View style={styles.inline}>
                <View style={[styles.inline, {flex: 1}]}>
                  <View style={styles.roundIcon}>
                    <Icon name="map-marked-alt" color="#fff" size={24} />
                  </View>
                  {values.locationName ? (
                    <View style={[styles.inline, {flex: 1, flexWrap: "wrap"}]}>
                      <Text style={[styles.addButtonText]}>
                        {values.locationName}
                      </Text>
                      {locationNames.length > 0 && (
                        <TouchableOpacity
                          onPress={() => setIsLocationPickerOpen(true)}>
                          <Text style={styles.link}>Modifica</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  ) : (
                    <Text style={styles.addButtonText}>Posizione</Text>
                  )}
                </View>
                {(errors.coordinates || errors.locationName) && (
                  <ErrorBadge
                    errorMessage={errors.coordinates || errors.locationName}
                  />
                )}
              </View>
              <View style={{marginLeft: 55}}>
                {values.coordinates ? (
                  <View>
                    <Text
                      style={
                        styles.cord
                      }>{`latitudine: ${values.coordinates[1]}`}</Text>
                    <Text
                      style={
                        styles.cord
                      }>{`longitudine: ${values.coordinates[0]}`}</Text>
                  </View>
                ) : GPSError ? (
                  <Text style={styles.positionErrorMessage}>
                    Controlla che l'applicazione abbia il permesso di accedere
                    alla posizione e{" "}
                    <Text
                      style={styles.positionErrorMessageLink}
                      onPress={() => fetchGPSPosition()}>
                      riporva.
                    </Text>
                  </Text>
                ) : (
                  <Text style={styles.positionErrorMessage}>
                    Caricamento...
                  </Text>
                )}
              </View>
            </View>
            {/** BOTTONE DI SUBMIT */}
            <SubmitButton
              title="Posta il footprint"
              isLoading={isSubmitting}
              onPress={formik.handleSubmit as any}
              disabled={isSubmitting || (!GPSError && !GPSposition)}
            />
          </SafeAreaView>
        </ScrollView>
      </KeyboardAvoidingView>
      {/** POPUP PER CARICARE UN IMMAGINE */}
      <MediaPickerModal
        contentType="footprint"
        isOpen={isPickerModalOpen}
        onStateChange={setIsPickerModalOpen}
        onPhotoIsPicked={onPhotoIsPicked}
      />
      {/** POPUP PER SCEGLIERE IL NOME DELLA POSIZIONE */}
      <SelectModal
        title="Seleziona il nome del luogo più adeguato"
        isOpen={isLocationPickerOpen}
        setIsOpen={setIsLocationPickerOpen}
        defaultOptions={locationNames}
        selectedOption={values.locationName}
        onSelected={(name) => setFieldValue("locationName", name)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: Spacing.screenHorizontalPadding,
    paddingTop: 30,
    paddingBottom: 10,
    justifyContent: "space-around",
  },
  inline: {
    flexDirection: "row",
    alignItems: "center",
  },
  roundIcon: {
    backgroundColor: Colors.primary,
    width: 45,
    height: 45,
    borderRadius: 45 / 2,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  addButtonText: {
    color: Colors.darkGrey,
    fontWeight: "bold",
    fontSize: 16,
    marginRight: 15,
  },
  positionErrorMessage: {
    color: Colors.darkGrey,
    fontSize: 15,
  },
  positionErrorMessageLink: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: "bold",
  },
  cord: {
    color: Colors.darkGrey,
    fontSize: 15,
  },
  link: {
    color: Colors.primary,
    fontSize: 13,
  },
});
