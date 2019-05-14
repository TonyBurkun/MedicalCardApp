import {SET_DISABILITY} from '../actions/disability'
import {SET_CHOSEN_DISABILITY} from '../actions/disability';

const initialState = {
  disability: [],
  chosenDisability: [],
};

function disability  (state = initialState, action) {

  switch (action.type) {
    case SET_DISABILITY:

      let disabilityArr = action.disability.map((item, index) => {
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
        disability: disabilityArr
      };

    case SET_CHOSEN_DISABILITY:
      return {
        ...state,
        chosenDisability: action.chosenDisability
      };

    default:
      return state
  }
}

export default disability;
