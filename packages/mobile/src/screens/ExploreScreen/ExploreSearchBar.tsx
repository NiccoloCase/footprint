import React, {useState, useRef} from "react";
import {
  View,
  StyleSheet,
  Platform,
  TextInput,
  Text,
  TouchableHighlight,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import {useTimingTransition, mix} from "react-native-redash";
import {Spacing, Colors} from "../../styles";
import Animated, {Easing, cos} from "react-native-reanimated";
import {placeAutocomplete, PlaceTypes} from "../../utils/geocode";
import {LocationState} from ".";
import {SearchUserDocument, User} from "../../generated/graphql";
import Swiper from "react-native-swiper";
import {ScrollView} from "react-native-gesture-handler";
import {useLazyQuery} from "../../graphql/useLazyQuery";
import {useNavigateToUserProfile} from "../../navigation/navigateToUserProfile";

const RESULT_ITEM_HEIGHT = 57;
const TAB_HEADER_HEIGHT = 65;

interface ExploreSearchProps {
  setLocation: (location: LocationState) => void;
  setShowFootprints: (value: boolean) => void;
  showFootprints: boolean;
}

interface ExploreSearchResult {
  text: string;
  coordinates: number[];
  placeType: PlaceTypes;
}

interface ISearchResults {
  geo: ExploreSearchResult[];
  user: User[];
}

type SerachTypes = "geo" | "user";

export const ExploreSearchBar: React.FC<ExploreSearchProps> = ({
  setLocation,
  showFootprints,
  setShowFootprints,
}) => {
  // Navigazione
  const navigateToUser = useNavigateToUserProfile();
  // Tipo di ricerca
  const [searchType, setSearchType] = useState<SerachTypes>("geo");
  // Valore della barra di ricerca
  const [value, setValue] = useState("");
  // Ricerca un utente tramite l'username
  const searchUser = useLazyQuery(SearchUserDocument);
  // Risultati della ricerca
  const [results, setResults] = useState<ISearchResults>({geo: [], user: []});

  // Se mostare i risultati
  const [showResults, setShowResults] = useState(false);
  // Se mostarre i footprtint
  const [prevShowFootprints, setPrevShowFootprints] = useState<boolean>();

  const inputRef = useRef<TextInput | null>(null);
  const swiperRef = useRef<Swiper | null>(null);

  // Animazione deli risultati:
  const opacity = useTimingTransition(showResults, {
    duration: 250,
    easing: Easing.inOut(Easing.ease),
  });

  /**
   * Funzione chiamata quando il testo della serachBar cambia -> esegue la ricerca
   * @param query
   */
  const onChangeText = (query: string) => {
    // Aggiorna lo stato
    setValue(query);

    // Se la barra di ricerca è vuota elimina le ricerche
    if (!query || query.length === 0) {
      setShowResults(false);
      //    setSearchType("geo");
      return;
    }

    // RICERCA GEOGRAFICA
    placeAutocomplete(value)
      .then((data) => {
        const formattedResults: ExploreSearchResult[] = data
          ? data.map((r) => ({
              text: r.place_name,
              coordinates: r.center,
              placeType: r.place_type[0],
            }))
          : [];

        // Mostra i risultati
        setResults({...results, geo: formattedResults});

        if (!showResults && formattedResults.length > 0) {
          //if (results[searchType].length === 0) setSearchTypeAndSwipe("geo");
          setShowResults(true);
        }
      })
      .catch((err) => console.log(err));

    // RICERCA DEGLI UTENTI
    searchUser({query})
      .then(({data}) => {
        const formattedResults = data ? data.searchUser : [];
        // Mostra i risultati
        setResults({...results, user: formattedResults});

        if (!showResults && formattedResults.length > 0) {
          //if (results[searchType].length === 0) setSearchTypeAndSwipe("user");
          setShowResults(true);
        }
      })
      .catch((err) => console.log(err));
  };

  const setSearchTypeAndSwipe = (newType: SerachTypes) => {
    if (swiperRef.current) {
      switch (newType) {
        case "geo":
          swiperRef.current.scrollTo(0);
        case "user":
          swiperRef.current.scrollTo(1);
      }
    }
    setSearchType(newType);
  };

  /**
   * Funzione chiamata alla pressione dell'icona alla detsra della barra di ricerca
   */
  const handleIconPress = () => {
    if (showResults) setShowResults(false);
    else if (value.length > 0) setValue("");
    // abbassa la tastiera deselezionano l'input
    if (inputRef.current) inputRef.current.blur();
  };

  /**
   * Funzione chiamata quando viene preumto uno dei risultati
   * @param index Index del risultato
   */
  const onGeoResultPress = (index: number) => () => {
    const result = results.geo[index];
    setValue(result.text);
    setShowResults(false);
    // abbassa la tastiera deselezionano l'input
    if (inputRef.current) inputRef.current.blur();
    // chiama il callback
    const {coordinates, placeType} = result;
    // a seconda della tipologia di luogo zoomma in modo differente
    let zoom: number;
    switch (placeType) {
      case PlaceTypes.COUNTRY:
        zoom = 5;
        break;
      case PlaceTypes.REGION:
        zoom = 10;
        break;
      default:
        zoom = 16;
        break;
    }

    setLocation({coordinates, zoom});
  };

  const onIndexChanged = (index: number) => {
    console.log({index});
    if (index === 0 && searchType !== "geo") setSearchType("geo");
    else if (index === 1 && searchType !== "user") setSearchType("user");
  };

  /**
   * Reimposta il valore iniziale riguardo se
   * i footprint devono essere mostrati
   */
  const restShowFootprints = () => {
    if (!prevShowFootprints || prevShowFootprints === showFootprints) return;
    setShowFootprints(prevShowFootprints);
  };

  /**
   * Nasconde i footprint preservando lo stato precedente
   */
  const hideFootprints = () => {
    if (!showFootprints) return setPrevShowFootprints(false);
    setShowFootprints(false);
    setPrevShowFootprints(true);
  };

  /**
   * Funzione chiamata quando l'utente preme la regione
   * fuori al contenitore deli risultati
   */
  const onOutsideClick = () => {
    if (inputRef.current) inputRef.current.blur();
    setShowResults(false);
  };

  const renderNotFoundView = () => (
    <View style={styles.notFoundWrapper}>
      <Text style={styles.notFound}>Non ci sono risultati</Text>
    </View>
  );

  /**
   * Renderizza i risultati della ricerca geografica
   */
  const renderGeoResults = () =>
    results.geo.length > 0 ? (
      <ScrollView keyboardShouldPersistTaps="handled">
        {results.geo.map((result, index) => (
          <TouchableHighlight
            key={index}
            underlayColor="#eee"
            style={{paddingHorizontal: 15}}
            onPress={onGeoResultPress(index)}>
            <View
              style={[
                styles.resultBox,
                {
                  borderColor:
                    results.geo.length - 1 === index ? "transparent" : "#eee",
                },
              ]}>
              <Text style={styles.resultText}>{result.text}</Text>
            </View>
          </TouchableHighlight>
        ))}
      </ScrollView>
    ) : (
      renderNotFoundView()
    );

  /**
   * Renderizza i risultati della ricerca degli utenti
   */
  const renderUsersResults = () =>
    results.user.length > 0 ? (
      <ScrollView keyboardShouldPersistTaps="handled">
        {results.user.map((result, index) => (
          <TouchableHighlight
            key={index}
            underlayColor="#eee"
            style={{paddingHorizontal: 15}}
            onPress={() => navigateToUser(result.id)}>
            <View
              style={[
                styles.resultBox,
                {
                  borderColor:
                    results.user.length - 1 === index ? "transparent" : "#eee",
                },
              ]}>
              <Image
                source={{uri: result.profileImage}}
                style={styles.avatar}
              />
              <Text style={styles.resultText}>{result.username}</Text>
            </View>
          </TouchableHighlight>
        ))}
      </ScrollView>
    ) : (
      renderNotFoundView()
    );

  return (
    <>
      <View
        pointerEvents={showResults ? "auto" : "none"}
        style={StyleSheet.absoluteFill}>
        <TouchableWithoutFeedback onPress={onOutsideClick}>
          <View style={{flex: 1}} />
        </TouchableWithoutFeedback>
      </View>
      {/** SERACH BAR */}
      <View style={styles.container}>
        <View style={styles.searchBarWrapper}>
          <TextInput
            ref={inputRef}
            style={styles.searchBar}
            placeholder="Cerca un luogo..."
            value={value}
            onChangeText={onChangeText}
            onFocus={hideFootprints}
            onBlur={restShowFootprints}
          />
          <TouchableOpacity
            disabled={!showResults && value.length === 0}
            onPress={handleIconPress}>
            <Icon
              name={showResults || value.length > 0 ? "x" : "search"}
              color={Colors.darkGrey}
              size={22}
            />
          </TouchableOpacity>
        </View>
        {/** BOTTONI */}
        <View
          style={{
            paddingTop: 10,
            flexDirection: "row",
            justifyContent: "flex-end",
          }}>
          {/** BOTTONE PER NASCONDERE / MOSTRARE I FOOTPRINT */}
          <TouchableHighlight
            underlayColor="#eee"
            onPress={() => setShowFootprints(!showFootprints)}
            style={styles.button}>
            <Text style={styles.buttonText}>
              {showFootprints ? "Nascondi i footprint" : "Mostra i footprint"}
            </Text>
          </TouchableHighlight>
          {/** BOTTONE PER FILTRARE I FOOTPRINT */}
          <TouchableHighlight
            underlayColor="#eee"
            onPress={() => {}}
            style={styles.button}>
            <Text style={styles.buttonText}>Filtra</Text>
          </TouchableHighlight>
        </View>
        {/** RISUTLTATI DELLLA RICERCA: */}
        <Animated.View
          pointerEvents={showResults ? "auto" : "none"}
          style={[
            styles.resultsContainer,
            {
              opacity,
            },
          ]}>
          {/** TABS */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setSearchTypeAndSwipe("geo")}>
              <Text
                style={[
                  styles.headerTabLabel,
                  {
                    borderBottomColor:
                      searchType === "geo" ? Colors.primary : "transparent",
                  },
                ]}>
                Luoghi
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSearchTypeAndSwipe("user")}>
              <Text
                style={[
                  styles.headerTabLabel,
                  {
                    borderBottomColor:
                      searchType === "user" ? Colors.primary : "transparent",
                  },
                ]}>
                Persone
              </Text>
            </TouchableOpacity>
          </View>

          <Swiper
            ref={swiperRef}
            showsPagination={false}
            loop={false}
            onIndexChanged={onIndexChanged}
            index={searchType === "geo" ? 0 : 1}>
            {renderGeoResults()}
            {renderUsersResults()}
          </Swiper>
        </Animated.View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    // backgroundColor: "orange",
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 15,
    marginHorizontal: Spacing.screenHorizontalPadding,
  },
  searchBarWrapper: {
    marginTop: Platform.OS === "ios" ? 40 : 20,
    padding: 13,
    paddingRight: 10,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    shadowColor: "#ccc",
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
  },
  searchBar: {
    flex: 1,
    marginRight: 5,
    color: Colors.darkGrey,
    fontSize: 17,
    padding: 0,
  },
  resultsContainer: {
    backgroundColor: "#fff",
    flex: 1,
    borderRadius: 5,
    marginTop: 30,
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
  },
  resultBox: {
    height: RESULT_ITEM_HEIGHT,
    alignItems: "center",
    flexDirection: "row",
    borderBottomWidth: 1,
  },
  resultText: {
    fontSize: 16,
    color: Colors.darkGrey,
  },
  avatar: {
    backgroundColor: Colors.mediumGrey,
    width: 37,
    height: 37,
    borderRadius: 37 / 2,
    marginRight: 15,
  },
  buttonText: {
    color: "#808080",
    fontWeight: "bold",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffff",
    paddingHorizontal: 17,
    height: 37,
    borderRadius: 20,
    marginLeft: 10,
    // ombra
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 15,
    height: TAB_HEADER_HEIGHT,
  },
  headerTabLabel: {
    color: Colors.darkGrey,
    fontSize: 17,
    fontWeight: "bold",
    marginRight: 25,
    borderBottomWidth: 2,
  },
  notFound: {
    fontWeight: "bold",
    fontSize: 18,
  },
  notFoundWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
