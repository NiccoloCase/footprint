import React, {useState} from "react";
import {SafeAreaView, StatusBar, View, StyleSheet, Text} from "react-native";
import Animated from "react-native-reanimated";
import LottieView from "lottie-react-native";
import {StackScreenProps} from "@react-navigation/stack";
import {useFocusEffect} from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome5";
import {MyProfileDrawerParamList, AppStackParamList} from "../../navigation";
import {HEADER_DELTA} from "./dimensions";
import {MeDocument, GetUserByIdDocument, User} from "../../generated/graphql";
import {LogoSpinner} from "../../components/Spinner";
import {Colors} from "../../styles";
import {useStoreState} from "../../store";

// Componenti della schermata:
import {Content} from "./Content";
import {Header} from "./Header";
import {Cover} from "./Cover";
import {client} from "../../graphql";
import {TouchableOpacity} from "react-native-gesture-handler";

const {Value, interpolate, Extrapolate} = Animated;

type SearchScreenProps =
  | StackScreenProps<MyProfileDrawerParamList, "MyProfile">
  | StackScreenProps<AppStackParamList, "Profile">;

export const ProfileScreen: React.FC<SearchScreenProps> = ({route}) => {
  // ID dell'utente loggato
  const loggedUser = useStoreState((s) => s.auth.userId);
  // utente mostrato nella schermata
  const [user, setUser] = useState<User>();
  // se si è verificato un errore nel recupero dei dati del'utente
  const [errorOccurred, setErrorOccurred] = useState<boolean>();
  // Se sta caricando
  const [loading, setLoading] = useState(false);
  // se la schermata mostra il profilo personale della persona loggata
  const personal =
    !((route as any).params && (route as any).params.id) ||
    (route as any).params.id === loggedUser;

  const y = new Value<number>(0);

  useFocusEffect(
    React.useCallback(() => {
      loadUserProfile();
    }, [route]),
  );

  /**
   *  Richiede al server il profilo dell'utente
   *  (quello associato all'id passato o quello loggato)
   */
  const loadUserProfile = async () => {
    const r = route as any;
    // ID dell'utente passato come parametro
    const user: string | null = r.params && r.params.id ? r.params.id : null;

    // Reimposta un eventuale errore
    if (errorOccurred) setErrorOccurred(false);

    // Avvia il caricamento
    setLoading(true);

    try {
      const {data, errors} = await (user
        ? client.query({
            query: GetUserByIdDocument,
            variables: {id: user, isFollowedBy: loggedUser},
          })
        : client.query({query: MeDocument}));

      if (errors) throw new Error();
      // Imposta il nuovo utente
      setUser(data.getUserById || data.whoami);
    } catch (err) {
      console.log(err);
      setErrorOccurred(true);
    } finally {
      setLoading(false);
    }
  };

  const opacity = interpolate(y, {
    inputRange: [0, HEADER_DELTA],
    outputRange: [0, 1],
    extrapolate: Extrapolate.CLAMP,
  });

  const renderContent = () => {
    // SCHERMATA DEL PROFILO
    if (user) {
      return (
        <>
          <StatusBar backgroundColor="#303030" barStyle="light-content" />
          <Cover y={y} opacity={opacity} user={user} personal={personal} />
          <Content
            y={y}
            user={user}
            refresh={loadUserProfile}
            refreshing={loading}
          />
          <Header
            y={y}
            opacity={opacity}
            username={user.username}
            personal={personal}
          />
        </>
      );
    }
    // SCHERMATA DI ERRORE
    else if (errorOccurred) {
      return (
        <View style={styles.container}>
          <StatusBar backgroundColor="#fff" barStyle="dark-content" />
          <LottieView
            source={require("../../assets/lottie/pc-error.json")}
            resizeMode="cover"
            style={{width: 230, height: 230}}
            autoPlay
            loop
          />
          <Text style={styles.message}>Si è verificato un errore!</Text>
        </View>
      );
    }
    // SCHERMATA DI CARICAMENTO
    else
      return (
        <View style={styles.container}>
          <LogoSpinner />
        </View>
      );
  };

  return <SafeAreaView style={{flex: 1}}>{renderContent()}</SafeAreaView>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  message: {
    color: Colors.darkGrey,
    fontWeight: "bold",
    fontSize: 18,
  },
});
