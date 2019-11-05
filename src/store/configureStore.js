import { createStore, combineReducers } from "redux";

//Reducers
import temp from "../reducers/temp";

export default () => {
  const store = createStore(
    combineReducers({ temp }),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );
  console.log(store.getState());
  return store;
};
