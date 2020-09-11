import React, {useState} from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import FeatherIcon from "react-native-vector-icons/Feather";
import {useNavigation} from "@react-navigation/native";
import {SharedElement} from "react-navigation-shared-element";
import {Colors} from "../../../styles";
import {abbreviateNumber} from "../../../utils/abbreviateNumber";
import {Card} from "./Card";
import {Spinner} from "../../../components/Spinner";
import Snackbar from "react-native-snackbar";
import {usePostComment} from "../../../utils/hooks";
import {useFormik} from "formik";
import {PostCommentFormValues} from "../../CommentsScreen";
import {PostCommentValidationSchema} from "../../../utils/validation";
import {ErrorBadge} from "../../../components/badges";

const EMOJIS = ["🔥", "😂", "😍", "♥", "👏", "💪", "👍", "😈"];

interface CommentsCardProps {
  footprintId: string;
  commentsCount: number;
}

export const CommentsCard: React.FC<CommentsCardProps> = ({
  footprintId,
  commentsCount,
}) => {
  // Form
  const formik = useFormik<PostCommentFormValues>({
    initialValues: {text: ""},
    validationSchema: PostCommentValidationSchema,
    onSubmit: submitComment,
  });

  // Se mostrare il
  const [showSuccessMark, setShowSuccessMark] = useState(false);
  // Navigazione
  const navigation = useNavigation();
  // Funzione per postare i commenti
  const [postComment] = usePostComment();

  const onChangeTextBoxValue = (text: string) => {
    formik.setFieldValue("text", text);
    if (showSuccessMark) setShowSuccessMark(false);
  };

  /**
   * Posta un commento
   */
  async function submitComment({text}: PostCommentFormValues) {
    try {
      const {data, errors} = await postComment(footprintId, text);
      if (!data || errors) throw new Error();

      // Ripulisce la casella di testo
      // Indica che l'operazione ha avuto successo
      setShowSuccessMark(true);
      setTimeout(() => setShowSuccessMark(false), 1500);
      formik.setFieldValue("text", "");
      formik.setTouched({text: false});
    } catch (err) {
      Snackbar.show({
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: Colors.primary,
        text: "Si è verificato un errore. Riprova più tardi",
      });
    }
  }

  /**
   * Porta l'utente alla schermata del commento
   */
  const goToComments = () => {
    navigation.navigate("CommentsScreen", {
      contentId: footprintId,
      textInputValue: formik.values.text,
    });
  };

  return (
    <Card
      title="Commenti"
      buttonText={
        commentsCount > 1
          ? `Vedi i ${abbreviateNumber(commentsCount)} commenti`
          : "Vai ai commenti"
      }
      onButtonPress={goToComments}
      titleId={`comments.card.${footprintId}.title`}
      cardId={`comments.card.${footprintId}`}
      linkId={`comments.card.${footprintId}.link`}>
      <SharedElement id={`comments.card.${footprintId}.content`}>
        {/** EMOJI */}
        <View style={styles.emojis}>
          {EMOJIS.map((emoji, index) => (
            <TouchableOpacity
              key={index}
              onPress={() =>
                formik.setFieldValue("text", formik.values.text + emoji)
              }>
              <Text style={{fontSize: 25}}>{emoji}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </SharedElement>
      <SharedElement id={`comments.card.${footprintId}.inputBox`}>
        <View style={styles.inputBox}>
          <TextInput
            placeholder="Pubblica un commento..."
            style={styles.textInput}
            value={formik.values.text}
            onChangeText={onChangeTextBoxValue}
          />
          {formik.errors.text && (
            <ErrorBadge
              errorMessage={formik.errors.text}
              style={{marginRight: 10}}
            />
          )}
          {formik.isSubmitting ? (
            <View>
              <Spinner color="#707070" size={25} />
            </View>
          ) : showSuccessMark ? (
            <FeatherIcon name="check-circle" color="#00b16a" size={25} />
          ) : (
            <TouchableOpacity
              onPress={formik.handleSubmit as any}
              disabled={!formik.isValid}>
              <FeatherIcon name="send" color="#707070" size={25} />
            </TouchableOpacity>
          )}
        </View>
      </SharedElement>
    </Card>
  );
};

const styles = StyleSheet.create({
  inputBox: {
    marginTop: 20,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
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
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderBottomWidth: 1.5,
    borderColor: Colors.primary,
  },
  buttonText: {
    marginRight: 10,
    fontSize: 16,
    color: "#707070",
    fontWeight: "bold",
  },
  commentButtonWrapper: {
    marginRight: 25,
    paddingRight: 25,
    borderRightColor: "#ddd",
    borderRightWidth: 2,
    alignItems: "center",
  },
  commentsCount: {
    color: "#707070",
    fontWeight: "bold",
    fontSize: 16,
  },
  emojis: {
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
