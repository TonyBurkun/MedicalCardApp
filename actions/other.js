export const SET_OTHER = 'SET_OTHER';

export function setOther(otherString){
  return {
    type: SET_OTHER,
    other: otherString
  }
}
