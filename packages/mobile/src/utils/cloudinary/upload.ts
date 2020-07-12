import {ImageSource} from "../types";

interface UploadImageResult {
  url: string;
}

/**
 * Carica un immagine nei server di cloudinary
 * @param photoSorce
 */
export const uploadImage = async (
  photoSorce: ImageSource,
): Promise<UploadImageResult> => {
  const formData = new FormData();
  formData.append("file", photoSorce as any);
  //formData.append("signature", "signature");
  formData.append("upload_preset", "footprint_unsigned");

  const CLOUDINARY_URL =
    "https://api.cloudinary.com/v1_1/dgjcj7htv/image/upload";

  const res = await fetch(CLOUDINARY_URL, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();

  return {url: data.secure_url};
};
