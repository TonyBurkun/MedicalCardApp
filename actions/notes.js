export const SET_PILLS_TYPE = 'SET_PILLS_TYPE';
export const SET_CHOSEN_PILLS = 'SET_CHOSEN_PILLS';
export const REMOVE_CHOSEN_PILL = 'REMOVE_CHOSEN_PILL';
export const SET_CHOSEN_PILLS_TYPE = 'SET_CHOSEN_PILLS_TYPE';

export const SET_NOTES = 'SET_NOTES';
export const ADD_NOTE = 'ADD_NOTE';
export const UPDATE_NOTE = 'UPDATE_NOTE';
export const DELETE_NOTE = 'DELETE_NOTE';


// export function setPillsTypeList(pillsTypeList) {
//   return {
//     type: SET_PILLS_TYPE,
//     pillsTypeList: pillsTypeList
//   }
// }
//
// export function saveChosenPillsType(chosenPillsTypeID){
//   return {
//     type: SET_CHOSEN_PILLS_TYPE,
//     chosenPillsTypeArr: chosenPillsTypeID
//   }
// }


export function addNote(note){
  return {
    type: ADD_NOTE,
    note: note
  }
}

export function setNotes(notesList){
  return {
    type: SET_NOTES,
    notesList: notesList
  }
}

export function deleteNote(noteID){
  return {
    type: DELETE_NOTE,
    noteID: noteID
  }
}

export function updateNote(note){
  return {
    type: UPDATE_NOTE,
    note: note
  }
}

//
// export function setChosenPills(chosenPillsID){
//   return {
//     type: SET_CHOSEN_PILLS,
//     chosenPillsID: chosenPillsID,
//
//   }
// }
//
// export function removeChosePill(pillID) {
//   return  {
//     type: REMOVE_CHOSEN_PILL,
//     pillID: pillID
//   }
// }


