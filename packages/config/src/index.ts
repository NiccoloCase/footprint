import { IConfig } from "./config.type";
import { defaultKeys } from "./keys/default.keys";

const keys: Partial<IConfig> = (function (env) {
  switch (env) {
    // PRODUZIONE
    case "production":
      return require("./keys/production.keys");
    // SVILUPPO
    default:
      try {
        // controlla che il modulo esista
        return require("./keys/development.keys");
      } catch (e) {
        throw "Non è possibile caricare il modulo della configurazione per lo sviluppo sviluppo";
      }
  }
})(process.env.NODE_ENV);

export default {
  ...defaultKeys,
  ...keys,
} as IConfig;
