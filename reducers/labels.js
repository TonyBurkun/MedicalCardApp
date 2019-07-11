import {SET_LABELS} from '../actions/labels'
import {UPDATE_LABELS} from '../actions/labels'


const initialState = {
  labels: {},
};


function labels(state=initialState, action) {
  switch(action.type) {
    case SET_LABELS:
      console.log(state);
      console.log('loaded');
      return (
        {
          ...state,
          labels: action.labels,
        }
      );

    case UPDATE_LABELS:
      const oneLabel = action.label;
      const labelID = oneLabel.id;

      const labels = Object.assign(state.labels, {[labelID]: oneLabel});


      return (
        {
          ...state,
          labels: labels
        }
      );


    default:
      return state
  }
}

export default labels
