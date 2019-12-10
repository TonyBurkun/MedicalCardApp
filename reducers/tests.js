import {SET_TEST_TYPES, SET_TESTS} from '../actions/tests'
import {ADD_TEST} from '../actions/tests'
import {UPDATE_TEST} from '../actions/tests'
import {DELETE_TEST} from '../actions/tests'
import {SET_CHOSEN_TEST_TYPE} from '../actions/tests'
import {SET_CHOSEN_TESTS} from '../actions/tests'
import {SHOW_WARNING_POPUP_BEFORE_SAVE} from '../actions/tests'


const initialState = {
  testsList:[],
  testTypesList: [],
  chosenTestType: [],
  indicatorsListForSave: [],
  showWarningPopUp: false,
};


function tests (state = initialState, action) {

  switch (action.type) {

    case SET_CHOSEN_TEST_TYPE:
      return {
        ...state,
        chosenTestType: action.chosenTestTypeList
      };

    case SET_TEST_TYPES:
      return {
        ...state,
        testTypesList: action.testTypesList
      };

    case SET_CHOSEN_TESTS:
      return {
        ...state,
        indicatorsListForSave: action.indicatorsForSave
      };

    case SHOW_WARNING_POPUP_BEFORE_SAVE:

      return{
        ...state,
        showWarningPopUp: action.showWarningPopUp
      };



    case SET_TESTS:
      return {
        ...state,
        testsList: action.testsList
      };

    case ADD_TEST:
      let newTest = action.test;
      let testID = newTest.id;
      let tests = Object.assign(state.testsList, {[testID]: newTest});

      return (
        {
          ...state,
          testsList: tests
        }
      );
    //
    // case UPDATE_NOTE:
    //
    //   let updatedNote = action.note;
    //   Object.keys(state.notesList).filter((item) => {
    //     if (state.notesList[item].id === updatedNote.id) {
    //       state.notesList[item] = updatedNote;
    //     }
    //   });
    //
    //   return {
    //     ...state,
    //     notesList: state.notesList
    //   };
    //
    // case DELETE_NOTE:
    //   let deletedNoteID = action.noteID;
    //   const notesList = state.notesList;
    //   delete notesList[deletedNoteID];
    //
    //
    //   return {
    //     ...state,
    //     notesList: notesList
    //   };

    default:
      return state
  }
}

export default tests;
