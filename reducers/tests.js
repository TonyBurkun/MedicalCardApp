import {SET_TEST_TYPES, SET_TESTS} from '../actions/tests'
import {ADD_TEST} from '../actions/tests'
import {UPDATE_TEST} from '../actions/tests'
import {DELETE_TEST} from '../actions/tests'
import {SET_CHOSEN_TEST_TYPE} from '../actions/tests'
import {SET_CHOSEN_TESTS} from '../actions/tests'
import {SHOW_WARNING_POPUP_BEFORE_SAVE} from '../actions/tests'
import {updateUserData} from "../utils/API";


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
    case UPDATE_TEST:

      let updatedTest = action.test;
      // console.log(updatedTest);
      // console.log( state.testsList);
      Object.keys(state.testsList).filter((item) => {
        if (state.testsList[item].id === updatedTest.id) {
          state.testsList[item] = updatedTest;
        }
      });

      console.log( state.testsList);

      return {
        ...state,
        testsList: state.testsList
      };

    case DELETE_TEST:
      let deleteTestID = action.testID;
      const testsList = state.testsList;
      delete testsList[deleteTestID];

      console.log(testsList);


      return {
        ...state,
        testsList: testsList
      };

    default:
      return state
  }
}

export default tests;
