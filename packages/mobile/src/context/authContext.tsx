import React, {createContext, useReducer, useMemo} from "react";
import {StateAction} from "./state-action.interface";
import {setAccessToken, setRefreshToken} from "../auth";
import {client} from "../graphql";

/** Tipi delle azioni: */
enum AuthActionType {
  SET_IS_AUTH,
  LOGOUT,
  SIGNIN,
}

interface AuthContextProps {
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuth: boolean) => void;
  signin: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

const authContextInitialState: AuthContextProps = {
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  signin: () => {},
  logout: () => {},
};

const AuthContext = createContext<AuthContextProps>(authContextInitialState);

const authReducer = (state: AuthContextProps, action: StateAction) => {
  switch (action.type) {
    case AuthActionType.SET_IS_AUTH:
      return {...state, isAuthenticated: action.payload};
    case AuthActionType.LOGOUT:
      return {...state, isAuthenticated: false};
    default:
      return state;
  }
};

const AuthProvider: React.FC = (props: any) => {
  const [state, dispatch] = useReducer(authReducer, authContextInitialState);

  const actions = useMemo(
    () => ({
      /** Modifica se l'utente è autenticato */
      setIsAuthenticated: (isAuth: boolean) =>
        dispatch({type: AuthActionType.SET_IS_AUTH, payload: isAuth}),

      /** Esegue l'accesso del client */
      signin: async (accessToken: string, refreshToken: string) => {
        // imposta il token di accesso e quello di aggiornamento
        setAccessToken(accessToken);
        await setRefreshToken(refreshToken);
        // aggiorna lo stato
        dispatch({type: AuthActionType.SET_IS_AUTH, payload: true});
      },

      /** Disconnette un utente */
      logout: () => {
        // elimina il token di accesso e di aggiornamento
        setAccessToken("");
        setRefreshToken("");
        // Ripristina l'archivio di apollo
        client.resetStore();
        // aggiorna lo stato
        dispatch({type: AuthActionType.LOGOUT, payload: null});
      },
    }),
    [],
  );

  return <AuthContext.Provider value={{...state, ...actions}} {...props} />;
};

export {AuthContext, AuthProvider};
