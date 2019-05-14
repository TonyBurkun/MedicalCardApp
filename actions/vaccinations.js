export const SET_VACCINATIONS = 'SET_VACCINATIONS';
export const SET_CHOSEN_VACCINATIONS = 'SET_CHOSEN_VACCINATIONS';



export function setVaccinations(vaccinationsList){
  return {
    type: SET_VACCINATIONS,
    vaccinations: vaccinationsList
  }
}

export function setChosenVaccinations(chosenVaccinationsList){
  return {
    type: SET_CHOSEN_VACCINATIONS,
    chosenVaccinations: chosenVaccinationsList

  }
}

