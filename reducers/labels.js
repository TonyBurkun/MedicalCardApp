import {SET_LABELS} from '../actions/labels'
import {ADD_LABEL} from '../actions/labels'
import {DELETE_LABEL} from "../actions/labels";
import {UPDATE_LABEL} from "../actions/labels";
import {SET_ACTIVE_LABEL} from "../actions/labels";


const initialState = {
  labels: {},
  chosenLabelsID: []
};


function labels(state=initialState, action) {
  switch(action.type) {
    case SET_LABELS:
      return (
        {
          ...state,
          labels: action.labels,
        }
      );

    case ADD_LABEL:
      const oneLabel = action.label;
      const labelID = oneLabel.id;

      const labels = Object.assign(state.labels, {[labelID]: oneLabel});


      return (
        {
          ...state,
          labels: labels
        }
      );


    case UPDATE_LABEL:

      const updatedLabel = action.label;

      Object.keys(state.labels).filter((item) => {
        if (state.labels[item].id === updatedLabel.id) {
          state.labels[item] = updatedLabel;
        }
      });

      return {
        ...state,
        labels: state.labels
      };

    case DELETE_LABEL:
      const deleteLabelID = action.labelID;
      const allLabels = state.labels;
      delete allLabels[deleteLabelID];

      return {
        ...state,
        labels: allLabels
      };

    case SET_ACTIVE_LABEL:
      return {
        ...state,
        chosenLabelsID: action.chosenLabelsID
      };


    default:
      return state
  }
}

export default labels
