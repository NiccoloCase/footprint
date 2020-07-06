/*
    credito: https://github.com/retyui/react-native-confirmation-code-field/tree/master/examples/DemoCodeField/src/AnimatedExample
*/

import {Animated, View, Text, ViewProps, ViewStyle} from "react-native";
import React, {useState, useEffect} from "react";

import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";

import styles, {
  ACTIVE_CELL_BG_COLOR,
  CELL_BORDER_RADIUS,
  CELL_SIZE,
  DEFAULT_CELL_BG_COLOR,
  NOT_EMPTY_CELL_BG_COLOR,
} from "./styles";
import {InputProps} from "react-native-elements";

const CELL_COUNT = 6;

// Animazioni
const {Value, Text: AnimatedText} = Animated;
const animationsColor = [...new Array(CELL_COUNT)].map(() => new Value(0));
const animationsScale = [...new Array(CELL_COUNT)].map(() => new Value(1));
const animateCell = ({hasValue, index, isFocused}: any) => {
  Animated.parallel([
    Animated.timing(animationsColor[index], {
      useNativeDriver: false,
      toValue: isFocused ? 1 : 0,
      duration: 250,
    }),
    Animated.spring(animationsScale[index], {
      useNativeDriver: false,
      toValue: hasValue ? 0 : 1,
      duration: hasValue ? 300 : 250,
    } as any),
  ]).start();
};

interface CodeInputProps {
  containerStyle?: ViewStyle;
  onFill?: (code: string) => Promise<{errorMessage?: string}>;
  onCodeChange?: (code: string) => void;
  errorMessage?: string;
}

export const CodeInput: React.FC<CodeInputProps> = ({
  onFill,
  containerStyle,
  onCodeChange,
  errorMessage,
}) => {
  // valore dell'input
  const [value, setValue] = useState("");
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  // messaggio di errore
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (value.length === CELL_COUNT && typeof onFill === "function")
      onFill(value)
        .then((res) => {
          if (res.errorMessage) {
            setValue("");
            setErrorMsg(res.errorMessage);
          }
        })
        .catch((err) => console.log(err));
  }, [value]);

  useEffect(() => {
    if (errorMessage) setErrorMsg(errorMessage);
  }, [errorMessage]);

  /**
   * Renderizza una cella
   * @param
   */
  const renderCell = (options: {
    symbol: string;
    index: number;
    isFocused: boolean;
  }) => {
    const {index, isFocused, symbol} = options;

    const hasValue = Boolean(symbol);
    const animatedCellStyle = {
      backgroundColor: hasValue
        ? animationsScale[index].interpolate({
            inputRange: [0, 1],
            outputRange: [NOT_EMPTY_CELL_BG_COLOR, ACTIVE_CELL_BG_COLOR],
          })
        : animationsColor[index].interpolate({
            inputRange: [0, 1],
            outputRange: [DEFAULT_CELL_BG_COLOR, ACTIVE_CELL_BG_COLOR],
          }),
      borderRadius: animationsScale[index].interpolate({
        inputRange: [0, 1],
        outputRange: [CELL_SIZE, CELL_BORDER_RADIUS],
      }),
      transform: [
        {
          scale: animationsScale[index].interpolate({
            inputRange: [0, 1],
            outputRange: [0.2, 1],
          }),
        },
      ],
    };

    // Run animation on next event loop tik
    // Because we need first return new style prop and then animate this value
    setTimeout(() => animateCell({hasValue, index, isFocused}), 0);

    return (
      <AnimatedText
        key={index}
        style={[styles.cell, animatedCellStyle]}
        onLayout={getCellOnLayoutHandler(index)}>
        {symbol || (isFocused ? <Cursor /> : null)}
      </AnimatedText>
    );
  };

  const onChangeText = (text: string) => {
    if (typeof onCodeChange === "function") onCodeChange(text);
    setValue(text);
    setErrorMsg("");
  };

  return (
    <View style={containerStyle}>
      <CodeField
        ref={ref}
        {...props}
        value={value}
        onChangeText={onChangeText}
        cellCount={CELL_COUNT}
        rootStyle={styles.codeFieldRoot}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        renderCell={renderCell}
      />
      <Text style={styles.errorMsg}>{errorMsg}</Text>
    </View>
  );
};
