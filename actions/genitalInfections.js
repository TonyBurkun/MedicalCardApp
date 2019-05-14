export const SET_GENITAL_INFECTIONS = 'SET_GENITAL_INFECTIONS';
export const SET_CHOSEN_GENITAL_INFECTIONS = 'SET_CHOSEN_GENITAL_INFECTIONS';



export function setGenitalInfections(genitalInfectionsList){
  return {
    type: SET_GENITAL_INFECTIONS,
    genitalInfections: genitalInfectionsList
  }
}

export function setChosenGenitalInfections(chosenGenitalInfectionsList){
  return {
    type: SET_CHOSEN_GENITAL_INFECTIONS,
    chosenGenitalInfections: chosenGenitalInfectionsList
  }
}

