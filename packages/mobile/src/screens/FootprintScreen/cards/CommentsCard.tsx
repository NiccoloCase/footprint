import React, {useState} from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import FeatherIcon from "react-native-vector-icons/Feather";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import {useNavigation} from "@react-navigation/native";
import {SharedElement} from "react-navigation-shared-element";
import {Colors} from "../../../styles";
import {abbreviateNumber} from "../../../utils/abbreviateNumber";

interface CommentsCardProps {
  footprintId: string;
  commentsCount: number;
}

export const CommentsCard: React.FC<CommentsCardProps> = ({
  footprintId,
  commentsCount: defaultCommentsCount,
}) => {
  // Valore dell'input box
  const [value, setValue] = useState("");
  // Numero di commenti
  const [commentsCount, setCommentsCount] = useState(defaultCommentsCount);

  // Navigazione
  const navigation = useNavigation();

  const goToComment = () => {
    navigation.navigate("CommentsScreen", {
      contentId: footprintId,
      textInputValue: value,
    });
  };

  return (
    <SharedElement id={`comments.card.${footprintId}`}>
      <View style={styles.card}>
        <View style={styles.inline}>
          <SharedElement id={`comments.card.${footprintId}.title`}>
            <Text style={[styles.text, styles.sectionTitle]}>Commenti</Text>
          </SharedElement>
        </View>
        <SharedElement id={`comments.card.${footprintId}.content`}>
          <TouchableOpacity style={styles.counter} onPress={goToComment}>
            <FontAwesomeIcon name="comments" size={34} color="#007fff" />
            <Text style={styles.commentsCounter}>
              {commentsCount === 0 ? (
                <Text>Non ci sono ancora commenti</Text>
              ) : (
                <>
                  <Text style={{fontWeight: "bold"}}>
                    {abbreviateNumber(100000)}
                  </Text>
                  <Text>{` comment${commentsCount === 1 ? "o" : "i"}`}</Text>
                </>
              )}
            </Text>
          </TouchableOpacity>
        </SharedElement>
        <SharedElement id={`comments.card.${footprintId}.inputBox`}>
          <View style={styles.inputBox}>
            <TextInput
              placeholder="Pubblica un commento..."
              style={styles.textInput}
              value={value}
              onChangeText={(t) => setValue(t)}
            />
            <TouchableOpacity>
              <FeatherIcon name="send" color="#707070" size={25} />
            </TouchableOpacity>
          </View>
        </SharedElement>
      </View>
    </SharedElement>
  );
};

const styles = StyleSheet.create({
  // CARD
  card: {
    marginTop: 10,
    backgroundColor: "#eee",
    borderRadius: 10,
    padding: 20,
    marginBottom: 25,
  },
  inline: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  text: {
    color: "#404040",
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },
  link: {
    fontSize: 15,
    color: Colors.primary,
  },
  inputBox: {
    marginTop: 20,
    paddingHorizontal: 10,
    borderRadius: 15,
    backgroundColor: "#f5f5f5",
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  textInput: {
    paddingVertical: 10,
    fontSize: 16,
    color: Colors.darkGrey,
    flex: 1,
  },
  counter: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
  },
  commentsCounter: {
    marginLeft: 15,
    fontSize: 16,
    color: Colors.darkGrey,
  },
});
