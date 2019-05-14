import {SET_VACCINATIONS} from '../actions/vaccinations'
import {SET_CHOSEN_VACCINATIONS} from '../actions/vaccinations';

const initialState = {
  vaccinations: [],
  chosenVaccinations: [],
};

function vaccinations (state = initialState, action) {

  switch (action.type) {
    case SET_VACCINATIONS:

      let vaccinationsArr = action.vaccinations.map((item, index) => {
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
        vaccinations: vaccinationsArr
      };

    case SET_CHOSEN_VACCINATIONS:
      return {
        ...state,
        chosenVaccinations: action.chosenVaccinations
      };

    default:
      return state
  }
}

export default vaccinations;
