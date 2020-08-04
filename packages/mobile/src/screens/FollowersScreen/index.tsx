import React, {useState, useRef} from "react";
import {View, StyleSheet, Text, TouchableOpacity} from "react-native";
import Swiper from "react-native-swiper";
import {Spacing, Colors} from "../../styles";
import {SharedElement} from "react-navigation-shared-element";
import Icon from "react-native-vector-icons/FontAwesome5";
import {StackScreenProps} from "@react-navigation/stack";
import {AppStackParamList} from "../../navigation";
import {FollowersView} from "./followers";
import {FollowingView} from "./following";

const ITEMS_PER_BUCKET = 10;

type FollowersScreenProps = StackScreenProps<
  AppStackParamList,
  "FollowersScreen"
>;

export const FollowersScreen: React.FC<FollowersScreenProps> = ({
  navigation,
  route,
}) => {
  const swiperRef = useRef<Swiper | null>(null);
  const {userId, following} = route.params;
  // Se mostra i followers (se no i seguti)
  const [showFollower, setShowFollowers] = useState(!following);

  const goToFollowers = () => {
    if (showFollower || !swiperRef.current) return;
    setShowFollowers(true);
    swiperRef.current.scrollTo(0);
  };

  const goToFollowing = () => {
    if (!showFollower || !swiperRef.current) return;
    setShowFollowers(false);
    swiperRef.current.scrollTo(1);
  };

  const onIndexChanged = (index: number) => {
    if (index === 0 && !showFollower) setShowFollowers(true);
    else if (index === 1 && showFollower) setShowFollowers(false);
  };

  return (
    <View style={styles.container}>
      <SharedElement id={`followers.card.${userId}`}>
        <View style={styles.card}>
          <View style={styles.header}>
            <TouchableOpacity onPress={goToFollowers}>
              <SharedElement id={`followers.card.${userId}.title`}>
                <Text
                  style={[
                    showFollower ? styles.title : styles.otherTitle,
                    {marginRight: 20},
                  ]}>
                  Followers
                </Text>
              </SharedElement>
            </TouchableOpacity>
            <TouchableOpacity onPress={goToFollowing}>
              <Text style={!showFollower ? styles.title : styles.otherTitle}>
                Seguiti
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{flex: 1, alignItems: "flex-end"}}>
              <Icon name="times" color={Colors.darkGrey} size={24} />
            </TouchableOpacity>
          </View>

          <Swiper
            index={following ? 1 : 0}
            loop={false}
            ref={swiperRef}
            onIndexChanged={onIndexChanged}
            showsPagination={false}>
            <FollowersView userId={userId} limit={ITEMS_PER_BUCKET} />
            <FollowingView userId={userId} limit={ITEMS_PER_BUCKET} />
          </Swiper>
        </View>
      </SharedElement>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.screenHorizontalPadding,
    paddingVertical: 15,
  },
  card: {
    backgroundColor: "#eee",
    borderRadius: 10,
    padding: 20,
    height: "100%",

    // ombra:
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 4,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    color: Colors.darkGrey,
    fontWeight: "bold",
    fontSize: 24,
    borderBottomColor: Colors.primary,
    borderBottomWidth: 2,
  },
  otherTitle: {
    color: Colors.darkGrey,
    fontWeight: "bold",
  },
});
