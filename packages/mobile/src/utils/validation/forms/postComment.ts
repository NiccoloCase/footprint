import * as Yup from "yup";
import {validationConfig} from "@footprint/config";

/**
 * Schema di validazione del form per creare un commento
 */
export const PostCommentValidationSchema = Yup.object().shape({
  // TESTO
  text: Yup.string()
    .max(validationConfig.comment.text.length.max, "Il commento è troppo lungo")
    .required("Questo campo è richiesto"),
});
