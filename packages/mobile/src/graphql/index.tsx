import React from "react";
import {Platform, AsyncStorage} from "react-native";
import {ApolloProvider as ApolloHooksProvider} from "@apollo/react-hooks";
import {ApolloClient} from "apollo-client";
import {setContext} from "apollo-link-context";
import {HttpLink} from "apollo-link-http";
import {onError} from "apollo-link-error";
import {InMemoryCache} from "apollo-cache-inmemory";
import {TokenRefreshLink} from "apollo-link-token-refresh";
import jwtDecode from "jwt-decode";
import config from "@footprint/config";
import {ApolloLink} from "apollo-link";
import {
  getAccessToken,
  fetchAccessToken,
  setAccessToken,
  setRefreshToken,
} from "../auth";

const graphqlURI = config.IS_PRODUCTION
  ? config.server.API_URL + "/graphql"
  : `http://${
      Platform.OS === "android" ? "10.0.2.2" : "localhost"
    }:5000/api/graphql`;

const cache = new InMemoryCache();

const httpLink = new HttpLink({uri: graphqlURI});

const authLink = setContext((_, {headers}) => {
  const accessToken = getAccessToken();
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
    const token = getAccessToken();
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
    // aggriona il token di accesso
    setAccessToken(accessToken);
    // aggiorna il token di aggiornamento
    setRefreshToken(refreshToken);
  },
  handleError: (err) => {
    // TODO
    console.warn("Your refresh token is invalid. Try to relogin");
    console.error(err);
  },
});

// TODO
const errorLink = onError(({graphQLErrors, networkError}) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({message, locations, path}) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      ),
    );
  if (networkError) console.log(`[Network error]: ${networkError}`);
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
