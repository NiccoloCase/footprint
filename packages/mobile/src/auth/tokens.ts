import {AsyncStorage} from "react-native";

const REFRESH_TOKEN_KEY = "refresh-token";

/**
 * Token di accesso salvato nella memoria
 */
let accessToken: string = "";

/**
 * Imposta un nuovo token di accesso
 * @param token
 */
export const setAccessToken = (token: string): void => {
  accessToken = token;
};

/**
 * Restituisce il token di accesso salvato in memoria
 */
export const getAccessToken = (): string => accessToken;

/**
 * Restituisce il token di aggiornamento salvato
 */
export const getRefreshToken = (): Promise<string | null> =>
  AsyncStorage.getItem(REFRESH_TOKEN_KEY);

/**
 * Modifica il token di aggiornamento salvato
 */
export const setRefreshToken = (newToken: string): Promise<void> =>
  AsyncStorage.setItem(REFRESH_TOKEN_KEY, newToken);
