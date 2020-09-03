import React, {useState, useRef, useEffect} from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ListRenderItemInfo,
  RefreshControl,
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
  GetCommentsDocument,
  useDelateCommentMutation,
} from "../../generated/graphql";
import {useStoreState} from "../../store";
import {StackScreenProps} from "@react-navigation/stack";
import {AppStackParamList} from "../../navigation";
import {Spinner} from "../../components/Spinner";
import Snackbar from "react-native-snackbar";
import {constants} from "@footprint/config";
import {CommentCard} from "./CommentCard";
import {usePostComment} from "../../utils/hooks";
import {useFormik} from "formik";
import {PostCommentValidationSchema} from "../../utils/validation";
import {ErrorBadge} from "../../components/badges";

const {COMMENTS_PER_BUCKET} = constants;

const AVATAR_RADIUS = 25;

type CommentsScreenProps = StackScreenProps<
  AppStackParamList,
  "CommentsScreen"
>;

export interface PostCommentFormValues {
  text: string;
}

export const CommentsScreen: React.FC<CommentsScreenProps> = ({route}) => {
  // Navigazione
  const navigation = useNavigation();
  const {contentId, textInputValue} = route.params;

  // Se sono finiti i commenti
  const [areCommentsGone, setAreCommentsGone] = useState(false);
  // Se la schermata sta venendo ricaricata
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Form
  const formik = useFormik<PostCommentFormValues>({
    initialValues: {text: textInputValue || ""},
    validationSchema: PostCommentValidationSchema,
    onSubmit: postComment,
  });

  // ID dell'utente loggato
  const ownId = useStoreState((s) => s.auth.userId);

  const flatListRef = useRef<FlatList | null>(null);

  // Graphql
  const {data, error, loading, refetch, fetchMore} = useGetCommentsQuery({
    variables: {contentId},
    notifyOnNetworkStatusChange: true,
  });
  const [delateCommentMutation] = useDelateCommentMutation();
  const [postCommentMutation] = usePostComment();

  useEffect(() => {
    // Verifica se la schermata è stata ricaricata
    if (data && !error && isRefreshing) setIsRefreshing(false);

    // Controlla se i commenti sono finiti
    if (
      !areCommentsGone &&
      data &&
      data.getComments.length < COMMENTS_PER_BUCKET
    )
      setAreCommentsGone(true);
  }, [data]);

  /**
   * Carica nuovi commenti
   * @param id
   */
  const handleLoadMore = () => {
    if (!data || areCommentsGone || loading) return;
    const page = Math.ceil(data.getComments.length / COMMENTS_PER_BUCKET);

    fetchMore({
      variables: {contentId, page},
      // Aggiorna la cache
      updateQuery: (prev, {fetchMoreResult}) => {
        if (!fetchMoreResult) return prev;

        const newComments = fetchMoreResult.getComments;

        // Controlla se i commenti sono finiti
        if (newComments.length < COMMENTS_PER_BUCKET) setAreCommentsGone(true);

        // Aggiorna la query
        return Object.assign({}, prev, {
          getComments: [...prev.getComments, ...newComments],
        });
      },
    });
  };

  /**
   * Elimina un commento
   * @param id
   */
  const deleteComment = async (id: string) => {
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
  async function postComment(values: PostCommentFormValues) {
    const {text} = values;

    try {
      const {errors, data} = await postCommentMutation(contentId, text);
      if (!data || errors) throw new Error();

      // Scrolla verso l'alto
      if (flatListRef.current)
        flatListRef.current.scrollToOffset({offset: 0, animated: true});

      // Pulisce la casella di testo
      formik.setFieldValue("text", "");
      formik.setTouched({text: false});
    } catch (err) {
      Snackbar.show({
        duration: Snackbar.LENGTH_SHORT,
        text: "Si è verificato un errore. Riprova più tardi",
      });
    }
  }

  /**
   * Ricarica i commenti
   */
  const onRefresh = () => {
    setIsRefreshing(true);
    setAreCommentsGone(false);
    refetch();
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

  /**
   * Renderizza un singolo commento
   * @param payload
   */
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
      <CommentCard
        own={own}
        comment={comment}
        deleteCommentCallback={deleteComment}
      />
    );
  };

  const renderContent = () => {
    if (error)
      // TODO
      return (
        <View style={styles.center}>
          <Text style={styles.text}>Si è verificato un errore</Text>
        </View>
      );
    else if (data && data.getComments.length === 0)
      // TODO
      return (
        <View style={styles.center}>
          <Text style={styles.text}>
            Non ci sono ancora commenti.{"\n"}Postane uno te per primo!
          </Text>
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
              refreshing={isRefreshing}
              colors={[Colors.primary]}
              onRefresh={onRefresh}
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
            {renderContent()}
          </View>
          <SharedElement id={`comments.card.${contentId}.inputBox`}>
            <View style={styles.inputBox}>
              <TextInput
                placeholder="Posta un commento..."
                value={formik.values.text}
                onChangeText={(t) => formik.setFieldValue("text", t)}
                onBlur={() => formik.handleBlur("text")}
                style={styles.textInput}
              />
              {formik.errors.text && (
                <ErrorBadge
                  errorMessage={formik.errors.text}
                  style={{marginRight: 10}}
                />
              )}
              {formik.isSubmitting ? (
                <View>
                  <Spinner color="#707070" size={25} />
                </View>
              ) : (
                <TouchableOpacity
                  onPress={formik.handleSubmit as any}
                  disabled={!formik.isValid}>
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
  text: {
    color: Colors.darkGrey,
    fontWeight: "bold",
    fontSize: 15,
    lineHeight: 25,
    textAlign: "center",
  },
  card: {
    height: "100%",
    backgroundColor: "#eee",
    overflow: "hidden",
    borderRadius: 10,
    // ombra:
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
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
  commentFooter: {
    marginTop: 7,
    justifyContent: "flex-end",
  },
});
