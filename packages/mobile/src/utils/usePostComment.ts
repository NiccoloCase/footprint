import {
  usePostCommentMutation,
  GetCommentsDocument,
  PostCommentMutation,
} from "../generated/graphql";
import Snackbar from "react-native-snackbar";
import {ExecutionResult} from "apollo-link";

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
        try {
          // Ottiene i commenti salvati nella cache
          const prevData = proxy.readQuery({
            query: GetCommentsDocument,
            variables: {contentId},
          }) as any;

          if (!newData || !prevData) return;

          // Aggiunge il nuovo commento
          prevData.getComments.unshift(newData.postComment);
          proxy.writeQuery({
            query: GetCommentsDocument,
            variables: {contentId},
            data: prevData,
          });
        } catch (error) {
          console.log(error);
        }
      },
    });
  };

  return [postComment, loading];
};
