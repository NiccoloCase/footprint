import {
  usePostCommentMutation,
  GetCommentsDocument,
  PostCommentMutation,
  Footprint,
} from "../../generated/graphql";
import {ExecutionResult} from "apollo-link";
import gql from "graphql-tag";

/**
 * Posta un nuovo commento e aggiorna la cache di Apollo
 */
export const usePostComment = (): [
  (
    contentId: string,
    text: string,
  ) => Promise<ExecutionResult<PostCommentMutation>>,
  boolean,
] => {
  const [postCommentMutation, {loading}] = usePostCommentMutation();

  const postComment = async (
    contentId: string,
    text: string,
  ): Promise<ExecutionResult<PostCommentMutation>> => {
    return await postCommentMutation({
      variables: {contentId, text},
      // Aggiorna la cache
      update: (proxy, {data: newData}) => {
        if (!newData) return;

        // 1) Aggiunge il nuovo commento alla lista di commenti nella cache
        try {
          // Ottiene i commenti salvati nella cache
          const prevData = proxy.readQuery({
            query: GetCommentsDocument,
            variables: {contentId},
          }) as any;

          if (prevData) {
            prevData.getComments.unshift(newData.postComment);
            proxy.writeQuery({
              query: GetCommentsDocument,
              variables: {contentId},
              data: prevData,
            });
          }
        } catch (error) {}

        // 2) Aggiorna il numero di commenti del footprint
        try {
          const fragment = gql`
            fragment MyFootprint on Footprint {
              commentsCount
              __typename
            }
          `;

          const footprint: Pick<
            Footprint,
            "commentsCount"
          > | null = proxy.readFragment({
            id: contentId,
            fragment,
          });

          if (footprint)
            proxy.writeFragment({
              id: contentId,
              fragment,
              data: {
                commentsCount: footprint.commentsCount + 1,
                __typename: "Footprint",
              },
            });
        } catch (err) {}
      },
    });
  };

  return [postComment, loading];
};
