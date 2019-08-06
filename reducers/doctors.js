import {SET_DOCTOR_SPECIALIZATIONS} from '../actions/doctorSpecializations'
import {SET_CHOSEN_DOCTOR_SPECIALIZATIONS} from "../actions/doctorSpecializations";

import {SET_DOCTORS} from '../actions/doctors'
import {ADD_DOCTOR} from '../actions/doctors'
import {UPDATE_DOCTOR} from '../actions/doctors'
import {DELETE_DOCTOR} from '../actions/doctors'


const initialState = {
  doctorSpecializations: [],
  chosenDoctorSpecializations:[],
  doctorsList: {}
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


    case SET_DOCTORS:
      return {
        ...state,
        doctorsList: action.doctorsList
      };


    case ADD_DOCTOR:
      let newDoctor = action.doctor;
      let doctorID = newDoctor.id;
      let doctors = Object.assign(state.doctorsList, {[doctorID]: newDoctor});

      return (
        {
          ...state,
          doctorsList: doctors
        }
      );

    case UPDATE_DOCTOR:

      let updatedDoctor = action.doctor;
      Object.keys(state.doctorsList).filter((item) => {
        if (state.doctorsList[item].id === updatedDoctor.id) {
          state.doctorsList[item] = updatedDoctor;
        }
      });

      return {
        ...state,
        doctorsList: state.doctorsList
      };

    case DELETE_DOCTOR:
      let deletedDoctorID = action.doctorID;
      const doctorsList = state.doctorsList;
      delete doctorsList[deletedDoctorID];


      return {
        ...state,
        doctorsList: doctorsList
      };








    default:
      return state
  }
}

export default doctorSpecializations;
