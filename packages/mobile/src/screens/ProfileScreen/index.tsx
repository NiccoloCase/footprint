import React, {useEffect, useState} from "react";
import {SafeAreaView, StatusBar, View, StyleSheet, Text} from "react-native";
import Animated from "react-native-reanimated";
import {StackScreenProps} from "@react-navigation/stack";
import {ProfileStackParamList, HomeStackParamList} from "../../navigation";
import {HEADER_DELTA} from "./dimensions";
import {MeDocument, GetUserByIdDocument, User} from "../../generated/graphql";
import {Spinner} from "../../components/Spinner";
import {Colors} from "../../styles";

// Componenti della schermata:
import {Content} from "./Content";
import {Header} from "./Header";
import {Cover} from "./Cover";
import {client} from "../../graphql";

// Animazione:
const {Value, interpolate, Extrapolate} = Animated;
const y = new Value<number>(0);

let uri =
  "https://res.cloudinary.com/dgjcj7htv/image/upload/v1595020031/static/Alberto_conversi_profile_pic_gcbyuc.jpg";

type SearchScreenProps =
  | StackScreenProps<ProfileStackParamList, "MyProfile">
  | StackScreenProps<HomeStackParamList, "Profile">;

export const ProfileScreen: React.FC<SearchScreenProps> = ({route}) => {
  // utente mostrato nella schermata
  const [user, setUser] = useState<User>();
  // se si è verificato un errore nel recupero dei dati del'utente
  const [errorOccurred, setErrorOccurred] = useState<boolean>();
  // se la schermata mostra il profilo personale della persona loggata
  const personal = !((route as any).params && (route as any).params.id);

  // Richiede al server il profilo dell'utente
  // (quello associato all'id passato o quello loggato)
  useEffect(() => {
    (async () => {
      const r = route as any;
      // ID dell'utente
      const userId: string | null =
        r.params && r.params.id ? r.params.id : null;

      // Reimposta un eventuale errore
      if (errorOccurred) setErrorOccurred(false);

      try {
        const {data, errors} = await (userId
          ? client.query({query: GetUserByIdDocument, variables: {id: userId}})
          : client.query({query: MeDocument}));

        if (errors) throw new Error();
        // imposta il nuovo utente
        setUser(data.getUserById || data.whoami);
      } catch (err) {
        setErrorOccurred(true);
      }
    })();
  }, [route]);

  const opacity = interpolate(y, {
    inputRange: [0, HEADER_DELTA],
    outputRange: [0, 1],
    extrapolate: Extrapolate.CLAMP,
  });

  const renderContent = () => {
    // SCHERMATA DEL PROFILO
    if (user) {
      const {username} = user;
      let xuser = {...user, profileImage: uri};

      return (
        <>
          <StatusBar backgroundColor="#303030" barStyle="light-content" />
          <Cover y={y} opacity={opacity} user={xuser} />
          <Content y={y} user={xuser} />
          <Header
            y={y}
            opacity={opacity}
            username={username}
            personal={personal}
          />
        </>
      );
    }
    // SCHERMATA DI ERRORE
    // todo
    else if (errorOccurred) {
      return (
        <View style={styles.loadingContainer}>
          <StatusBar backgroundColor="#fff" barStyle="dark-content" />
          <Text>Si è verificato un errore. Riporva più tardi</Text>
        </View>
      );
    }
    // SCHERMATA DI CARICAMENTO
    else
      return (
        <View style={styles.loadingContainer}>
          <StatusBar backgroundColor="#fff" barStyle="dark-content" />
          <Spinner color={Colors.primary} size={40} />
        </View>
      );
  };

  return <SafeAreaView style={{flex: 1}}>{renderContent()}</SafeAreaView>;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
});
