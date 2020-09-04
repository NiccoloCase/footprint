import React, {useEffect, useState, useRef, useMemo} from "react";
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
import {useStoreState} from "../../store";
import {LIKES_PER_BUCKET} from "@footprint/config/dist/constants";

const {width} = Dimensions.get("screen");
const FEED_CARD_WIDTH = (width * 90) / 100;
export const FEED_ITEMS_PER_QUERY = 10;

export const HomeScreen: React.FC = () => {
  const carousel = useRef<Carousel<NewsFeedItem> | null>(null);
  // Se il feed si sta venendo aggiornato
  const [refreshing, setRefreshing] = useState(false);
  // Se non ci sono più elementi nel feed
  const [areThereNoMoreItems, setAreThereNoMoreItems] = useState(false);
  // Utente autenticato
  const loggesUser = useStoreState((s) => s.auth.userId);

  // GRAPHQL
  const {data, loading, fetchMore, refetch} = useGetNewsFeedQuery({
    variables: {
      pagination: {limit: FEED_ITEMS_PER_QUERY},
      isLikedBy: loggesUser,
    },
    notifyOnNetworkStatusChange: true,
  });
  const [seeFeedItem] = useMarkFeedItemAsSeenMutation();

  // Items del feed
  // Elimina quelli a cui non è associato nessun footprint
  const feedItems = useMemo(
    () => (data ? data.getNewsFeed.filter((item) => !!item.footprint) : []),
    [data],
  );

  // Funzione chiamata quando viene caricato per la prima volta il feed
  useEffect(() => {
    if (!loading && refreshing) setRefreshing(false);
    else if (data) {
      // Segna come letto il primo elemento del feed
      const firstFeedItem = data.getNewsFeed[0];
      if (!firstFeedItem.isSeen) markFeedItemAsSeen(firstFeedItem);
    }
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
    if (!loading && index >= feed.length - 2 && !areThereNoMoreItems) {
      try {
        if (fetchMore)
          await fetchMore({
            variables: {
              pagination: {offset: feed.length, limit: FEED_ITEMS_PER_QUERY},
            },
            updateQuery: (prev, {fetchMoreResult}) => {
              if (!fetchMoreResult) return prev;
              // Controlla se sono finiti gli elementi del feed
              if (fetchMoreResult.getNewsFeed.length < LIKES_PER_BUCKET)
                setAreThereNoMoreItems(true);
              // Aggiorna la cache
              return Object.assign({}, prev, {
                getNewsFeed: [
                  ...prev.getNewsFeed,
                  ...fetchMoreResult.getNewsFeed,
                ],
              });
            },
          });
      } catch (err) {
        console.log(err);
      }
    }
  };

  /**
   * Segna l'elemento del feed passato come "visualizzato"
   */
  const markFeedItemAsSeen = async (
    feedItem: Pick<NewsFeedItem, "isSeen" | "id">,
  ): Promise<void> => {
    if (feedItem && !feedItem.isSeen) {
      try {
        const {errors, data} = await seeFeedItem({
          variables: {id: feedItem.id},
        });
        if (!errors && data) feedItem.isSeen = true;
      } catch (err) {
        console.log(err);
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
    setAreThereNoMoreItems(false);
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
    // Se il footprint è quello visualizzato
    const current = carousel.current
      ? carousel.current.currentIndex === index
      : false;

    return (
      <FootprintCard
        key={index}
        current={current}
        feedId={item.id}
        footprintId={item.footprint!.id}
        authorId={item.footprint!.authorId}
        title={item.footprint!.title}
        username={item.footprint!.author.username || "nicco"}
        locationName={item.footprint!.location.locationName}
        image={item.footprint!.media!}
        profilePicture={item.footprint!.author.profileImage}
        userHasLiked={!!item.footprint!.isLikedBy}
        likesCount={item.footprint!.likesCount}
        createdData={item.footprint!.created_at}
      />
    );
  };

  /**
   * Renderizza il feed
   */
  const renderFeed = () => {
    // Mostra il feed
    if (feedItems.length > 0)
      return (
        <Carousel
          ref={carousel}
          data={feedItems as any[]}
          renderItem={renderFeedItem}
          sliderWidth={width}
          itemWidth={FEED_CARD_WIDTH}
          inactiveSlideScale={0.93}
          onSnapToItem={onSnapToItem}
          layout="tinder"
        />
      );
    // Il feed è vuoto
    else if (data && feedItems.length === 0)
      // TODO:
      return <Text>Il feed è vuoto</Text>;
    // Il feed st caricando
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
    // Si è verificatro un errore
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
