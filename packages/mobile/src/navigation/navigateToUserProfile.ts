import {CommonActions, useNavigation} from "@react-navigation/native";
import {store} from "../store";

export const navigateToUserProfile = (
  userId?: string,
): CommonActions.Action => {
  const ownId = store.getState().auth.userId;

  if (!userId || userId === ownId) return CommonActions.navigate("MyProfile");
  else return CommonActions.navigate("Profile", {id: userId});
};

/**
 * Restituisce una funzione che se chiamata reindirizza l'utente nella schermata
 * del proprio profilo, se non passato nessun ID o se questo coincide con quello
 * dell'utente loggato, o nella schermata del profilo dell'utente associato
 * all'ID passato
 */
export const useNavigateToUserProfile = () => {
  const {dispatch} = useNavigation();

  /**
   * Reindirizza l'utente nella schermata
   * del proprio profilo, se non passato nessun ID o se questo coincide con quello
   * dell'utente loggato, o nella schermata del profilo dell'utente associato
   * all'ID passato
   */
  const navigate = (userId?: string) => dispatch(navigateToUserProfile(userId));

  return navigate;
};
