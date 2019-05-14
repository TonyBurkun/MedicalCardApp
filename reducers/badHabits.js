import {SET_BAD_HABITS} from '../actions/badHabits'
import {SET_CHOSEN_BAD_HABITS} from '../actions/badHabits';

const initialState = {
  badHabits: [],
  chosenBadHabits: [],
};

function badHabits  (state = initialState, action) {

  switch (action.type) {
    case SET_BAD_HABITS:

      let badHabitsArr = action.badHabits.map((item, index) => {
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
        badHabits: badHabitsArr
      };

    case SET_CHOSEN_BAD_HABITS:
      return {
        ...state,
        chosenBadHabits: action.chosenBadHabits
      };

    default:
      return state
  }
}

export default badHabits;
