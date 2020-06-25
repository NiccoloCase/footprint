import { IConfig } from "../config.type";

const productionKeys: Partial<IConfig> = {
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
};

export default productionKeys;
