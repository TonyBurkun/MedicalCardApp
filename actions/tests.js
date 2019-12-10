
export const SET_CHOSEN_TEST_TYPE = 'SET_CHOSEN_TEST_TYPE';
export const SET_TEST_TYPES = 'SET_TEST_TYPE';
export const REMOVE_CHOSEN_TEST_TYPE = 'REMOVE_CHOSEN_TEST_TYPE';
export const SHOW_WARNING_POPUP_BEFORE_SAVE = 'SHOW_WARNING_POPUP_BEFORE_SAVE';

export const SET_CHOSEN_TESTS = 'SET_CHOSEN_TESTS';


export const SET_TESTS = 'SET_TESTS';
export const ADD_TEST = 'ADD_TEST';
export const UPDATE_TEST = 'UPDATE_TEST';
export const DELETE_TEST = 'DELETE_TEST';




export function setChosenTestType(chosenTestTypeList){
  return {
    type: SET_CHOSEN_TEST_TYPE,
    chosenTestTypeList: chosenTestTypeList
  }
}

export function setTestTypes(testTypesList){
  return {
    type: SET_TEST_TYPES,
    testTypesList: testTypesList
  }
}


export function setChosenIndicators(indicatorsForSave){
  return {
    type: SET_CHOSEN_TESTS,
    indicatorsForSave: indicatorsForSave
  }
}

export function showPopUpWarning(trigger){
  return {
    type: SHOW_WARNING_POPUP_BEFORE_SAVE,
    showWarningPopUp: trigger
  }
}





export function setTest(testsList){
  return {
    type: SET_TESTS,
    testsList: testsList
  }
}

export function addTest(test){
  return {
    type: ADD_TEST,
    test: test
  }
}

export function deleteTest(testID){
  return {
    type: DELETE_TEST,
    noteID: testID
  }
}

export function updateTest(test){
  return {
    type: UPDATE_TEST,
    note: test
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


