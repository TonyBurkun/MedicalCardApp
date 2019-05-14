export const SET_CHILDHOOD_DISEASES = 'SET_CHILDHOOD_DISEASES';
export const SET_CHOSEN_CHILDHOOD_DISEASES = 'SET_CHOSEN_CHILDHOOD_DISEASES';



export function setChildhoodDiseases(childhoodDiseasesList){
  return {
    type: SET_CHILDHOOD_DISEASES,
    childhoodDiseases: childhoodDiseasesList
  }
}

export function setChosenChildhoodDiseases(chosenChildhoodDiseasesList){
  return {
    type: SET_CHOSEN_CHILDHOOD_DISEASES,
    chosenChildhoodDiseases: chosenChildhoodDiseasesList

  }
}

