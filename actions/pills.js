

export const SET_PILLS_TYPE = 'SET_PILLS_TYPE';

export const SET_PILLS = 'SET_PILLS';
export const ADD_PILL = 'ADD_PILL';
export const UPDATE_PILL = 'UPDATE_PILL';
export const DELETE_PILL = 'DELETE_PILL';
export const SET_CHOSEN_PILLS = 'SET_CHOSEN_PILLS';
export const SET_CHOSEN_PILLS_TYPE = 'SET_CHOSEN_PILLS_TYPE';


export function setPillsTypeList(pillsTypeList) {
  return {
    type: SET_PILLS_TYPE,
    pillsTypeList: pillsTypeList
  }
}

export function saveChosenPillsType(chosenPillsTypeID){
  return {
    type: SET_CHOSEN_PILLS_TYPE,
    chosenPillsTypeArr: chosenPillsTypeID
  }
}

export function addPill(pill){
  return {
    type: ADD_PILL,
    pill: pill
  }
}

export function setPills(pillsList){
  return {
    type: SET_PILLS,
    pillsList: pillsList
  }
}

export function deletePill(pillID){
  return {
    type: DELETE_PILL,
    pillID: pillID
  }
}

export function updatePill(pill){
  return {
    type: UPDATE_PILL,
    pill: pill
  }
}
