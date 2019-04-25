export const SET_CHILDHOOD_DISEASES = 'SET_CHILDHOOD_DISEASES';


export function setChildhoodDiseases(childhoodDiseasesList){
  return {
    type: SET_CHILDHOOD_DISEASES,
    childhoodDiseases: childhoodDiseasesList
  }
}

