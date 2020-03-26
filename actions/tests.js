
export const SET_CHOSEN_TEST_TYPE = 'SET_CHOSEN_TEST_TYPE';
export const SET_TEST_TYPES_TITLES = 'SET_TEST_TYPES_TITLES';
export const SET_FORMED_TEST_TYPES = 'SET_FORMED_TEST_TYPES';
export const REMOVE_CHOSEN_TEST_TYPE = 'REMOVE_CHOSEN_TEST_TYPE';
export const SHOW_WARNING_POPUP_BEFORE_SAVE = 'SHOW_WARNING_POPUP_BEFORE_SAVE';
export const SAVE_INDICATORS_LIST_FOR_SHOW = 'SAVE_INDICATORS_LIST_FOR_SHOW';

export const SET_CHOSEN_TESTS = 'SET_CHOSEN_TESTS';
export const SET_CHOSEN_INDICATORS_AFTER_SAVE = 'SET_CHOSEN_INDICATORS_AFTER_SAVE';


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

export function setTestTypesTitle(testTypesTitleList){
  return {
    type: SET_TEST_TYPES_TITLES,
    testTypesTitleList: testTypesTitleList
  }
}

export function setFormedTestTypes(formedTestTypesList){
  return {
    type: SET_FORMED_TEST_TYPES,
    formedTestTypesList: formedTestTypesList
  }
}


export function setChosenIndicators(indicatorsForSave){
  return {
    type: SET_CHOSEN_TESTS,
    indicatorsForSave: indicatorsForSave
  }
}


export function setIndicatorAfterSave(indicatorsForSave){
  return {
    type: SET_CHOSEN_INDICATORS_AFTER_SAVE,
    indicatorsForTestCreation: indicatorsForSave
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
    testID: testID
  }
}

export function updateTest(test){
  return {
    type: UPDATE_TEST,
    test: test
  }
}

export function saveIndicatorsListForShow(indicatorsListForShow) {
  return {
    type: SAVE_INDICATORS_LIST_FOR_SHOW,
    indicatorsListForShow,
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


