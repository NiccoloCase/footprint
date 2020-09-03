import {useState, useEffect} from "react";
import {
  useAddLikeToFootprintMutation,
  useRemoveFootprintLikeMutation,
  AddLikeToFootprintDocument,
  GetFootprintsByIdDocument,
  Footprint,
} from "../../generated/graphql";
import {useStoreState} from "../../store";
import Snackbar from "react-native-snackbar";
import {Colors} from "../../styles";
import gql from "graphql-tag";
import {client} from "../../graphql";

export const useFootprintLikes = (
  footprintId: string,
  footprintAuthor: string,
  isAlreadyLiked: boolean = false,
): [boolean, () => void] => {
  // Se l'utente ha già messo like al footprint
  const [isLiked, setIsLiked] = useState(isAlreadyLiked);
  // utente loggato
  const loggedUser = useStoreState((s) => s.auth.userId);
  // GRAPHQL
  const [addLike] = useAddLikeToFootprintMutation();
  const [removeLike] = useRemoveFootprintLikeMutation();

  useEffect(() => {
    if (isAlreadyLiked !== isLiked) setIsLiked(isAlreadyLiked);
  }, [isAlreadyLiked]);

  const handleLikeButtonPress = () => {
    // Controlla che l'utente non stia cercando di mettere un like
    // a un suo footprint
    if (loggedUser === footprintAuthor)
      return Snackbar.show({
        text: "Non puoi mettere like a un tuo stesso footprint",
        backgroundColor: Colors.primary,
        duration: Snackbar.LENGTH_SHORT,
      });

    const fragment = gql`
      fragment MyFootprint on Footprint {
        likesCount
        isLikedBy(userId: $userId)
        __typename
      }
    `;

    // Aggiunge il like
    if (!isLiked) {
      addLike({
        variables: {id: footprintId},
        // Aggiorna la cache
        update: (proxy, {data: newData}) => {
          if (!newData?.addLikeToFootprint.success) return;

          try {
            const footprint: Pick<
              Footprint,
              "isLikedBy" | "likesCount"
            > | null = proxy.readFragment({
              id: footprintId,
              fragment,
              variables: {userId: loggedUser},
            });

            if (!footprint) return null;

            client.writeFragment({
              id: footprintId,
              variables: {userId: loggedUser},
              fragment,
              data: {
                likesCount: footprint.likesCount + 1,
                __typename: "Footprint",
                isLikedBy: true,
              },
            });
          } catch (error) {
            console.log(error);
          }
        },
      })
        .then(({data, errors}) => {
          if (!data || !data.addLikeToFootprint.success || errors)
            throw new Error();
        })
        .catch(() => setIsLiked(true));
    }
    // Rimuove il like
    else {
      removeLike({
        variables: {id: footprintId},
        // Aggiorna la cache
        update: (proxy, {data: newData}) => {
          if (!newData?.removeFootprintLike.success) return;

          try {
            const footprint: Pick<
              Footprint,
              "isLikedBy" | "likesCount"
            > | null = proxy.readFragment({
              id: footprintId,
              fragment,
              variables: {userId: loggedUser},
            });

            if (!footprint) return null;

            client.writeFragment({
              id: footprintId,
              fragment,
              variables: {userId: loggedUser},
              data: {
                __typename: "Footprint",
                likesCount: footprint.likesCount - 1,
                isLikedBy: false,
              },
            });
          } catch (error) {
            console.log(error);
          }
        },
      })
        .then(({data, errors}) => {
          if (!data || !data.removeFootprintLike.success || errors)
            throw new Error();
        })
        .catch(() => setIsLiked(true));
    }

    // Aggiorna lo stato del bottone
    setIsLiked(!isLiked);
  };

  return [isLiked, handleLikeButtonPress];
};
