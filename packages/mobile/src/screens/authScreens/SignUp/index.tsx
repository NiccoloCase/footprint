import React, {useState} from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from "react-native";
import {StackScreenProps} from "@react-navigation/stack";
import Swiper from "react-native-swiper";
import {includes} from "lodash";
import {FormikProps, useFormik} from "formik";
import * as Yup from "yup";
import {AuthStackParamList} from "../../../navigation";
import {EmailAndPasswordForm} from "./EmailAndPasswordForm";
import {UsernameAndPictureForm} from "./UsernameAndPictureForm";

/** valori del form di registrazione */
export interface SingUpFormValues {
  email: string;
  password: string;
  password2: string;
  googleID: string;
  username: string;
}

/** Propietà della scheramata di registrazione */
type SignUpScreenProps = StackScreenProps<AuthStackParamList, "SignUp">;

/** Propietà di ogni schermata del form*/
export interface SignUpFormProps {
  formikProps: FormikProps<SingUpFormValues>;
}

/** Passaggi del form */
const steps = [EmailAndPasswordForm, UsernameAndPictureForm];
/** Nomi chiave dei campi di ogni passaggio del form */
const stepsValuesKeys = [["email", "password", "password2"], ["username"]];

/** Schema di validazione del form */
const SignupSchema = Yup.object().shape({
  // email
  email: Yup.string()
    .email("Email non valida")
    .required("Questo campo è richiesto"),
  // password
  password: Yup.string()
    .min(2, "La password è troppo corta")
    .max(30, "La password è troppo lunga")
    .required("Questo campo è richiesto"),
  // conferma della password
  password2: Yup.string()
    .oneOf([Yup.ref("password")], "Le password non corrispondono")
    .required("Questo campo è richiesto"),
  // username
  username: Yup.string()
    .min(2, "L'username è troppo corto")
    .max(15, "L'username è troppo lungo")
    .required("Questo campo è richiesto"),
});

export const SignUpScreen: React.FC<SignUpScreenProps> = ({navigation}) => {
  // index della schermata corrente
  const [currentStep, setCurrentStep] = useState(0);
  // form
  const formik = useFormik<SingUpFormValues>({
    initialValues: {
      email: "",
      password: "",
      password2: "",
      googleID: "",
      username: "",
    },
    validationSchema: SignupSchema,
    onSubmit: (values) => {
      Alert.alert(JSON.stringify(values, null, 2));
    },
  });

  /**
   * Va avanti di una schermata
   * @param swiper
   */
  const goNextStep = (swiper: Swiper) => {
    if (currentStep < steps.length - 1) swiper.scrollTo(currentStep + 1);
  };

  /**
   * Va indietro di una schermata
   * @param swiper
   */
  const goPrevStep = (swiper: Swiper) => {
    if (currentStep !== 0) swiper.scrollTo(currentStep - 1);
  };

  /**
   * Renderizza un "punto" dell'impagiazione
   * @param index
   */
  const renderDot = (index: number) => {
    const isActive = index === currentStep;
    const r = isActive ? 8.5 : 7;
    return (
      <View
        key={index}
        style={{
          backgroundColor: isActive ? "#FF596E" : "#707070",
          width: r * 2,
          height: r * 2,
          borderRadius: r,
          marginHorizontal: 5,
        }}
      />
    );
  };

  /**
   * Renderizza i bottoni di navoigazione
   * @param index
   * @param total
   * @param swiper
   */
  const renderPagination = (index: number, total: number, swiper: Swiper) => {
    const {errors, handleSubmit, isValid, isSubmitting} = formik;

    // Controlla se il form del passaggio corrente
    // è valido
    let isCurrentStepValid = true;
    for (let key in errors) {
      if (includes(stepsValuesKeys[index], key)) {
        isCurrentStepValid = false;
        break;
      }
    }

    // se quella renderizzata è l'ultima schermata
    const isLastStep = index === total - 1;
    // se il bottone per andare avanti / submit è disabilitato
    const isNextButtonDisabled =
      isSubmitting || !(isLastStep ? isValid : isCurrentStepValid);

    return (
      <View style={styles.pagination}>
        <View style={{flex: 1}}>
          {/** PULSANTE PER TORNARE INDIETRO */}
          <View
            style={{
              flexDirection: "row",
              opacity: index === 0 ? 0 : 1,
            }}>
            <TouchableOpacity
              style={[
                styles.navigationButton,
                {backgroundColor: "transparent"},
              ]}
              onPress={() => goPrevStep(swiper)}>
              <Text style={styles.navigationPrevButtonText}>Indietro</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/** INDICATORI DELLA NAVIGAZIONE */}
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}>
          {new Array(total).fill(null).map((_, i) => renderDot(i))}
        </View>
        {/** PULSANTE PER ANDARE ALLA SCHEMTATA SUCCESSIVA - SUBMIT */}
        <View style={{flex: 1}}>
          <View style={{flexDirection: "row-reverse"}}>
            <TouchableOpacity
              style={[
                styles.navigationButton,
                {
                  backgroundColor: "#FF596E",
                  opacity: isNextButtonDisabled ? 0.4 : 1,
                },
              ]}
              onPress={() => (isLastStep ? handleSubmit() : goNextStep(swiper))}
              disabled={isNextButtonDisabled}>
              <Text style={styles.navigationNextButtonText}>
                {isLastStep ? "Crea account" : "Avanti"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  /**
   * Renderizza le schermate
   */
  const renderSteps = (formikProps: FormikProps<SingUpFormValues>) =>
    steps.map((Step, key) => <Step key={key} formikProps={formikProps} />);

  return (
    <SafeAreaView style={styles.container}>
      {/* SCHERMATE DEL FORM */}
      <Swiper
        loop={false}
        scrollEnabled={false}
        index={currentStep}
        onIndexChanged={setCurrentStep}
        renderPagination={renderPagination}>
        {renderSteps(formik)}
      </Swiper>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: 35,
    paddingHorizontal: 15,
  },
  pagination: {
    flexDirection: "row",
  },
  navigationButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  navigationNextButtonText: {
    fontWeight: "bold",
    color: "#fff",
  },
  navigationPrevButtonText: {
    color: "#606060",
    borderBottomColor: "#606060",
    borderBottomWidth: 3,
  },
});
