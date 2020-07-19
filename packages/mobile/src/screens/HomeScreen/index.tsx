import React, {useEffect, useState} from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  RefreshControl,
} from "react-native";
import Carousel from "react-native-snap-carousel";
import {Spacing, Colors} from "../../styles";
import {FootprintCard} from "./FootprintCard";
import {
  useGetNewsFeedQuery,
  NewsFeedItem,
  useMarkFeedItemAsSeenMutation,
} from "../../generated/graphql";
import {Spinner} from "../../components/Spinner";
import {ScrollView} from "react-native-gesture-handler";

const {width} = Dimensions.get("screen");
const FEED_CARD_WIDTH = (width * 90) / 100;

export const HomeScreen: React.FC = () => {
  // Se il feed si sta venendo aggiornato
  const [refreshing, setRefreshing] = useState(false);
  // GRAPHQL
  const {data, loading, fetchMore, refetch} = useGetNewsFeedQuery({
    variables: {pagination: {limit: 10}},
    notifyOnNetworkStatusChange: true,
  });
  const [seeFeedItem] = useMarkFeedItemAsSeenMutation();

  // Funzione chiamata quando viene caricato per la prima volta il feed
  useEffect(() => {
    if (!loading && refreshing) setRefreshing(false);

    if (!data) return;
    const firstFeedItem = data.getNewsFeed[0];
    markFeedItemAsSeen(firstFeedItem);
  }, [loading]);

  /**
   * Funzione chiamata quando l'utente "scrolla" un elemento del feed
   * @param index Indece dell'elemento visualizzato
   */
  const onSnapToItem = async (index: number) => {
    if (!data) return;
    const feed = data.getNewsFeed;
    const feedItem = feed[index];

    // Segna l'elemento corrente come "visualizzato"
    markFeedItemAsSeen(feedItem);

    // Se l'elemento visualizzato è il penltimo chiama l'API
    // per altri footprints
    if (!loading && index >= feed.length - 2) {
      try {
        await fetchMore({
          variables: {
            pagination: {offset: feed.length},
          },
          updateQuery: (prev, {fetchMoreResult}) => {
            if (!fetchMoreResult) return prev;
            return Object.assign({}, prev, {
              getNewsFeed: [
                ...prev.getNewsFeed,
                ...fetchMoreResult.getNewsFeed,
              ],
            });
          },
        });
      } catch (err) {
        console.error(err);
      }
    }
  };

  /**
   * Segna l'elemento del feed passato come "visualizzato"
   */
  const markFeedItemAsSeen = async (
    feedItem: Pick<NewsFeedItem, "isSeen" | "id">,
  ): Promise<void> => {
    if (!feedItem.isSeen) {
      try {
        const {errors, data} = await seeFeedItem({
          variables: {id: feedItem.id},
        });
        if (!errors && data) feedItem.isSeen = true;
      } catch (err) {
        console.error(err);
      }
    }
  };

  /**
   * Aggiorna il feed
   */
  const onRefresh = () => {
    if (loading) return;
    refetch();
    setRefreshing(true);
  };

  /**
   * Renderizza un elemento del feed
   */
  const renderFeedItem = ({
    item,
    index,
  }: {
    item: NewsFeedItem;
    index: number;
  }) => {
    return (
      <FootprintCard
        feedId={item.id}
        footprintId={item.footprint.id}
        authorId={item.footprint.authorId}
        title={item.footprint.title}
        username={item.footprint.author.username || "nicco"}
        image={
          /*      item.footprint.media!*/
          "https://res.cloudinary.com/dgjcj7htv/image/upload/v1594741910/static/photo-1444041103143-1d0586b9c0b8_dq5w61.jpg"
        }
        profilePicture={
          item.footprint.author.profileImage ||
          "https://res.cloudinary.com/dgjcj7htv/image/upload/v1594741910/static/photo-1444041103143-1d0586b9c0b8_dq5w61.jpg"
        }
        key={index}
      />
    );
  };

  /**
   * Renderizza il feed
   */
  const renderFeed = () => {
    if (data)
      return (
        <Carousel
          data={data.getNewsFeed}
          renderItem={renderFeedItem}
          sliderWidth={width}
          itemWidth={FEED_CARD_WIDTH}
          inactiveSlideScale={0.93}
          onSnapToItem={onSnapToItem}
          layout="tinder"
        />
      );
    else if (loading)
      return (
        <View
          style={{
            backgroundColor: "#eee",
            height: "100%",
            width: FEED_CARD_WIDTH,
            borderRadius: 10,
          }}>
          <Spinner color={Colors.primary} />
        </View>
      );
    // TODO:
    else return <Text>Errore</Text>;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
          />
        }>
        <View>{renderFeed()}</View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: Spacing.screenHorizontalPadding,
  },
});
