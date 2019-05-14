export const SET_GYNECOLOGICAL_DISEASES = 'SET_GYNECOLOGICAL_DISEASES';
export const SET_CHOSEN_GYNECOLOGICAL_DISEASES = 'SET_CHOSEN_GYNECOLOGICAL_DISEASES';



export function setGynecologicalDiseases(gynecologicalDiseasesList){
  return {
    type: SET_GYNECOLOGICAL_DISEASES,
    gynecologicalDiseases: gynecologicalDiseasesList
  }
}

export function setChosenGynecologicalDiseases(chosenGynecologicalDiseasesList){
  return {
    type: SET_CHOSEN_GYNECOLOGICAL_DISEASES,
    chosenGynecologicalDiseases: chosenGynecologicalDiseasesList

  }
}

