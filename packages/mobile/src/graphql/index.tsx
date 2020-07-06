import React from "react";
import {Platform} from "react-native";
import {ApolloProvider as ApolloHooksProvider} from "@apollo/react-hooks";
import {ApolloClient} from "apollo-client";
import {setContext} from "apollo-link-context";
import {HttpLink} from "apollo-link-http";
import {onError} from "apollo-link-error";
import {InMemoryCache} from "apollo-cache-inmemory";
import {TokenRefreshLink} from "apollo-link-token-refresh";
import {ApolloLink} from "apollo-link";
import jwtDecode from "jwt-decode";
import Snackbar from "react-native-snackbar";
import config from "@footprint/config";
import {fetchAccessToken} from "../utils/fetchAccessToken";
import {API_URL} from "../utils/api";
import {store} from "../store";
import {Colors} from "../styles";

const cache = new InMemoryCache();

const httpLink = new HttpLink({uri: API_URL + "/graphql"});

const authLink = setContext((_, {headers}) => {
  const {accessToken} = store.getState().auth;
  return {
    headers: {
      ...headers,
      authorization: accessToken ? `Bearer ${accessToken}` : "",
    },
  };
});

const tokenRefreshLink = new TokenRefreshLink<{
  accessToken: string;
  refreshToken: string;
}>({
  accessTokenField: "tokens",
  isTokenValidOrUndefined: () => {
    const token = store.getState().auth.accessToken;
    if (!token) return true;

    try {
      const {exp} = jwtDecode(token);
      // controlla se il token di accesso è scaduto
      return Date.now() < exp * 1000;
    } catch {
      return false;
    }
  },
  fetchAccessToken,
  handleFetch: (tokens) => {
    const {accessToken, refreshToken} = tokens;
    // aggiorna il token di accesso e il token di aggiornamento
    store.getActions().auth.singin({accessToken, refreshToken});
  },
  handleError: (err) => {
    console.error(err);
    store.getActions().auth.setIsAuthenticated(false);
  },
});

const errorLink = onError(({graphQLErrors, networkError}) => {
  // riporta l'utente alla schermata di autenticazione se l'errore
  // ha come stato 401 unauthorized
  if (graphQLErrors) {
    for (let err of graphQLErrors) {
      if (
        err.extensions &&
        err.extensions.exception &&
        err.extensions.exception.status === 401
      )
        store.getActions().auth.setIsAuthenticated(false);
    }
  }
  // se è avvenuto un errore di connessione al server mostra
  // all'utente un messaggio
  if (networkError) {
    Snackbar.show({
      text: "Non è possibile connetteri al server. Prova più tardi",
      duration: Snackbar.LENGTH_LONG,
      backgroundColor: Colors.primary,
    });
  }
});

export const client = new ApolloClient({
  connectToDevTools: !config.IS_PRODUCTION,
  link: ApolloLink.from([
    tokenRefreshLink as any,
    authLink,
    errorLink,
    httpLink,
  ]),
  cache,
});

export const ApolloProvider: React.FC = ({children}) => (
  <ApolloHooksProvider client={client}>{children}</ApolloHooksProvider>
);
