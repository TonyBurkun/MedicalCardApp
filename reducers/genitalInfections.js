import {SET_GENITAL_INFECTIONS} from '../actions/genitalInfections'
import {SET_CHOSEN_GENITAL_INFECTIONS} from '../actions/genitalInfections';

const initialState = {
  genitalInfections: [],
  chosenGenitalInfections: [],
};

function genitalInfections  (state = initialState, action) {

  switch (action.type) {
    case SET_GENITAL_INFECTIONS:

      let genitalInfectionsArr = action.genitalInfections.map((item, index) => {
        return (
          {
            id: index,
            value: item,
            check: false,
            date: ''
          }
        )
      });

      return {
        ...state,
        genitalInfections: genitalInfectionsArr
      };

    case SET_CHOSEN_GENITAL_INFECTIONS:
      return {
        ...state,
        chosenGenitalInfections: action.chosenGenitalInfections
      };

    default:
      return state
  }
}

export default genitalInfections;
