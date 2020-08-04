import React from "react";
import {View, Text, StyleSheet} from "react-native";
import {StackScreenProps} from "@react-navigation/stack";
import {
  MyProfileDrawerParamList,
  EditProfileStackParamList,
} from "../../../navigation";
import {DrawerScreenProps} from "@react-navigation/drawer";
import {useFormik} from "formik";
import {SolidInput} from "../../../components/inputs";
import {Spacing, Colors} from "../../../styles";
import {SubmitButton} from "../../../components/buttons";
import {useEditPasswordMutation} from "../../../generated/graphql";
import Snackbar from "react-native-snackbar";
import {EditPasswordValidationSchema} from "../../../utils/validation/forms/editPassword";

type EditPasswordScreenProps = DrawerScreenProps<
  MyProfileDrawerParamList,
  "EditProfile"
> &
  StackScreenProps<EditProfileStackParamList, "EditPassword">;

interface EditPasswordFormValues {
  password: string;
  newPassword: string;
  newPassword2: string;
}

export const EditPasswordScreen: React.FC<EditPasswordScreenProps> = ({
  navigation,
}) => {
  const [editPassword] = useEditPasswordMutation();

  const formik = useFormik<EditPasswordFormValues>({
    initialValues: {password: "", newPassword: "", newPassword2: ""},
    validationSchema: EditPasswordValidationSchema,
    onSubmit,
  });

  const {
    values,
    handleChange,
    handleBlur,
    errors,
    handleSubmit,
    touched,
    isSubmitting,
    setFieldError,
  } = formik;

  async function onSubmit(values: EditPasswordFormValues) {
    const {password, newPassword} = values;
    try {
      const {data, errors} = await editPassword({
        variables: {oldPassword: password, newPassword},
      });
      if (!data || errors) throw new Error();

      if (data.editPassword.success === false)
        setFieldError("password", "Password errata");
      // Naviga alla schermata profilo
      else navigation.navigate("EditProfile");
    } catch (err) {
      Snackbar.show({
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: Colors.primary,
        text: "Si è verificato un errore. Riprova più tardi.",
      });
    }
  }

  return (
    <View style={styles.container}>
      <View>
        {/** PASSWORD */}
        <SolidInput
          label="Password"
          password
          onChangeText={handleChange("password") as any}
          onBlur={handleBlur("password") as any}
          value={values.password}
          errorMessage={touched.password ? errors.password : undefined}
          containerStyle={{marginBottom: 10}}
        />
        {/** NUOVA PASSWORD */}
        <SolidInput
          label="Nuova password"
          password
          onChangeText={handleChange("newPassword") as any}
          onBlur={handleBlur("newPassword") as any}
          value={values.newPassword}
          errorMessage={touched.newPassword ? errors.newPassword : undefined}
          containerStyle={{marginBottom: 10}}
        />
        {/** CONFERMA NUOVA PASSOWORD */}
        <SolidInput
          label="Conferma la nuova password"
          password
          onChangeText={handleChange("newPassword2") as any}
          onBlur={handleBlur("newPassword2") as any}
          value={values.newPassword2}
          errorMessage={touched.newPassword2 ? errors.newPassword2 : undefined}
          containerStyle={{marginBottom: 10}}
        />
      </View>

      <SubmitButton
        title="Modifica password"
        isLoading={isSubmitting}
        onPress={handleSubmit as any}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: Spacing.screenHorizontalPadding,
    justifyContent: "space-around",
  },
});
