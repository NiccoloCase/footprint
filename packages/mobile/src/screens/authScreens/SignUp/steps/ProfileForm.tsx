import React, {useState} from "react";
import {
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  KeyboardAvoidingView,
} from "react-native";
import FeatherIcon from "react-native-vector-icons/Feather";
import Icon from "react-native-vector-icons/FontAwesome5";
import {SolidInput as InputText} from "../../../../components/inputs";
import {SignUpFormProps} from "../";
import {Colors} from "../../../../styles";
import {assetURLs} from "@footprint/common";
import {
  MediaPickerModal,
  LocationPickerModal,
} from "../../../../components/modals";
import {ErrorBadge} from "../../../../components/badges";

const AVATAR_RADIUS = 90;

export const ProfileForm: React.FC<SignUpFormProps> = ({formikProps}) => {
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const {
    handleChange,
    handleBlur,
    values,
    errors,
    touched,
    setFieldValue,
    setFieldTouched,
  } = formikProps;

  const openPositionModal = () => {
    setIsLocationPickerOpen(true);
    if (!touched.location) setFieldTouched("location");
  };

  return (
    <>
      <KeyboardAvoidingView behavior="padding" style={{flex: 1}}>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="always">
          {/** AVATAR */}
          <TouchableOpacity
            style={[styles.avatarContainer, {marginBottom: 15}]}
            onPress={() => setIsMediaPickerOpen(true)}>
            <View style={styles.avatarWrapper}>
              <Image
                source={{
                  uri: values.profileImage
                    ? values.profileImage.uri
                    : values.socialPictureUrl || assetURLs.blankAvatar,
                }}
                style={styles.avatar}
              />
            </View>
            <View style={styles.inline}>
              <FeatherIcon name="upload" size={22} color={Colors.darkGrey} />
              <Text style={styles.avatarText}>Carica una foto profilo</Text>
            </View>
          </TouchableOpacity>

          {/* POSIZIONE */}
          <TouchableOpacity
            style={[styles.inline, {marginBottom: 15}]}
            onPress={openPositionModal}>
            <View style={styles.roundIcon}>
              <Icon name="map-marked-alt" color="#fff" size={24} />
            </View>
            <View style={{flex: 1}}>
              <Text style={[styles.positionText, {fontWeight: "bold"}]}>
                Posizione
              </Text>
              <Text style={styles.positionText}>
                {values.location
                  ? values.location.locationName
                  : "Seleziona un luogo"}
              </Text>
            </View>
            {errors.location && touched.location && (
              <ErrorBadge errorMessage={errors.location} />
            )}
          </TouchableOpacity>

          {/** USERNAME */}
          <InputText
            label="Username"
            onChangeText={handleChange("username")}
            onBlur={handleBlur("username")}
            value={values.username}
            errorMessage={touched.username ? errors.username : undefined}
          />
        </ScrollView>
      </KeyboardAvoidingView>
      <MediaPickerModal
        contentType="avatar"
        isOpen={isMediaPickerOpen}
        onStateChange={setIsMediaPickerOpen}
        onPhotoIsPicked={(photo) => setFieldValue("profileImage", photo)}
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
    flexGrow: 1,
    justifyContent: "space-around",
    marginBottom: 40,
  },
  avatarContainer: {
    alignItems: "center",
  },
  avatarWrapper: {
    width: AVATAR_RADIUS * 2,
    height: AVATAR_RADIUS * 2,
    borderRadius: AVATAR_RADIUS,
    backgroundColor: "#f3f3f3",
    marginBottom: 8,
    overflow: "hidden",
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  avatarText: {
    color: Colors.darkGrey,
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 7,
  },
  inline: {
    alignItems: "center",
    flexDirection: "row",
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
  positionText: {
    color: Colors.darkGrey,
    fontSize: 16,
  },
  positionErrorMsg: {
    color: Colors.errorRed,
    fontSize: 15,
  },
});
