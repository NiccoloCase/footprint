import React from "react";
import {Text, Platform} from "react-native";

export const HackMarker: React.FC<any> = ({children}) =>
  Platform.select({
    ios: children,
    android: <Text style={{lineHeight: 100}}>{children}</Text>,
  });
