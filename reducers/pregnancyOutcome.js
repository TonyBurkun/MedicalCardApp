import {SET_PREGNANCY_OUTCOME} from '../actions/pregnancyOutcome'
import {SET_CHOSEN_PREGNANCY_OUTCOME} from '../actions/pregnancyOutcome';

const initialState = {
  pregnancyOutcome: [],
  chosenPregnancyOutcome: [],
};

function pregnancyOutcome (state = initialState, action) {

  switch (action.type) {
    case SET_PREGNANCY_OUTCOME:

      let pregnancyOutcomeArr = action.pregnancyOutcome.map((item, index) => {
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
        pregnancyOutcome: pregnancyOutcomeArr
      };

    case SET_CHOSEN_PREGNANCY_OUTCOME:
      return {
        ...state,
        chosenPregnancyOutcome: action.chosenPregnancyOutcome
      };

    default:
      return state
  }
}

export default pregnancyOutcome;
