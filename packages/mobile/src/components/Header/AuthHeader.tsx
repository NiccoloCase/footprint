import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import {Colors} from "../../styles";
import {useNavigation} from "@react-navigation/native";

interface AuthHeaderProps {
  title: string;
  subtitle: string;
  containerStyle?: StyleProp<ViewStyle>;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({
  title,
  subtitle,
  containerStyle,
}) => {
  const navigation = useNavigation();

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={{flex: 1}}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      {navigation.canGoBack() && (
        <View>
          <TouchableOpacity onPress={navigation.goBack}>
            <Icon name="times" size={25} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    marginBottom: 40,
    flexDirection: "row",
  },
  title: {
    color: Colors.primary,
    fontWeight: "bold",
    fontSize: 36,
    marginTop: -10,
  },
  subtitle: {
    color: Colors.darkGrey,
    fontWeight: "bold",
    fontSize: 24,
  },
});
