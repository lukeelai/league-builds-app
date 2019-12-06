import { createStore, combineReducers } from "redux";

//Reducers
import summoner from "../reducers/summoner";

export default () => {
  const store = createStore(
    combineReducers({ summoner }),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );
  console.log(store.getState());
  return store;
};
