import {SET_CHILDHOOD_DISEASES} from '../actions/childhoodDiseases'

const initialState = {
  childhoodDiseases: [],
};

function addChildhoodDiseases (state = initialState, action) {
  switch (action.type) {
    case SET_CHILDHOOD_DISEASES:
      return {
        ...state,
        childhoodDiseases: action.childhoodDiseases
      };

    default:
      return state
  }
}

export default addChildhoodDiseases;
