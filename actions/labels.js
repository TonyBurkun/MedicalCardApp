export const SET_LABELS = 'SET_LABELS';
export const UPDATE_LABELS = 'UPDATE_LABELS';


export function setLabels(labelsList){
  return {
    type: SET_LABELS,
    labels: labelsList
  }
}

export function updateLabels(label){
  return {
    type: UPDATE_LABELS,
    label: label
  }
}
