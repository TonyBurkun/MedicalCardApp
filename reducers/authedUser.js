import {GET_AUTHED_USER, SET_AUTHED_USER_ID, UPDATE_CURRENT_USER_DATA} from '../actions/authedUser'

const initialState = {
  currentUserUID: '',
  currentUserData: {}
};

function authedUser (state = initialState, action) {
  switch (action.type) {
    case GET_AUTHED_USER:
      return {
        ...state,
        currentUserData: action.currentUser
      };

    case SET_AUTHED_USER_ID:
      return {
        ...state,
        currentUserUID: action.id
      };

    case UPDATE_CURRENT_USER_DATA:
      return {
        ...state,
        currentUserData: action.currentUserData
      };

    default:
      return state
  }
}

export default authedUser;
