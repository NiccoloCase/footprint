import { IConfig } from "../config.type";
import { RecursivePartial } from "@footprint/common";

export const productionKeys: RecursivePartial<IConfig> = {
  IS_PRODUCTION: true,
  server: {
    PORT: Number(process.env.PORT!),
    API_URL: process.env.API_URL!,
  },
  webApp: {
    DOMAIN: process.env.WEB_APP_DOMAIN!,
  },
  database: {
    URI: process.env.MONGO_URI!,
  },
  auth: {
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET!,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET!,
    ACCESS_TOKEN_EXPIRATION: 900, // 15 min
    REFRESH_TOKEN_EXPIRATION: 604800, // 7 giorni
  },
};
