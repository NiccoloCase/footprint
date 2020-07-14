import React, {useState} from "react";
import {
  View,
  Text,
  Button,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import {Spacing, Colors} from "../../styles";
import {ImageSource} from "../../utils/types";
import {uploadImage} from "../../utils/cloudinary";
import {MediaPickerModal} from "../../components/modals";
import {OutlinedTextInput, TextArea} from "../../components/inputs";
import {useFormik} from "formik";
import Icon from "react-native-vector-icons/FontAwesome5";

interface AddFootprintFormValues {
  title: string;
  body: string;
  media?: ImageSource;
}

export const AddFootprintScreen: React.FC = () => {
  // FORM
  const formik = useFormik<AddFootprintFormValues>({
    initialValues: {
      title: "",
      body: "",
      media: undefined,
    },
    onSubmit,
  });

  // MODAL per selezionare una foto
  const [isPickerModalOpen, setIsPickerModalOpen] = useState(false);

  const uploadMedia = async () => {
    const {media} = formik.values;

    if (!media) return;

    try {
      // carica l'immagine
      const {url} = await uploadImage(media);
      console.log(url);
    } catch (err) {
      console.log(err);
    }
  };

  function onSubmit() {}

  return (
    <SafeAreaView style={styles.container}>
      <MediaPickerModal
        isOpen={isPickerModalOpen}
        onStateChange={setIsPickerModalOpen}
        onPhotoIsPicked={(m) => formik.setFieldValue("media", m)}
      />

      {formik.values.media && (
        <Image
          source={{uri: formik.values.media.uri}}
          style={{height: 100, width: 100}}
        />
      )}

      <OutlinedTextInput
        label="Titolo"
        onChangeText={formik.handleChange("title") as any}
        onBlur={formik.handleBlur("title") as any}
        value={formik.values.title}
        errorMessage={formik.errors.title}
      />

      <TextArea
        label="Descrizione (opzionale)"
        onChangeText={formik.handleChange("body") as any}
        onBlur={formik.handleBlur("body") as any}
        value={formik.values.body}
        errorMessage={formik.errors.body}
      />

      <View style={styles.addButtonWrapper}>
        <TouchableOpacity
          onPress={() => setIsPickerModalOpen(true)}
          style={styles.addButton}>
          <Icon name="plus" color={Colors.lightGrey} />
        </TouchableOpacity>
        <Text style={styles.addButtonText}>Carica immagine</Text>
      </View>

      <Button title="uploadMedia" onPress={uploadMedia} />

      <Button title="SUBMIT" onPress={formik.handleSubmit as any} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: Spacing.screenHorizontalPadding,
    paddingVertical: 30,
    justifyContent: "space-around",
  },
  addButtonWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  addButton: {
    backgroundColor: Colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  addButtonText: {
    color: Colors.mediumGrey,
    fontWeight: "bold",
  },
});
