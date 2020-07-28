import auth, {AuthModel} from "./auth";
import geo, {GeoModel} from "./geolocation";

export interface StoreModel {
  auth: AuthModel;
  geo: GeoModel;
}

const model: StoreModel = {
  auth,
  geo,
};

export default model;
