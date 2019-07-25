export const SET_LABELS = 'SET_LABELS';
export const ADD_LABEL = 'ADD_LABEL';
export const UPDATE_LABEL = 'UPDATE_LABEL';
export const DELETE_LABEL = 'DELETE_LABEL';
export const SET_ACTIVE_LABEL = 'SET_ACTIVE_LABEL';



export function setLabels(labelsList){
  return {
    type: SET_LABELS,
    labels: labelsList
  }
}

export function addLabel(label){
  return {
    type: ADD_LABEL,
    label: label
  }
}

export function updateLabel(label){
  return {
    type: UPDATE_LABEL,
    label: label
  }
}

export function deleteLabel(labelID){
  return {
    type: DELETE_LABEL,
    labelID: labelID
  }
}


export function saveChosenLabel(chosenLabelsID){
  return {
    type: SET_ACTIVE_LABEL,
    chosenLabelsID: chosenLabelsID,

  }
}
