import React, {useState} from "react";
import {
  View,
  Text,
  SafeAreaView,
  Image,
  StatusBar,
  TouchableWithoutFeedback,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Animated, {
  interpolate,
  Extrapolate,
  color,
} from "react-native-reanimated";
import {useValue, useTimingTransition} from "react-native-redash";
import Icon from "react-native-vector-icons/FontAwesome5";
import {AppStackParamList} from "../../navigation";
import {StackScreenProps} from "@react-navigation/stack";
import {SharedElement} from "react-navigation-shared-element";
import {useGetFootprintsByIdQuery} from "../../generated/graphql";
import {Colors} from "../../styles";
import {MoreMenu} from "./MoreMenu";
import styles, {IMAGE_HEIGHT, HEADER_HEIGHT, USER_CARD_HEIGHT} from "./styles";

// Cards
import {UserCard} from "./cards/UserCard";
import {LikesCard} from "./cards/LikesCard";
import {MapCard} from "./cards/MapCard";
import {CommentsCard} from "./cards/CommentsCard";
import {Spinner} from "../../components/Spinner";
import {useStoreState} from "../../store";

type FootprintScreenProps = StackScreenProps<AppStackParamList, "Footprint">;

export const FootprintScreen: React.FC<FootprintScreenProps> = ({
  route,
  navigation,
}) => {
  // Id dell'utente loggato
  const authId = useStoreState((s) => s.auth.userId);
  // Se mostare il titolo sipra l'immagine
  const [showImageContent, setShowImageContent] = useState(true);

  // Navigazione
  const {id, image, authorProfileImage, authorUsername, title} = route.params;

  // Graphql
  const {data, loading} = useGetFootprintsByIdQuery({variables: {id}});

  const footprintMediaUri = image || data?.getFootprintById.media;

  // Animazione:
  const y = useValue<number>(0);
  const titleOpacity = useTimingTransition(showImageContent);
  const headerOpacity = interpolate(y, {
    inputRange: [
      IMAGE_HEIGHT - HEADER_HEIGHT - 25,
      IMAGE_HEIGHT - HEADER_HEIGHT + 25,
    ],
    outputRange: [0, 1],
    extrapolate: Extrapolate.CLAMP,
  });

  const goBack = () => {
    if (navigation.canGoBack()) navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#303030" barStyle="light-content" />
      <ScrollView
        keyboardShouldPersistTaps="always"
        style={styles.scrollView}
        onScroll={(e) => y.setValue(e.nativeEvent.contentOffset.y)}>
        {/** IMMAGINE */}
        <TouchableWithoutFeedback
          onPressIn={() => setShowImageContent(false)}
          onPressOut={() => setShowImageContent(true)}>
          <View style={styles.imageContainer}>
            <SharedElement id={`footprint.${id}.image`}>
              {footprintMediaUri && (
                <Image style={styles.image} source={{uri: footprintMediaUri}} />
              )}
            </SharedElement>
            {/** TITOLO */}
            <Animated.View
              style={[styles.titleWrapper, {opacity: titleOpacity}]}>
              <SharedElement id={`footprint.${id}.title`}>
                <Text style={styles.title}>{title}</Text>
              </SharedElement>
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
        {/** ------ CONTENUTO ------ */}
        <SafeAreaView style={styles.content}>
          {/** AUTORE DEL FOOTPRINT */}
          <UserCard
            footprintId={id}
            height={USER_CARD_HEIGHT}
            footprintDate={data?.getFootprintById.created_at}
            userData={
              data
                ? data.getFootprintById.author
                : {
                    username: authorUsername,
                    profileImage: authorProfileImage,
                  }
            }
          />
          {/** DESCRIZIONE DEL FOOTPRINT */}
          <View style={styles.descriptionWrapper}>
            {loading ? (
              <Spinner color={Colors.primary} size={25} />
            ) : (
              <Text style={styles.description}>
                {data?.getFootprintById.body}
              </Text>
            )}
          </View>
          {/** LIKES */}
          <LikesCard
            footprintId={id}
            likesCount={100}
            likes={[
              {
                username: "nicco",
                profileImage: authorProfileImage,
                id: "1pid+pdoo",
              },
            ]}
          />
          {/** COMMENTI */}
          <CommentsCard footprintId={id} commentsCount={10} />
          {/** MAPPA */}
          {/*    <MapCard location={data?.getFootprintById.location} /> */}
        </SafeAreaView>
      </ScrollView>

      {/** HEADER */}
      <Animated.View
        style={[
          styles.header,
          {backgroundColor: color(48, 48, 48, headerOpacity)},
        ]}>
        <Animated.Text
          style={[styles.headerTitle, {opacity: headerOpacity}]}
          numberOfLines={1}>
          {title}
        </Animated.Text>
        <MoreMenu
          footprintId={id}
          own={authId === data?.getFootprintById.author.id}
        />
        <TouchableOpacity
          onPress={goBack}
          style={[styles.headerButton, {marginLeft: 8}]}>
          <Icon name="times" color="#eee" size={23} />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};
