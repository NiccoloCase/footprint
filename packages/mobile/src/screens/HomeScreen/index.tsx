import React, {useEffect, useState, useRef, useMemo} from "react";
import {
  View,
  Text,
  Dimensions,
  SafeAreaView,
  RefreshControl,
  Image,
  StyleSheet,
} from "react-native";
import Carousel from "react-native-snap-carousel";
import {Colors, Spacing} from "../../styles";
import {FootprintCard} from "./FootprintCard";
import {
  useGetNewsFeedQuery,
  NewsFeedItem,
  useMarkFeedItemAsSeenMutation,
} from "../../generated/graphql";
import Icon from "react-native-vector-icons/FontAwesome5";
import {LogoSpinner} from "../../components/Spinner";
import {ScrollView, TouchableOpacity} from "react-native-gesture-handler";
import LottieView from "lottie-react-native";
import {useStoreState} from "../../store";
import {constants} from "@footprint/config";

const {LIKES_PER_BUCKET} = constants;
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
    if (!loading && index >= feed.length - 3 && !areThereNoMoreItems) {
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
        username={item.footprint!.author.username}
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
    // Il feed sta caricando
    if (loading)
      return (
        <View style={styles.centered}>
          <LogoSpinner />
        </View>
      );
    // Il feed è vuoto
    else if (data && feedItems.length === 0)
      return (
        <View style={styles.centered}>
          <Image
            source={require("../../assets/images/tv.png")}
            style={{height: 200, width: 270}}
          />
          <Text style={styles.message}>Non ci sono ancora footprint!</Text>
        </View>
      );
    // Mostra il feed
    else if (data)
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
    // Si è verificatro un errore
    return (
      <View style={styles.centered}>
        <LottieView
          source={require("../../assets/lottie/pc-error.json")}
          resizeMode="cover"
          style={{width: 230, height: 230}}
          autoPlay
          loop
        />
        <Text style={styles.message}>Si è verificato un errore!</Text>
        <TouchableOpacity style={styles.reloadButton} onPress={onRefresh}>
          <Text style={styles.reloadButtonText}>Riprova</Text>
          <Icon name="redo" color="#fff" size={20} />
        </TouchableOpacity>
      </View>
    );
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
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  message: {
    color: Colors.darkGrey,
    fontWeight: "bold",
    fontSize: 18,
  },
  reloadButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  reloadButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    marginRight: 15,
  },
});
