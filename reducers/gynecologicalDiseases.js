import {SET_GYNECOLOGICAL_DISEASES} from '../actions/gynecologicalDiseases'
import {SET_CHOSEN_GYNECOLOGICAL_DISEASES} from '../actions/gynecologicalDiseases';

const initialState = {
  gynecologicalDiseases: [],
  chosenGynecologicalDiseases: [],
};

function gynecologicalDiseases (state = initialState, action) {

  switch (action.type) {
    case SET_GYNECOLOGICAL_DISEASES:

      let gynecologicalDiseasesArr = action.gynecologicalDiseases.map((item, index) => {
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
        gynecologicalDiseases: gynecologicalDiseasesArr
      };

    case SET_CHOSEN_GYNECOLOGICAL_DISEASES:
      return {
        ...state,
        chosenGynecologicalDiseases: action.chosenGynecologicalDiseases
      };

    default:
      return state
  }
}

export default gynecologicalDiseases;
