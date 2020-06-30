import {getRefreshToken} from "./";

/**
 * Esegue una richiesta al server per rinnovare il il token di accesso
 */
export const fetchAccessToken = async () => {
  const refresh_token = await getRefreshToken();
  // TODO
  return fetch("http://10.0.2.2:5000/api/auth/refresh_token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({refresh_token}),
  });
};
