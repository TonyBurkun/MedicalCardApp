export const SET_DOCTORS = 'SET_DOCTORS';
export const ADD_DOCTOR = 'ADD_DOCTOR';
export const UPDATE_DOCTOR = 'UPDATE_DOCTOR';
export const DELETE_DOCTOR = 'DELETE_DOCTOR';




export function setDoctors(doctorsList){
  return {
    type: SET_DOCTORS,
    doctorsList: doctorsList
  }
}

export function addDoctor(doctor){
  return {
    type: ADD_DOCTOR,
    doctor: doctor
  }
}

export function updateDoctor(doctor){
  return {
    type: UPDATE_DOCTOR,
    doctor: doctor
  }
}

export function deleteDoctor(doctorID){
  return {
    type: DELETE_DOCTOR,
    doctorID: doctorID
  }
}
