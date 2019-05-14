export const SET_DISABILITY = 'SET_DISABILITY';
export const SET_CHOSEN_DISABILITY = 'SET_CHOSEN_DISABILITY';



export function setDisability(disabilityList){
  return {
    type: SET_DISABILITY,
    disability: disabilityList
  }
}

export function setChosenDisability(chosenDisabilityList){
  return {
    type: SET_CHOSEN_DISABILITY,
    chosenDisability: chosenDisabilityList
  }
}

