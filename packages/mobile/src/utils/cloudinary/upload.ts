import {ImageSource} from "../types";
import {API_URL} from "../api";
import {keys} from "@footprint/config";

interface UploadImageResult {
  url: string;
}

const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${keys.cloudinary.CLOUD_NAME}/image/upload`;

/**
 * Carica un immagine nei server di cloudinary
 * @param photoSorce
 */
export const uploadImage = async (
  mediaSorce: ImageSource,
): Promise<UploadImageResult> => {
  // Richiede all'API la firma per autorizzare la richiesta a cloudinary
  const {signature, timestamp, upload_preset} = await getCloudinarySignature();

  // Valori richiesi da cloudinary
  const formData = new FormData();
  formData.append("file", mediaSorce as any);
  formData.append("signature", signature);
  formData.append("timestamp", timestamp);
  formData.append("upload_preset", upload_preset);
  formData.append("api_key", keys.cloudinary.API_KEY);

  // Invia la richiesta a cloudinary
  const res = await fetch(CLOUDINARY_UPLOAD_URL, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();

  // Controlla che la richiesta sia stata eseguita con successo
  if (!res.ok || !data.secure_url) throw new Error(data.error.message);

  // Restituisce l'url dell'immagine appena caricata
  return {url: data.secure_url};
};

export const getCloudinarySignature = async () => {
  const res = await fetch(API_URL + "/uploader/generate-cloudinary-signature", {
    method: "POST",
  });
  const data = await res.json();

  if (res.status >= 400 || !res.ok || !data.signature)
    throw new Error("the signature cannot be generated");

  const payload: {
    signature: string;
    upload_preset: string;
    timestamp: string;
  } = {
    signature: data.signature,
    upload_preset: data.upload_preset,
    timestamp: String(data.timestamp),
  };

  return payload;
};
