import React, {useRef, useEffect, useState} from "react";
import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  ScrollView,
  TouchableHighlight,
} from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import {Spacing, Colors} from "../../../styles";
import hexToRgba from "hex-to-rgba";

interface SelectModalProps {
  title?: string;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  options: string[];
  selectedOption: string;
  onSelected: (option: string) => void;
}

export const SelectModal: React.FC<SelectModalProps> = ({
  isOpen,
  setIsOpen,
  options,
  selectedOption,
  onSelected,
  title,
}) => {
  const ref = useRef<RBSheet>(null);
  // Dimensioni:
  const {height} = useWindowDimensions();
  const modalHeight = height - (height * 15) / 100;

  useEffect(() => {
    if (!ref.current) return;
    if (isOpen) ref.current.open();
    else ref.current.close();
  }, [isOpen]);

  const onOptionSelected = (index: number) => () => {
    onSelected(options[index]);
    setIsOpen(false);
  };

  const renderOptions = () => (
    <ScrollView>
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
      <Text style={styles.title}>{title}</Text>
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
    paddingBottom: 35,
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
});
