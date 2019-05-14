import {SET_ALLERGIC_REACTIONS} from '../actions/allergicReactions'

const initialState = {
  allergicReactions: '',
};

function allergicReactions (state = initialState, action) {

  switch (action.type) {
    case SET_ALLERGIC_REACTIONS:
      return {
        ...state,
        allergicReactions: action.allergicReactions
      };
    default:
      return state
  }
}

export default allergicReactions;
