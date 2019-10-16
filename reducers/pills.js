import {REMOVE_CHOSEN_PILL, SET_PILLS} from '../actions/pills'
import {ADD_PILL} from '../actions/pills'
import {UPDATE_PILL} from '../actions/pills'
import {DELETE_PILL} from '../actions/pills'
import {SET_CHOSEN_PILLS} from '../actions/pills'
import {SET_PILLS_TYPE} from '../actions/pills'
import {SET_CHOSEN_PILLS_TYPE} from '../actions/pills'




const initialState = {
  pillsTypeList: [],
  pillsList:[],
  chosenPillsID: [],
  chosenPillsTypeArr: []
};


function pills  (state = initialState, action) {

  switch (action.type) {
    case SET_PILLS_TYPE:

      return {
        ...state,
        pillsTypeList: action.pillsTypeList
      };

    case SET_CHOSEN_PILLS_TYPE:
      return {
        ...state,
        chosenPillsTypeArr: action.chosenPillsTypeArr
      };

    case SET_PILLS:
      return {
        ...state,
        pillsList: action.pillsList
      };

    case ADD_PILL:
      let newPill = action.pill;
      let pillID = newPill.id;
      let pills = Object.assign(state.pillsList, {[pillID]: newPill});

      return (
        {
          ...state,
          pillsList: pills
        }
      );

    case UPDATE_PILL:

      let updatedPill = action.pill;
      Object.keys(state.pillsList).filter((item) => {
        if (state.pillsList[item].id === updatedPill.id) {
          state.pillsList[item] = updatedPill;
        }
      });

      return {
        ...state,
        pillsList: state.pillsList
      };

    case DELETE_PILL:
      let deletedPillID = action.pillID;
      const pillsList = state.pillsList;
      delete pillsList[deletedPillID];


      return {
        ...state,
        pillsList: pillsList
      };

    case SET_CHOSEN_PILLS:
      return {
        ...state,
        chosenPillsID: action.chosenPillsID
      };

    case REMOVE_CHOSEN_PILL:
      return {
        ...state,
        chosenPillsID: state.chosenPillsID.filter(item => {
          return item !== action.pillID
        })
      };

    default:
      return state
  }
}

export default pills;
