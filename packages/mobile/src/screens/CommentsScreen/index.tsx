import React, {useState, useRef} from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  FlatList,
  ListRenderItemInfo,
  RefreshControl,
  Alert,
} from "react-native";
import {Spacing, Colors} from "../../styles";
import FeatherIcon from "react-native-vector-icons/Feather";
import Icon from "react-native-vector-icons/FontAwesome5";
import {useNavigation} from "@react-navigation/native";
import {SharedElement} from "react-navigation-shared-element";
import {
  useGetCommentsQuery,
  Comment,
  User,
  usePostCommentMutation,
  GetCommentsDocument,
  useDelateCommentMutation,
} from "../../generated/graphql";
import {useStoreState} from "../../store";
import {StackScreenProps} from "@react-navigation/stack";
import {AppStackParamList} from "../../navigation";
import {Spinner} from "../../components/Spinner";
import {timeSince} from "../../utils/format";
import Snackbar from "react-native-snackbar";
import {date} from "yup";

const AVATAR_RADIUS = 25;

type CommentsScreenProps = StackScreenProps<
  AppStackParamList,
  "CommentsScreen"
>;

export const CommentsScreen: React.FC<CommentsScreenProps> = ({route}) => {
  // Navigazione
  const navigation = useNavigation();
  const {contentId, textInputValue} = route.params;

  const [value, setValue] = useState(textInputValue || "");
  const flatListRef = useRef<FlatList | null>(null);

  // ID dell'utente loggato
  const ownId = useStoreState((s) => s.auth.userId);

  // Graphql
  const {data, error, loading, refetch, fetchMore} = useGetCommentsQuery({
    variables: {contentId},
    notifyOnNetworkStatusChange: true,
  });
  const [
    postCommentMutation,
    {loading: postingComment},
  ] = usePostCommentMutation();
  const [delateCommentMutation] = useDelateCommentMutation();

  /**
   * Carica nuovi commenti
   * @param id
   */
  const handleLoadMore = () => {
    fetchMore({
      variables: {
        contentId,
        page: 1,
      },
      updateQuery: () => {},
    });
  };

  /**
   * Elimina un commento
   * @param id
   */
  const deleteComment = (id: string) => async () => {
    try {
      const {data, errors} = await delateCommentMutation({
        variables: {
          contentId,
          id,
        },
        // Aggiorna la cache
        update: (proxy, {data: newData}) => {
          try {
            // Ottiene i commenti salvati nella cache
            const prevData = proxy.readQuery({
              query: GetCommentsDocument,
              variables: {contentId},
            }) as any;

            if (!prevData || !newData || !newData.delateComment.success) return;

            // Elimina il commento
            prevData.getComments = (prevData.getComments as Comment[]).filter(
              (comment) => comment.id !== id,
            );

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

      if (!data || !data.delateComment.success || errors) throw new Error();
    } catch (err) {
      console.log(JSON.stringify(err));
      Snackbar.show({
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: Colors.primary,
        text: "Si è verificato un errore. Riprova più tardi",
      });
    }
  };

  /**
   * Pubblica un commento
   */
  const postComment = async () => {
    try {
      const {errors, data} = await postCommentMutation({
        variables: {contentId, text: value},
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
      if (!data || errors) throw new Error();

      // Scrolla verso l'alto
      if (flatListRef.current)
        flatListRef.current.scrollToOffset({offset: 0, animated: true});

      // Pulisce la casella di testo
      setValue("");
    } catch (err) {
      Snackbar.show({
        duration: Snackbar.LENGTH_SHORT,
        text: "Si è verificato un errore. Riprova più tardi",
      });
    }
  };

  /**
   * Renderizza l'icona di cariamento in fondo alla lista di commenti
   */
  const renderFooter = () =>
    loading ? (
      <View style={{borderTopWidth: 0}}>
        <Spinner color={Colors.primary} />
      </View>
    ) : null;

  const renderComment = (
    payload: ListRenderItemInfo<
      Pick<Comment, "text" | "id" | "createdAt"> & {
        author: Pick<User, "id" | "username" | "profileImage">;
      }
    >,
  ) => {
    const {item: comment} = payload;

    const own = comment.author.id === ownId;

    return (
      <View style={[styles.commentWrapper, styles.inline]}>
        <View style={styles.avatarWrapper}>
          <Image
            source={{uri: comment.author.profileImage}}
            style={styles.avatar}
          />
        </View>
        <View style={{flex: 1}}>
          <View style={styles.inline}>
            <Text style={styles.commentAuthor}>{comment.author.username}</Text>
            <Text style={styles.createdAt}>{timeSince(comment.createdAt)}</Text>
          </View>
          <Text style={styles.commentBody}>{comment.text}</Text>
        </View>
        <View>
          {own && (
            <TouchableOpacity onPress={deleteComment(comment.id)}>
              <Text style={styles.deleteComment}>Elimina</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const renderComments = () => {
    if (error)
      // TODO
      return (
        <View style={styles.center}>
          <Text>Si è verificato un errore</Text>
        </View>
      );
    else if (data)
      return (
        <FlatList
          ref={flatListRef}
          data={data.getComments as any}
          renderItem={renderComment}
          keyExtractor={(comment) => comment.id}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              colors={[Colors.primary]}
              onRefresh={refetch}
            />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
        />
      );
    else
      return (
        <View style={styles.center}>
          <Spinner color={Colors.primary} />
        </View>
      );
  };

  return (
    <View style={styles.container}>
      <SharedElement id={`comments.card.${contentId}`}>
        <View style={styles.card}>
          <View style={styles.content}>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => {}}>
                <SharedElement id={`comments.card.${contentId}.title`}>
                  <Text style={styles.title}>Commenti</Text>
                </SharedElement>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{flex: 1, alignItems: "flex-end"}}>
                <Icon name="times" color={Colors.darkGrey} size={24} />
              </TouchableOpacity>
            </View>
            {renderComments()}
          </View>
          <SharedElement id={`comments.card.${contentId}.inputBox`}>
            <View style={styles.inputBox}>
              <TextInput
                placeholder="Posta un commento..."
                value={value}
                onChangeText={(t) => setValue(t)}
                style={styles.textInput}
              />
              {postingComment ? (
                <View>
                  <Spinner color="#707070" size={25} />
                </View>
              ) : (
                <TouchableOpacity onPress={postComment} disabled={!value}>
                  <FeatherIcon name="send" color="#707070" size={25} />
                </TouchableOpacity>
              )}
            </View>
          </SharedElement>
        </View>
      </SharedElement>
    </View>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    paddingHorizontal: Spacing.screenHorizontalPadding,
    paddingVertical: 15,
  },
  scrollView: {},
  card: {
    height: "100%",
    backgroundColor: "#eee",
    overflow: "hidden",
    borderRadius: 10,
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 4,
  },
  content: {
    padding: 20,
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  title: {
    color: Colors.darkGrey,
    fontWeight: "bold",
    fontSize: 24,
  },
  inputBox: {
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: Spacing.screenHorizontalPadding,
  },
  textInput: {
    flex: 1,
    fontSize: 17,
    padding: 0,
    color: Colors.darkGrey,
  },
  inline: {
    flexDirection: "row",
    alignItems: "center",
  },
  commentWrapper: {
    backgroundColor: "#fff",
    marginBottom: 15,
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  avatarWrapper: {
    marginRight: 15,
    width: AVATAR_RADIUS * 2,
    height: AVATAR_RADIUS * 2,
    borderRadius: AVATAR_RADIUS,
    overflow: "hidden",
    backgroundColor: "#eee",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  commentAuthor: {
    flex: 1,
    color: Colors.darkGrey,
    fontSize: 17,
    fontWeight: "bold",
  },
  createdAt: {
    color: "#606060",
    fontSize: 14,
  },
  commentBody: {
    color: "#909090",
    fontSize: 17,
  },
  deleteComment: {
    fontSize: 15,
    color: Colors.errorRed,
  },
});
