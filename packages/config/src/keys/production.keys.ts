import { IConfig } from "../config.type";
import { RecursivePartial } from "@footprint/common";

export const productionKeys: RecursivePartial<IConfig> = {
  IS_PRODUCTION: true,
  server: {
    PORT: Number(process.env.PORT!),
  },
  webApp: {
    DOMAIN: process.env.WEB_APP_DOMAIN!,
  },
  database: {
    URI: process.env.MONGO_URI!,
  },
};
