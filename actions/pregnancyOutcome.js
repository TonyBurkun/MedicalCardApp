export const SET_PREGNANCY_OUTCOME = 'SET_PREGNANCY_OUTCOME';
export const SET_CHOSEN_PREGNANCY_OUTCOME = 'SET_CHOSEN_PREGNANCY_OUTCOME';



export function setPregnancyOutcome(pregnancyOutcomeList){
  return {
    type: SET_PREGNANCY_OUTCOME,
    pregnancyOutcome: pregnancyOutcomeList
  }
}

export function setChosenPregnancyOutcome(chosenPregnancyOutcomeList){
  return {
    type: SET_CHOSEN_PREGNANCY_OUTCOME,
    chosenPregnancyOutcome: chosenPregnancyOutcomeList
  }
}

