import React, {useState, useEffect} from "react";
import {StyleSheet} from "react-native";
import {StackScreenProps} from "@react-navigation/stack";
import {ExploreStackParamList, HomeStackParamList} from "../../navigation";
import {SafeAreaView} from "react-native-safe-area-context";
import {ExploreSearchBar} from "./ExploreSearchBar";
import {ExploreCarousel} from "./ExploreCarousel";
import {ExploreMap} from "./ExploreMap";
import {
  Footprint,
  useGetNearFootprintsLazyQuery,
  MeDocument,
} from "../../generated/graphql";
import {useStoreState} from "../../store";
import {getDistance} from "geolib";
import {client} from "../../graphql";

const SEARCH_RADIUS = 200;

type ExploreScreenProps = StackScreenProps<
  ExploreStackParamList & HomeStackParamList,
  "Explore"
>;

export interface LocationState {
  coordinates: number[];
  zoom?: number;
}

export const ExploreScreen: React.FC<ExploreScreenProps> = () => {
  // posizione del telefono dell'utente
  const GPSPosition = useStoreState((s) => s.geo.userPosition);
  const GPSError = useStoreState((s) => s.geo.error);

  const [location, setLocation] = useState<LocationState>();
  const [showFootprints, setShowFootprints] = useState(false);
  const [currentFootprint, setCurrentFootprint] = useState(0);

  // Coordinate del centro geografico dell'ultima query
  const [lastQueryCoordinates, setLastQueryCoordinates] = useState<number[]>();

  // GRAPHQL
  const [getFootprints, {data, fetchMore}] = useGetNearFootprintsLazyQuery();
  const footprints = data ? (data.getNearFootprints as Footprint[]) : null;

  useEffect(() => {
    (async () => {
      let userPosition: number[] | null = null;

      // GPS non disponibile
      if (GPSError) {
        // Ottiene dal profilo la posizione generica dell'utente
        try {
          const {data, errors} = await client.query({query: MeDocument});
          if (!data || errors) throw new Error();
          const {coordinates} = data.whoami.location;
          userPosition = coordinates;
          setLocation({coordinates});
        } catch (err) {
          console.log(err);
          return;
        }
      }
      // Posizione disponibile
      else if (GPSPosition)
        userPosition = [GPSPosition.longitude, GPSPosition.latitude];

      // Caricamento
      if (!userPosition) return;

      // Esegue la prima ricerca
      getFootprints({
        variables: {
          lng: userPosition[0],
          lat: userPosition[1],
          maxDistance: SEARCH_RADIUS,
        },
      });

      setLastQueryCoordinates(userPosition);
    })();
  }, [GPSPosition, GPSError]);

  const setCurrentFootprintAndFly = (index: number) => {
    if (!footprints) return;
    // imposta il nuovo footprint selezionato
    setCurrentFootprint(index);
    // mostra i footprint se nascosti
    if (!showFootprints) setShowFootprints(true);
    // cambia le coordinate della mappa
    const {coordinates} = footprints[index].location;
    setLocation({coordinates});
  };

  useEffect(() => {
    if (
      !lastQueryCoordinates ||
      !location ||
      !Array.isArray(location.coordinates)
    )
      return;

    // Controlla se la nuova posizione esce dall'area delimitata
    // dal raggio entro il quale è stata eseguita la ricerca

    const {coordinates} = location;

    const distance = getDistance(
      {latitude: lastQueryCoordinates[1], longitude: lastQueryCoordinates[0]},
      {latitude: coordinates[1], longitude: coordinates[0]},
    );

    if (distance >= SEARCH_RADIUS) {
      // Cerca nuovi footprint alle nuove cordinate
      fetchMore({
        variables: {
          lng: coordinates[0],
          lat: coordinates[1],
          maxDistance: SEARCH_RADIUS,
        },
        updateQuery: (prev, {fetchMoreResult}) => {
          if (!fetchMoreResult) return prev;

          // Salva le nuove coordinate
          setLastQueryCoordinates(coordinates);

          // Rimuovere duplicati
          const newData = fetchMoreResult.getNearFootprints.filter(
            (footprint) =>
              !prev.getNearFootprints.some((item) => item.id === footprint.id),
          );

          // Aggiorna la query
          return Object.assign({}, prev, {
            getNearFootprints: [...prev.getNearFootprints, ...newData],
          });
        },
      });
    }
  }, [location]);

  return (
    <SafeAreaView style={styles.container}>
      <ExploreMap
        location={location}
        setLocation={setLocation}
        footprints={footprints}
        currentFootprint={currentFootprint}
        setCurrentFootprint={setCurrentFootprint}
      />
      <ExploreCarousel
        showFootprints={showFootprints}
        setShowFootprints={setShowFootprints}
        footprints={data?.getNearFootprints as Footprint[]}
        currentFootprint={currentFootprint}
        setCurrentFootprint={setCurrentFootprintAndFly}
      />

      <ExploreSearchBar
        setLocation={setLocation}
        showFootprints={showFootprints}
        setShowFootprints={setShowFootprints}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    position: "relative",
  },
});
