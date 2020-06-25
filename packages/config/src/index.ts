import { merge } from "lodash";
import { IConfig } from "./config.type";
import { defaultKeys } from "./keys/default.keys";
import { RecursivePartial } from "@footprint/common";

const keys: RecursivePartial<IConfig> = (function (env) {
  switch (env) {
    // CONFIGURAZIONE PER LA PRODUZIONE
    case "production":
      return require("./keys/production.keys").productionKeys;
    // CONFIGURAZIONE PER LO SVILUPPO
    default:
      try {
        // controlla che il modulo esista
        return require("./keys/development.keys").developmentKeys;
      } catch (e) {
        throw "Non è possibile caricare il modulo della configurazione per lo sviluppo sviluppo";
      }
  }
})(process.env.NODE_ENV);

const config = merge(defaultKeys, keys) as IConfig;
export default config;
