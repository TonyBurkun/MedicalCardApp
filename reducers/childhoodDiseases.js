import {SET_CHILDHOOD_DISEASES} from '../actions/childhoodDiseases'
import {SET_CHOSEN_CHILDHOOD_DISEASES} from '../actions/childhoodDiseases';

const initialState = {
  childhoodDiseases: [],
  chosenChildhoodDiseases: [],
};

function addChildhoodDiseases (state = initialState, action) {

  switch (action.type) {
    case SET_CHILDHOOD_DISEASES:

      let childhoodDiseasesArr = action.childhoodDiseases.map((item, index) => {
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
        childhoodDiseases: childhoodDiseasesArr
      };

    case SET_CHOSEN_CHILDHOOD_DISEASES:
      return {
        ...state,
        chosenChildhoodDiseases: action.chosenChildhoodDiseases
      };

    default:
      return state
  }
}

export default addChildhoodDiseases;
