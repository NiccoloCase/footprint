import React, {useState, useRef} from "react";
import {SafeAreaView, StyleSheet} from "react-native";
import {StackScreenProps} from "@react-navigation/stack";
import Swiper from "react-native-swiper";
import {AuthStackParamList} from "../../../navigation";
import {ForgotPasswordStep1} from "./steps/ForgotPasswordStep1";
import {ForgotPasswordStep2} from "./steps/ForgotPasswordStep2";

/** Propietà della scheramata di registrazione */
type ForgotPasswordScreenProps = StackScreenProps<
  AuthStackParamList,
  "ForgotPassword"
>;

const PAGE_NUMBER = 2;

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({
  route,
}) => {
  const [page, setPage] = useState(0);
  const swiper = useRef<Swiper | null>(null);
  const [email, setEmail] = useState("");

  /**
   * Va avanti di una schermata
   * @param swiper
   */
  const goNextPage = (_email: string) => {
    if (!swiper.current) return;
    if (page < PAGE_NUMBER - 1) swiper.current.scrollTo(page + 1);
    setEmail(_email);
  };

  /**
   * Va indietro di una schermata
   * @param swiper
   */
  const goPrevPage = () => {
    if (!swiper.current) return;
    if (page !== 0) swiper.current.scrollTo(page - 1);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Swiper
        ref={swiper}
        loop={false}
        scrollEnabled={false}
        onIndexChanged={setPage}
        index={page}
        showsPagination={false}>
        <ForgotPasswordStep1 nextPage={goNextPage} />
        <ForgotPasswordStep2 email={email} prevPage={goPrevPage} />
      </Swiper>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingTop: 30,
  },
});
