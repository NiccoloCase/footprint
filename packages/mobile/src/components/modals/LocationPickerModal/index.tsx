import React, {useState, useEffect, useMemo} from "react";
import {SelectModal} from "../SelectModal";
import {
  placeAutocomplete,
  getPlaceNameFromCoordinates,
} from "../../../utils/geocode";
import {
  Location,
  LocationType,
  PointLocation,
} from "../../../generated/graphql";
import {useStoreState} from "../../../store";

interface LocationPickerModalProps {
  title?: string;
  subtitle?: string;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  onLocationSelected: (location: PointLocation) => void;
  selectedLocation?: PointLocation;
}

export const LocationPickerModal: React.FC<LocationPickerModalProps> = ({
  onLocationSelected,
  selectedLocation,
  ...props
}) => {
  const GPSPosition = useStoreState((s) => s.geo.userPosition);
  const [results, setRestults] = useState<any[]>([]);
  const [defaultOptions, setDefaultOptions] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      if (GPSPosition) {
        const {longitude, latitude} = GPSPosition;
        const data = await getPlaceNameFromCoordinates(longitude, latitude);
        const names = data.map((place) => place.place_name);

        setRestults([...results, ...data]);
        setDefaultOptions(
          selectedLocation
            ? [...new Set([selectedLocation.locationName, ...names])]
            : names,
        );
      }
    })();
  }, [GPSPosition]);

  const fetchOptions = async (query: string) => {
    const data = await placeAutocomplete(query, {
      superficialResearch: true,
    });
    setRestults(data);
    return data.map((place) => place.place_name);
  };

  const onSelected = (locationName: string) => {
    const place = results.find((res) => res.place_name === locationName);
    if (place)
      onLocationSelected({
        locationName,
        coordinates: place.center,
      });
  };

  return (
    <SelectModal
      title="Indica in che nazione/città risiedi"
      subtitle="A rispetto della tua privacy chiediamo solo un'indicazione approssimativa"
      serachBarPlaceholder="Cerca un luogo..."
      searchOptions={fetchOptions}
      onSelected={onSelected}
      defaultOptions={defaultOptions}
      selectedOption={
        selectedLocation ? selectedLocation.locationName : undefined
      }
      {...props}
    />
  );
};
