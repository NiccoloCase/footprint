import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Dimensions,
  Animated,
  TouchableOpacity,
  Easing,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import {Colors, Spacing} from "../../styles";
import {TextInput} from "react-native-gesture-handler";

const {width} = Dimensions.get("window");

export const MainHeader = () => {
  const searchBarAnimationValue = new Animated.Value(0);

  React.useEffect(() => {}, []);

  const searchBarAnimationOptions = {
    duration: 300,
    useNativeDriver: false,
    easing: Easing.ease,
  };

  const openSearchBar = () => {
    Animated.timing(searchBarAnimationValue, {
      ...searchBarAnimationOptions,
      toValue: 1,
    }).start();
  };

  const closeSearchBar = () => {
    Animated.timing(searchBarAnimationValue, {
      ...searchBarAnimationOptions,
      toValue: 0,
    }).start();
  };

  const searchBarTranslation = searchBarAnimationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [width, 0],
  });

  return (
    <View style={styles.header}>
      <View style={styles.headerWrapper}>
        <View style={styles.headerLeft} />
        <Text style={styles.headerTitle}>Footprint</Text>
        <View style={styles.headerRight}>
          <TouchableHighlight
            activeOpacity={1}
            underlayColor="#eee"
            onPress={openSearchBar}
            style={styles.searchIcon}>
            <Icon name="search" color={Colors.darkGrey} size={20} />
          </TouchableHighlight>
        </View>

        <Animated.View
          style={[
            styles.searchBarContainer,
            {transform: [{translateX: searchBarTranslation}]},
          ]}>
          <Animated.View
            style={{
              opacity: searchBarAnimationValue,
              transform: [{scale: searchBarAnimationValue}],
            }}>
            <TouchableOpacity>
              <Icon
                name="times"
                size={20}
                color={Colors.darkGrey}
                onPress={closeSearchBar}
              />
            </TouchableOpacity>
          </Animated.View>

          <View style={styles.searchBarWrapper}>
            <TextInput style={styles.searchBar} placeholder="Cerca..." />
          </View>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#fff",
    elevation: 3,
    paddingHorizontal: Spacing.screenHorizontalPadding,
    paddingVertical: 10,
  },
  headerWrapper: {
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  headerTitle: {
    flex: 1,
    fontWeight: "bold",
    fontSize: 20,
    color: Colors.primary,
    letterSpacing: 1,
    textTransform: "uppercase",
  },

  // SEARCH BAR
  searchIcon: {
    width: 35,
    height: 35,
    borderRadius: 35 / 2,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  searchBarContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
  },
  searchBarWrapper: {
    backgroundColor: "#eee",
    flex: 1,
    marginLeft: 10,
    borderRadius: 10,
  },
  searchBar: {
    color: Colors.darkGrey,
    paddingVertical: 5,
  },
});
