import React from "react";
import {
  StyleSheet,
  FlatList,
  TouchableHighlight,
  ListRenderItemInfo,
  Text,
  Image,
  View,
} from "react-native";
import {Spinner} from "../../components/Spinner";
import {User} from "../../generated/graphql";
import {useNavigateToUserProfile} from "../../navigation/navigateToUserProfile";
import {Colors} from "../../styles";
import LottieView from "lottie-react-native";

const AVATAR_RADIUS = 30;

interface FollowersScreenContentProps {
  data?: any[];
  error: boolean;
  loading: boolean;
  handleLoadMore: () => void;
  contentType: "followers" | "following";
}

export const FollowersScreenContent: React.FC<FollowersScreenContentProps> = ({
  data,
  error,
  loading,
  handleLoadMore,
  contentType,
}) => {
  // Naviga alla scherata dell'utente
  const navigateToUserProfile = useNavigateToUserProfile();

  const renderAvatar = (
    payload: ListRenderItemInfo<Pick<User, "username" | "profileImage" | "id">>,
  ) => {
    const {username, profileImage, id} = payload.item;

    return (
      <TouchableHighlight
        underlayColor="#e2e2e2"
        onPress={() => navigateToUserProfile(id)}
        style={styles.avatarWrapper}>
        <View style={styles.avatarContainer}>
          <Image source={{uri: profileImage}} style={styles.avatar} />
          <Text style={styles.avatarName}>{username + payload.index}</Text>
        </View>
      </TouchableHighlight>
    );
  };

  const renderFooter = () => {
    if (!loading) return null;

    return (
      <View style={{borderTopWidth: 0}}>
        <Spinner color={Colors.primary} />
      </View>
    );
  };

  if (data && data.length > 0)
    return (
      <FlatList
        style={styles.content}
        data={data}
        renderItem={renderAvatar}
        keyExtractor={(user) => user.id}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
      />
    );
  else if (data && data.length === 0)
    return (
      <Text style={styles.emptyMessage}>{`L'utente ${
        contentType === "followers"
          ? "non ha ancora nessun follower"
          : "non segue ancora nessuno"
      }`}</Text>
    );
  else if (error)
    return (
      <View style={styles.container}>
        <LottieView
          source={require("../../assets/lottie/pc-error.json")}
          resizeMode="cover"
          style={{width: 230, height: 230}}
          autoPlay
          loop
        />
        <Text style={styles.errorMessage}>Si è verificato un errore!</Text>
      </View>
    );
  else return <Spinner color={Colors.primary} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    marginTop: 25,
  },
  avatarWrapper: {
    marginBottom: 5,
    padding: 5,
    borderRadius: 10,
  },
  avatarContainer: {
    alignItems: "center",
    flexDirection: "row",
  },
  avatar: {
    width: AVATAR_RADIUS * 2,
    height: AVATAR_RADIUS * 2,
    borderRadius: AVATAR_RADIUS,
  },
  avatarName: {
    color: Colors.darkGrey,
    fontSize: 17,
    fontWeight: "bold",
    marginLeft: 10,
  },
  emptyMessage: {
    flex: 1,
    color: Colors.darkGrey,
    fontSize: 16,
    fontWeight: "bold",
    alignSelf: "center",
    textAlignVertical: "center",
  },
  errorMessage: {
    color: Colors.darkGrey,
    fontWeight: "bold",
    fontSize: 18,
  },
});
