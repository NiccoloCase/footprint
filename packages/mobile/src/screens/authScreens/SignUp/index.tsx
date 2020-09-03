import React, {useState, useEffect} from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import {StackScreenProps} from "@react-navigation/stack";
import Swiper from "react-native-swiper";
import {includes} from "lodash";
import {FormikProps, useFormik} from "formik";
import {AuthStackParamList} from "../../../navigation";
import {EmailAndPasswordForm} from "./steps/EmailAndPasswordForm";
import {ProfileForm} from "./steps/ProfileForm";
import {useSubmitSignUp} from "./submit";
import {SignupValidationSchema} from "../../../utils/validation";
import {Colors, Spacing} from "../../../styles";
import {AuthHeader} from "../../../components/Header/AuthHeader";
import {PointLocation} from "../../../generated/graphql";
import {ImageSource} from "../../../utils/types";

/** valori del form di registrazione */
export interface SingUpFormValues {
  email: string;
  password: string;
  password2: string;
  username: string;
  location?: PointLocation;
  googleAccessToken?: string;
  profileImage?: ImageSource;
  socialPictureUrl?: string;
}

/** Propietà della scheramata di registrazione */
type SignUpScreenProps = StackScreenProps<AuthStackParamList, "SignUp">;

/** Propietà di ogni schermata del form*/
export interface SignUpFormProps {
  formikProps: FormikProps<SingUpFormValues>;
  withGoogle?: boolean;
}

export const SignUpScreen: React.FC<SignUpScreenProps> = ({
  route,
  navigation,
}) => {
  // Index della schermata corrente
  const [currentStep, setCurrentStep] = useState(0);

  // Funzione di submit
  const [onSubmit, {loading}] = useSubmitSignUp(
    route.params && !!route.params.withGoogle,
    navigation,
  );

  // Form
  const formik = useFormik<SingUpFormValues>({
    initialValues: {
      email: "",
      password: "",
      password2: "",
      username: "",
    },
    validationSchema: SignupValidationSchema,
    onSubmit,
  });

  /** Passaggi del form */
  const steps = [EmailAndPasswordForm, ProfileForm];
  // Se la registrazione avviene tramite google, la prima schermata non
  // è necessaria quidni viene rimossa
  if (route.params && route.params.withGoogle) steps.shift();

  /** Nomi chiave dei campi di ogni passaggio del form */
  const stepsValuesKeys = [["email", "password", "password2"], ["username"]];

  useEffect(() => {
    // Se la registrazione avviene con google:
    if (route.params && route.params.withGoogle) {
      // 1) Rimuove la prima schermata del form
      steps.shift();
      // 2) Imposta l'immagine profilo e il token di accesso passati da Google
      formik.setFieldValue("socialPictureUrl", route.params.picture);
      formik.setFieldValue("googleAccessToken", route.params.googleAccessToken);
      // 3) Cambia il titolo della schermata
      navigation.setOptions({title: "Completa la registrazione"});
    }
  }, [route]);

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
          backgroundColor: isActive ? Colors.primary : "#707070",
          width: r * 2,
          height: r * 2,
          borderRadius: r,
          marginHorizontal: 5,
        }}
      />
    );
  };

  /**
   * Renderizza il bottone per procedere / di submit
   * @param isDisabled
   * @param isLastStep
   * @param swiper
   */
  const renderNextButon = (
    isDisabled: boolean,
    isLastStep: boolean,
    swiper: Swiper,
  ) => {
    const content = loading ? (
      <Text style={styles.navigationNextButtonText}>Caricamento...</Text>
    ) : (
      <Text style={styles.navigationNextButtonText}>
        {isLastStep ? "Crea account" : "Avanti"}
      </Text>
    );

    return (
      <TouchableOpacity
        style={[
          styles.navigationButton,
          {
            backgroundColor: Colors.primary,
            opacity: isDisabled ? 0.4 : 1,
          },
        ]}
        onPress={() =>
          isLastStep ? formik.handleSubmit() : goNextStep(swiper)
        }
        disabled={isDisabled}>
        {content}
      </TouchableOpacity>
    );
  };

  /**
   * Renderizza i bottoni di navoigazione
   * @param index
   * @param total
   * @param swiper
   */
  const renderPagination = (index: number, total: number, swiper: Swiper) => {
    const {errors, isValid, isSubmitting, values} = formik;

    // Controlla se il form del passaggio corrente è valido:
    // Controlla che i campi contenuti nella schermata mostrata non abbiano erorri
    // e non siano vuoti
    let isCurrentStepValid = true;
    for (let field of stepsValuesKeys[index]) {
      if (
        (values as any)[field] === "" ||
        includes(Object.keys(errors), field)
      ) {
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
      <View style={[styles.pagination]}>
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
              disabled={isSubmitting}
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
          {total > 1 && new Array(total).fill(null).map((_, i) => renderDot(i))}
        </View>
        {/** PULSANTE PER ANDARE ALLA SCHEMTATA SUCCESSIVA - SUBMIT */}
        <View style={{flex: 1}}>
          <View style={{flexDirection: "row-reverse"}}>
            {renderNextButon(isNextButtonDisabled, isLastStep, swiper)}
          </View>
        </View>
      </View>
    );
  };

  /**
   * Renderizza le schermate
   */
  const renderSteps = (formikProps: FormikProps<SingUpFormValues>) =>
    steps.map((Step, key) => (
      <Step
        key={key}
        formikProps={formikProps}
        withGoogle={route.params && route.params.withGoogle}
      />
    ));

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        {/** HEADER */}
        <AuthHeader
          title="Crea un account,"
          subtitle="Registrati per iniziare!"
        />
        {/* SCHERMATE DEL FORM */}
        <Swiper
          loop={false}
          scrollEnabled={false}
          index={currentStep}
          onIndexChanged={setCurrentStep}
          renderPagination={renderPagination}>
          {renderSteps(formik)}
        </Swiper>
        <Text style={[styles.text, styles.loginText]}>
          Hai già un account?{" "}
          <Text
            style={[styles.text, styles.link]}
            onPress={() => navigation.push("SignIn")}>
            Accedi ora
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.screenHorizontalPadding,
    backgroundColor: "#fff",
  },
  card: {
    flex: 1,
    maxWidth: Spacing.maxScreenWidth,
    alignSelf: "center",
    width: "100%",
    justifyContent: "space-between",
  },
  pagination: {
    flexDirection: "row",
    height: 40,
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
  text: {
    color: Colors.darkGrey,
  },
  link: {
    color: "#FF1654",
    fontSize: 14,
    fontWeight: "bold",
  },
  loginText: {
    fontSize: 14,
    color: Colors.mediumGrey,
    textAlign: "center",
    marginVertical: 15,
  },
});
