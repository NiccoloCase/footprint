import * as Yup from "yup";
import {ValidationConfig} from "@footprint/common";

/**
 * Schema di validazione del form di login
 */
export const AddFootprintFormValidationSchema = Yup.object().shape({
  // TITOLO
  title: Yup.string()
    .min(
      ValidationConfig.footprint.title.length.min,
      "Il titolo è troppo corto",
    )
    .max(
      ValidationConfig.footprint.title.length.max,
      "Il titolo è troppo lungo",
    )
    .required("Questo campo è richiesto"),
  // DESCRIZIONE
  body: Yup.string().max(
    ValidationConfig.footprint.body.length.max,
    "La descrizione è troppo lunga",
  ),
  // IMMAGINE
  media: Yup.object().required("Devi caricare un'immagine"),
  // POSIZIONE - COORDINATE
  coordinates: Yup.array()
    .of(Yup.number().required())
    .required("La posizione è richiesta"),
  // POSIZIONE - NOME DEL LUOGO
  locationName: Yup.string().required("La posizione è richiesta"),
});
