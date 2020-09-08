import { merge } from "lodash";
import { IConfigKeys } from "./keys.type";
import { defaultKeys } from "./keys.default";
import { RecursivePartial } from "@footprint/common";

const secretKeys: RecursivePartial<IConfigKeys> = (function (env) {
  switch (env) {
    // CONFIGURAZIONE PER LA PRODUZIONE
    case "production":
      return require("./keys.production").productionKeys;
    // CONFIGURAZIONE PER LO SVILUPPO
    default:
      try {
        // Controlla che il modulo esista
        return require("./keys.development").developmentKeys;
      } catch (e) {
        throw "Non è possibile caricare il modulo della configurazione per lo sviluppo sviluppo";
      }
  }
})(process.env.NODE_ENV);

const k = merge(defaultKeys, secretKeys) as IConfigKeys;
console.log(k);
export const keys = k;
