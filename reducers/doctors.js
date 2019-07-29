import {SET_DOCTOR_SPECIALIZATIONS} from '../actions/doctorSpecializations'
import {SET_CHOSEN_DOCTOR_SPECIALIZATIONS} from "../actions/doctorSpecializations";


const initialState = {
  doctorSpecializations: [],
  chosenDoctorSpecializations:[]
};

function doctorSpecializations  (state = initialState, action) {

  switch (action.type) {
    case SET_DOCTOR_SPECIALIZATIONS:

      return {
        ...state,
        doctorSpecializations: action.doctorSpecializationsArr
      };

    case SET_CHOSEN_DOCTOR_SPECIALIZATIONS:
      return {
        ...state,
        chosenDoctorSpecializations: action.chosenDoctorSpecializationsArr
      };

    default:
      return state
  }
}

export default doctorSpecializations;
