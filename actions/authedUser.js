export const GET_AUTHED_USER = 'GET_AUTHED_USER';
export const SET_AUTHED_USER_ID = 'SET_AUTHED_USER_ID';
export const UPDATE_CURRENT_USER_DATA = 'UPDATE_CURRENT_USER_DATA';


export function getAuthedUserAction(currentUser){
  return {
    type: GET_AUTHED_USER,
    currentUser
  }
}

export function setAuthedUserID(id) {
  return {
    type: SET_AUTHED_USER_ID,
    id
  }
}

export function updateCurrentUserData(currentUserData){
  return {
    type: UPDATE_CURRENT_USER_DATA,
    currentUserData,
  }
}
