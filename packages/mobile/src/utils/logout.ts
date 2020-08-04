import {store} from "../store";
import {client} from "../graphql";

/**
 * Disconnette l'utente e pulisce la cache di Apollo
 */
export const logout = async () => {
  await store.getActions().auth.logout();
  await client.clearStore();
};
