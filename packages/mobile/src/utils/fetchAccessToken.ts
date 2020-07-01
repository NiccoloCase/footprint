import {getRefreshTokenFromStorge} from "../store/models/auth";
import {API_URL} from "./api";

/**
 * Esegue una richiesta al server per rinnovare il il token di accesso
 */
export const fetchAccessToken = async () => {
  const refresh_token = await getRefreshTokenFromStorge();
  const url = API_URL + "/auth/refresh_token";

  return fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({refresh_token}),
  });
};
