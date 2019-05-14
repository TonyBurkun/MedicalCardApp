export const SET_BAD_HABITS = 'SET_BAD_HABITS';
export const SET_CHOSEN_BAD_HABITS = 'SET_CHOSEN_BAD_HABITS';



export function setBadHabits(badHabitsList){
  return {
    type: SET_BAD_HABITS,
    badHabits: badHabitsList
  }
}

export function setChosenBadHabits(chosenBadHabitsList){
  return {
    type: SET_CHOSEN_BAD_HABITS,
    chosenBadHabits: chosenBadHabitsList
  }
}

