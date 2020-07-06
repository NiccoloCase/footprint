import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import {BottomTabBarProps} from "@react-navigation/bottom-tabs";
import posed from "react-native-pose";
import {Colors} from "../../styles";

const windowWidth = Dimensions.get("window").width;
const paddingHorizontal = 15;
const tabWidth = (windowWidth - paddingHorizontal * 2) / 4;

const SpotLight = posed.View({
  route0: {x: paddingHorizontal},
  route1: {x: paddingHorizontal + tabWidth},
  route2: {x: paddingHorizontal + tabWidth * 2},
  route3: {x: paddingHorizontal + tabWidth * 3},
});

export const TabBar: React.FC<BottomTabBarProps> = (props) => {
  const {
    activeTintColor,
    inactiveTintColor,
    navigation,
    state,
    descriptors,
  } = props;
  const {routes, index: activeRouteIndex} = state;

  return (
    <View style={styles.container}>
      <View style={StyleSheet.absoluteFillObject}>
        <SpotLight style={styles.spotLight} pose={`route${activeRouteIndex}`}>
          <View style={styles.spotLightInner} />
        </SpotLight>
      </View>

      {routes.map((route, routeIndex) => {
        const isRouteActive = routeIndex === activeRouteIndex;
        const tintColor = isRouteActive ? activeTintColor : inactiveTintColor;
        const {options} = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;
        const renderIcon = options.tabBarIcon;

        return (
          <TouchableOpacity
            key={routeIndex}
            style={styles.tabButton}
            accessibilityRole="button"
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={() => {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });

              if (!isRouteActive && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            }}
            onLongPress={() =>
              navigation.emit({
                type: "tabLongPress",
                target: route.key,
              })
            }>
            {renderIcon && (
              <View style={styles.iconWrapper}>
                {renderIcon({
                  focused: isRouteActive,
                  color: tintColor || "#000",
                  size: 28,
                })}
                {isRouteActive && (
                  <Text style={{...styles.label, color: tintColor}}>
                    {label}
                  </Text>
                )}
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 60,
    elevation: 2,
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal,
  },
  tabButton: {flex: 1},
  spotLight: {
    width: tabWidth,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  spotLightInner: {
    width: 110,
    height: 45,
    backgroundColor: Colors.primary,
    opacity: 0.4,
    borderRadius: 24,
  },
  iconWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  label: {marginLeft: 10, fontWeight: "bold"},
});
