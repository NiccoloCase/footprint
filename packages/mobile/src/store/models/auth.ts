import {Action, action, thunk, Thunk} from "easy-peasy";
import {AsyncStorage} from "react-native";

/** Chiave con la quale è salvato il refresh token nello storage */
const REFRESH_TOKEN_KEY = "refresh-token";

interface TokensPayload {
  accessToken: string;
  refreshToken: string;
}

export interface AuthModel {
  // valori
  accessToken: string;
  refreshToken: string;
  isAuthenticated: boolean;
  // azioni
  setIsAuthenticated: Action<AuthModel, boolean>;
  setAccessToken: Action<AuthModel, string>;
  setRefreshToken: Action<AuthModel, string>;
  // thunk
  setTokens: Thunk<AuthModel, TokensPayload>;
  singin: Thunk<AuthModel, TokensPayload>;
  logout: Thunk<AuthModel, void>;
}

const authModel: AuthModel = {
  isAuthenticated: false,
  accessToken: "",
  refreshToken: "",

  /**
   * Modifica se l'utente è autenticato
   */
  setIsAuthenticated: action((state, isAuthenticated) => ({
    ...state,
    isAuthenticated,
  })),

  /**
   * Imposta un nuovo token di accesso
   */
  setAccessToken: action((state, accessToken) => ({
    ...state,
    accessToken,
  })),

  /**
   * Imposta un nuovo token di aggiornamento
   *
   */
  setRefreshToken: action((state, refreshToken) => ({
    ...state,
    refreshToken,
  })),

  /**
   * Imposta un nuovo token di aggiornamento e un nuovo
   * token di accesso
   */
  setTokens: thunk(async (actions, payload) => {
    const {accessToken, refreshToken} = payload;
    // imposta il nuovo token di accesso
    actions.setAccessToken(accessToken);
    // imposta il nuovo token di aggiornamento
    await setRefreshTokenInStorage(refreshToken);
    actions.setRefreshToken(refreshToken);
  }),

  /**
   * Imposta un nuovo token di aggiornamento, un nuovo token
   * di accesso e aggiorna lo stato di autenticazione dell'utente
   */
  singin: thunk(async (actions, payload) => {
    const {accessToken, refreshToken} = payload;
    // imposta i nuovi token
    actions.setTokens({accessToken, refreshToken});
    // aggiorna lo stato riguardo l'autenticazione dell'utente
    actions.setIsAuthenticated(true);
  }),

  /**
   * Disconnette l'utente loggato
   */
  logout: thunk(async (actions) => {
    // elimina il token di accesso e di aggiornamento
    actions.setTokens({accessToken: "", refreshToken: ""});
    // aggiorna lo stato riguardo l'autenticazione dell'utente
    actions.setIsAuthenticated(false);
  }),
};

/**
 * Restituisce il token di aggiornamento salvato nella memoria del dispositivo
 */
export const getRefreshTokenFromStorge = (): Promise<string | null> =>
  AsyncStorage.getItem(REFRESH_TOKEN_KEY);

/**
 * Modifica il token di aggiornamento salvato nella memoria del dispositivo
 */
export const setRefreshTokenInStorage = (newToken: string): Promise<void> =>
  AsyncStorage.setItem(REFRESH_TOKEN_KEY, newToken);

export default authModel;
