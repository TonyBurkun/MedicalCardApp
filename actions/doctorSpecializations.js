export const SET_DOCTOR_SPECIALIZATIONS = 'SET_DOCTOR_SPECIALIZATIONS';
export const SET_CHOSEN_DOCTOR_SPECIALIZATIONS = 'SET_CHOSEN_DOCTOR_SPECIALIZATIONS';



export function setDoctorSpecializations(doctorSpecializationsArr){
  return {
    type: SET_DOCTOR_SPECIALIZATIONS,
    doctorSpecializationsArr: doctorSpecializationsArr
  }
}

export function setChosenDoctorSpecializations(chosenDoctorSpecializationsID){
  return {
    type: SET_CHOSEN_DOCTOR_SPECIALIZATIONS,
    chosenDoctorSpecializationsArr: chosenDoctorSpecializationsID
  }
}

