import auth, {AuthModel} from "./auth";

export interface StoreModel {
  auth: AuthModel;
}

const model: StoreModel = {
  auth,
};

export default model;
