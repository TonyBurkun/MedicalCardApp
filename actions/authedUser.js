export const GET_AUTHED_USER = 'GET_AUTHED_USER';
export const SET_AUTHED_USER_ID = 'SET_AUTHED_USER_ID';


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
