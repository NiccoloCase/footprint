import { IConfig } from "../config.type";
import { RecursivePartial } from "@footprint/common";

export const defaultKeys: RecursivePartial<IConfig> = {
  APP_NAME: "Footprint",
  MAPBOX_ACCESS_TOKEN:
    "pk.eyJ1IjoibmljY29jYXNlIiwiYSI6ImNqcG1uem0wdDAxMTQ0MnJ3ZXF4N3dsOWMifQ.4Yq9p3SQ8U23fCF13m-7pw",
  googleOAuth: {
    WEB_CLIENT_ID:
      "205105474204-qtc50kv97tri6ca3cel9elprd1g2gn4s.apps.googleusercontent.com",
  },
  server: {
    GRAPHQL_PATH: "/api/graphql",
  },
};
