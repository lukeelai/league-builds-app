import { ADD_SUMMONER } from "../actions/actionTypes";

const summonerDefaultState = [];

export default (state = summonerDefaultState, action) => {
  switch (action.type) {
    case ADD_SUMMONER:
      return [...state, action.summoner];
    default:
      return state;
  }
};
