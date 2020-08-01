import React, {useEffect, useState} from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import {Spacing, Colors} from "../../styles";
import {useMeQuery, User, AuthType} from "../../generated/graphql";
import {useFormik, FormikHelpers} from "formik";
import {SolidInput} from "../../components/inputs";
import {MediaPickerModal, LocationPickerModal} from "../../components/modals";
import {ImageSource} from "../../utils/types";
import {SubmitButton} from "../../components/buttons";
import {EditProfileFormValidationSchema} from "../../utils/validation";
import Icon from "react-native-vector-icons/FontAwesome5";
import {DrawerScreenProps} from "@react-navigation/drawer";
import {
  MyProfileDrawerParamList,
  EditProfileStackParamList,
} from "../../navigation";
import {StackScreenProps} from "@react-navigation/stack";
import {EditProfileFormValues} from "./EditProfileFormValues";
import {useSubmitChanges} from "./submitChanges";

const AVATAR_RADIUS = 170;

type EditProfileScreenProps = DrawerScreenProps<
  MyProfileDrawerParamList,
  "EditProfile"
> &
  StackScreenProps<EditProfileStackParamList, "EditProfile">;

export const EditProfileScreen: React.FC<EditProfileScreenProps> = ({
  navigation,
}) => {
  const [isPhotoPickerOpen, setIsPhotoPickerOpen] = useState(false);
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);
  //const [profileImagePreview, setProfileImagePreview] = useState("");
  const {data} = useMeQuery();

  const onSubmit = useSubmitChanges(
    data ? {...data.whoami, email: data.whoami.email!} : null,
  );

  const formik = useFormik<EditProfileFormValues>({
    initialValues: {},
    validationSchema: EditProfileFormValidationSchema,
    onSubmit,
  });

  /**
   * Funzione chiamata quando l'utente seleziona una'immagine come foto profilo
   */
  const onProfilePictureIsPicked = (image: ImageSource) => {
    const {uri} = image;
    formik.setFieldValue("profileImage", uri);
  };

  const {
    values,
    handleChange,
    handleBlur,
    errors,
    handleSubmit,
    touched,
    isSubmitting,
    setFieldValue,
  } = formik;

  // Se l'utente si è registarto localmente
  const isLocalAuth = data ? data.whoami.authType === AuthType.Local : true;

  // Placeholder
  const userPlaceholder = data ? data.whoami.username : undefined;
  const emailPlaceholder = data ? data.whoami.email || undefined : undefined;

  return (
    <>
      <KeyboardAvoidingView style={{flex: 1}} behavior="height">
        <ScrollView contentContainerStyle={{flex: 1}}>
          <SafeAreaView style={styles.container}>
            <TouchableOpacity
              onPress={() => setIsPhotoPickerOpen(true)}
              style={styles.wrapperAvatar}>
              {values.profileImage || (data && data.whoami.profileImage) ? (
                <Image
                  style={styles.avatar}
                  source={{
                    uri: values.profileImage
                      ? values.profileImage.uri
                      : data!.whoami.profileImage,
                  }}
                />
              ) : null}
            </TouchableOpacity>

            {/** USERNAME */}
            <SolidInput
              label="Username"
              placeholder={userPlaceholder}
              onChangeText={handleChange("username") as any}
              onBlur={handleBlur("username") as any}
              value={values.username}
              errorMessage={touched.username ? errors.username : undefined}
              containerStyle={{marginBottom: 10}}
            />
            {
              /** EMAIL */
              isLocalAuth && (
                <SolidInput
                  label="Email"
                  email
                  placeholder={emailPlaceholder}
                  onChangeText={handleChange("email") as any}
                  onBlur={handleBlur("email") as any}
                  value={values.email}
                  errorMessage={touched.email ? errors.email : undefined}
                  containerStyle={{marginBottom: 10}}
                />
              )
            }

            {/* POSIZIONE */}
            <TouchableOpacity
              style={styles.inline}
              disabled={!values.location}
              onPress={() => setIsLocationPickerOpen(true)}>
              <View style={styles.roundIcon}>
                <Icon name="map-marked-alt" color="#fff" size={24} />
              </View>
              <View>
                <Text style={[styles.positionText, {fontWeight: "bold"}]}>
                  Posizione
                </Text>
                <Text style={styles.positionText}>
                  {values.location
                    ? values.location.locationName
                    : "Caricamento..."}
                </Text>
              </View>
            </TouchableOpacity>

            {
              /** PASSWORD */
              isLocalAuth && (
                <TouchableOpacity
                  onPress={() => navigation.navigate("EditPassword")}>
                  <Text style={styles.passwordLink}>Cambia password</Text>
                </TouchableOpacity>
              )
            }
            {/** SUBMIT */}
            <SubmitButton
              title="Modifica profilo"
              disabled={!data}
              isLoading={isSubmitting}
              onPress={handleSubmit as any}
            />
          </SafeAreaView>
        </ScrollView>
      </KeyboardAvoidingView>

      <MediaPickerModal
        contentType="avatar"
        isOpen={isPhotoPickerOpen}
        onStateChange={setIsPhotoPickerOpen}
        onPhotoIsPicked={onProfilePictureIsPicked}
      />
      <LocationPickerModal
        isOpen={isLocationPickerOpen}
        setIsOpen={setIsLocationPickerOpen}
        onLocationSelected={(location) => setFieldValue("location", location)}
        selectedLocation={values.location!}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.screenHorizontalPadding,
    paddingVertical: 10,
    backgroundColor: "#fff",
    justifyContent: "space-around",
  },
  avatar: {
    width: AVATAR_RADIUS,
    height: AVATAR_RADIUS,
  },
  wrapperAvatar: {
    alignSelf: "center",
    width: AVATAR_RADIUS,
    height: AVATAR_RADIUS,
    borderRadius: AVATAR_RADIUS / 2,
    overflow: "hidden",
    backgroundColor: "#eee",
  },
  passwordLink: {
    fontWeight: "bold",
    color: Colors.darkGrey,
    alignSelf: "flex-end",
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
  inline: {
    flexDirection: "row",
    alignItems: "center",
  },
  positionText: {
    color: Colors.darkGrey,
    fontSize: 16,
  },
});
