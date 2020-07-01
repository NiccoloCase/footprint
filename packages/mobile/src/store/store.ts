import {createStore, createTypedHooks} from "easy-peasy";
import model, {StoreModel} from "./models";

export const store = createStore(model);

export const {
  useStoreActions,
  useStoreDispatch,
  useStoreState,
} = createTypedHooks<StoreModel>();
