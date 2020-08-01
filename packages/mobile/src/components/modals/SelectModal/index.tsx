import React, {useRef, useEffect, useState} from "react";
import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  ScrollView,
  TouchableHighlight,
  TextInput,
  TouchableOpacity,
} from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import {Spacing, Colors} from "../../../styles";
import hexToRgba from "hex-to-rgba";
import Icon from "react-native-vector-icons/FontAwesome5";

interface SelectModalProps {
  title?: string;
  subtitle?: string;
  serachBarPlaceholder?: string;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  defaultOptions: string[];
  selectedOption?: string;
  onSelected: (option: string) => void;
  searchOptions?: (serachKey: string) => Promise<string[]>;
}

export const SelectModal: React.FC<SelectModalProps> = ({
  isOpen,
  setIsOpen,
  defaultOptions,
  selectedOption,
  onSelected,
  title,
  subtitle,
  serachBarPlaceholder,
  searchOptions,
}) => {
  // opzioni mostrate
  const [options, setOptions] = useState(defaultOptions);

  // valore della serachbar
  const [searchBarValue, setSearchBarValue] = useState("");

  const ref = useRef<RBSheet>(null);

  // Dimensioni:
  const {height} = useWindowDimensions();
  const modalHeight = height - (height * 15) / 100;

  useEffect(() => {
    setOptions(defaultOptions);
  }, [defaultOptions]);

  useEffect(() => {
    if (!ref.current) return;
    if (isOpen) ref.current.open();
    else ref.current.close();
  }, [isOpen]);

  const onOptionSelected = (index: number) => () => {
    setIsOpen(false);
    onSelected(options[index]);
  };

  /**
   * Esegue una ricerca tra le opzioni
   * @param value
   */
  const onSearchBarValueChange = async (value: string) => {
    setSearchBarValue(value);
    if (!value || value.length === 0) return setOptions(defaultOptions);

    let results: string[];

    // Se è stata passato una funzione per eseguire una la ricerca custum utilizza quella, altrimenti
    // esegue una semplice ricerca nel testo
    if (typeof searchOptions === "function")
      results = await searchOptions(value);
    else
      results = options.filter((item) =>
        item.toLocaleLowerCase().includes(value.toLocaleLowerCase()),
      );

    setOptions(results);
  };

  const renderOptions = () => (
    <ScrollView keyboardShouldPersistTaps="always">
      {options.map((item, index) => {
        const isSelected = options[index] === selectedOption;
        const highlightedBackgroundColor = hexToRgba(Colors.primary, 0.2);

        return (
          <TouchableHighlight
            key={index}
            underlayColor={highlightedBackgroundColor}
            style={[
              styles.option,
              {
                borderLeftColor: isSelected ? Colors.primary : "transparent",
                backgroundColor: isSelected
                  ? highlightedBackgroundColor
                  : "transparent",
              },
            ]}
            onPress={onOptionSelected(index)}>
            <Text style={styles.optionText}>{item}</Text>
          </TouchableHighlight>
        );
      })}
    </ScrollView>
  );

  return (
    <RBSheet
      ref={ref}
      height={modalHeight}
      closeOnDragDown={true}
      closeOnPressMask={true}
      onClose={() => setIsOpen(false)}
      onOpen={() => setIsOpen(true)}
      customStyles={{container: styles.container}}>
      {/** TITOLO */}
      <Text style={styles.title}>{title}</Text>
      {/** SOTTOTITOLO */}
      <Text style={styles.subtitle}>{subtitle}</Text>
      {/** BARRA DI RICERCA */}
      <View style={styles.searchBar}>
        <TextInput
          placeholder={serachBarPlaceholder}
          style={styles.serachBarInput}
          value={searchBarValue}
          onChangeText={onSearchBarValueChange}
        />
        <TouchableOpacity
          disabled={searchBarValue.length === 0}
          onPress={() => setSearchBarValue("")}>
          {searchBarValue.length > 0 ? (
            <Icon name="times" color={Colors.darkGrey} size={22} />
          ) : (
            <Icon name="search" color={Colors.darkGrey} size={22} />
          )}
        </TouchableOpacity>
      </View>
      {/** OPZIONI */}
      {renderOptions()}
    </RBSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingHorizontal: Spacing.screenHorizontalPadding,
  },
  title: {
    color: Colors.darkGrey,
    fontSize: 19,
    fontWeight: "bold",
    alignSelf: "center",
    textAlign: "center",
    paddingTop: 20,
  },
  subtitle: {
    color: Colors.darkGrey,
    fontSize: 16,
    alignSelf: "center",
    textAlign: "center",
    paddingVertical: 20,
  },
  option: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderBottomColor: "#eee",
    borderBottomWidth: 1.5,
    borderLeftWidth: 3,
  },
  optionText: {
    fontSize: 16,
    color: Colors.darkGrey,
  },
  searchBar: {
    backgroundColor: "#f3f3f3",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 10,
    marginBottom: 35,
    // ombra:
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 3,
  },
  serachBarInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.darkGrey,
  },
});
