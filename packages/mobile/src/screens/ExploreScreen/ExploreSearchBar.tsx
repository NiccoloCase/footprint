import React, {useState, useEffect, useRef} from "react";
import {
  View,
  StyleSheet,
  Platform,
  TextInput,
  Text,
  TouchableHighlight,
  TouchableWithoutFeedback,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import hexToRgba from "hex-to-rgba";
import Icon from "react-native-vector-icons/Feather";
import {useTimingTransition, mix} from "react-native-redash";
import {Spacing, Colors} from "../../styles";
import Animated, {Easing} from "react-native-reanimated";
import {placeAutocomplete} from "../../utils/geocode";

const MAX_HEIGHT = 500;
const RESULT_ITEM_HEIGHT = 55;

interface ExploreSearchProps {
  setCoordinates: (coordinates: number[]) => void;
  setShowFootprints: (value: boolean) => void;
  showFootprints: boolean;
}

interface ExploreSearchResult {
  text: string;
  coordinates: number[];
}

export const ExploreSearchBar: React.FC<ExploreSearchProps> = ({
  setCoordinates,
  showFootprints,
  setShowFootprints,
}) => {
  const [value, setValue] = useState("");
  const [results, setResults] = useState<ExploreSearchResult[]>([]);
  const [showResults, setShowResults] = useState(true);
  const inputRef = useRef<TextInput | null>(null);

  // Animazione deli risultati:
  const transition = useTimingTransition(showResults, {
    duration: 250,
    easing: Easing.inOut(Easing.ease),
  });
  const boxHeight = mix(transition, 0, RESULT_ITEM_HEIGHT * results.length);

  const onChangeText = async (newValue: string) => {
    // Aggiorna lo stato
    setValue(newValue);

    if (!newValue || newValue.length === 0) return setShowResults(false);

    // Esegue ricerca
    try {
      const results = await placeAutocomplete(value);

      const formattedResults: ExploreSearchResult[] = results.map((r) => ({
        text: r.place_name,
        coordinates: r.geometry.coordinates,
      }));

      // Aggiorna lo stato:
      setResults(formattedResults);

      if (formattedResults.length > 0) setShowResults(true);
      else setShowResults(false);
    } catch (err) {}
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
  const onResultPress = (index: number) => {
    const result = results[index];
    setValue(result.text);
    setShowResults(false);
    // abbassa la tastiera deselezionano l'input
    if (inputRef.current) inputRef.current.blur();
    // chiama il callback
    setCoordinates(result.coordinates);
  };

  /**
   * Renderizza i risultati della ricerca
   */
  const renderResults = () =>
    results.map((result, index) => (
      <TouchableHighlight
        key={index}
        underlayColor="#eee"
        style={{paddingHorizontal: 15}}
        onPress={() => onResultPress(index)}>
        <View style={styles.resultBox}>
          <Text style={styles.resultText}>{result.text}</Text>
        </View>
      </TouchableHighlight>
    ));

  return (
    <>
      <View
        pointerEvents={showResults ? "auto" : "none"}
        style={StyleSheet.absoluteFill}>
        <TouchableWithoutFeedback onPress={() => setShowResults(false)}>
          <View style={{flex: 1}} />
        </TouchableWithoutFeedback>
      </View>
      {/** SERACH BAR: */}
      <View style={styles.container}>
        <View style={styles.searchBarWrapper}>
          <TextInput
            ref={inputRef}
            style={styles.searchBar}
            placeholder="Cerca un luogo..."
            value={value}
            onChangeText={onChangeText}
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
        <ScrollView style={{marginTop: 22}} keyboardShouldPersistTaps="always">
          <Animated.View style={[styles.resultsContainer, {height: boxHeight}]}>
            {renderResults()}
          </Animated.View>
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    //  backgroundColor: "orange",
    position: "absolute",
    left: 0,
    right: 0,
    maxHeight: MAX_HEIGHT,
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
    borderRadius: 5,
    overflow: "hidden",
    // ombra:
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
  },
  resultBox: {
    height: RESULT_ITEM_HEIGHT,
    justifyContent: "center",
    borderColor: "#eee",
    borderBottomWidth: 1,
  },
  resultText: {
    fontSize: 16,
    color: Colors.darkGrey,
  },
  buttonText: {
    color: "#808080",
    fontWeight: "bold",
    //color: Colors.darkGrey,
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
});
