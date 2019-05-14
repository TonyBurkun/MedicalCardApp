import {SET_OTHER} from '../actions/other'

const initialState = {
  other: '',
};

function other (state = initialState, action) {

  switch (action.type) {
    case SET_OTHER:
      return {
        ...state,
        other: action.other
      };
    default:
      return state
  }
}

export default other;
